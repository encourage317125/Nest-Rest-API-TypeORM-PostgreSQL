'use strict';

import { Injectable } from '@nestjs/common';
import { JWTHelper } from '../../util/jwt';
import { UserFacade } from '../facade';
import { User, Account, ApiKey } from '../../models';
import { compare as comparePassword } from 'bcrypt';
import { OpentactService } from '../opentact';
import { BaseService } from '../services/base.service';
import { GoogleService } from '../google';
import { errorMessagesConfig } from "../../util/error";
import { FacebookService } from '../facebook';
import { HelperClass } from '../../filters/Helper';

@Injectable()
export class AuthService extends BaseService {

    constructor(
    private userFacade: UserFacade,
    private opentactService: OpentactService,
    private googleService: GoogleService,
    private facebookService: FacebookService
    ) {
        super()
    }

    static async generateToken(user: User, remoteAddress: string, userAgent, nonce: string, isAdmin, opentactToken, userUuid: any) {
        let token = await JWTHelper.sign({
            //accountId: user.accountID,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            userEmail: user.email,
            //active: isActive,
            remoteAddress: remoteAddress,
            userAgent: userAgent,
            nonce: nonce,
            //accountNumber: account.number,
            userId: user.id,
            opentactToken: opentactToken,
            userType: user.type,
            is_admin: isAdmin,
            userUuid: userUuid,
        });
        if (!token) throw new Error('user:tokenError');
        return token;
    }

    static response(user): SignInResponse {
        return {
            user
        };
    }



    public async signIn(credentials: any, remoteAddress: string, userAgent): Promise<SignInResponse> {
        const user: any = await this.userFacade.findByEmail(credentials.email);
        if (!user) throw new Error('user:userDoesNotExist');
        //const account: any = await this.userFacade.findAccountByAccountId(user.accountID);
        //if (!account) throw new Error('user:accountDoNotExistForThisUser');
        if (!user.active) throw new Error('user:userInactivated');
        // if (!account.status) throw new Error('account:planIsNotPaid');
        if (!user.emailConfirmed) throw new Error('user:emailIsNotConfirmed');
        const equals = await comparePassword(credentials.password, user.password ? user.password : '');
        if (!equals) throw new Error('user:incorrectPassword');
        let isAdmin = (user.isAdmin) ? user.isAdmin : false;
        // let nonce = await this.opentactService.nonce();
        // let adminToken = await this.opentactService.adminLoginGettignToken();
        // let userTokenOpentact = (!isAdmin) ? await this.opentactService.getSessionTokenByUuidAndNonce(nonce.nonce, user.uuid) : null;
        // let opentactToken = (isAdmin) ? adminToken.token : userTokenOpentact.sessionToken;
        let opentactToken = (isAdmin) ? 'admintoken123456789' : 'usertoken123456789';
        user.token = await AuthService.generateToken(user, remoteAddress, userAgent, user.salt || '', isAdmin, opentactToken, user.uuid);
        user.password = undefined;
        user.salt = undefined;
        // let company = await this.userFacade.getAllCompaniesByUserIdAndAccountId(user.id, account.id);
        await this.userFacade.updateUserLastLoginField(user.id);
        return AuthService.response(user);

    }

    // public async signUp(user: User): Promise<SignInResponse> {
    //    // console.log(user)
    //     try {
    //         return await this.userFacade.signupUser(user);
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    public async signUp(body): Promise<SignInResponse> {
        // console.log(user)
        try {
            const user = new User();
            user.email = body.email;
            user.firstName = body.firstName;
            user.lastName = body.lastName;
            user.password = body.password;
            user.rePassword = body.rePassword;
            // user.companyName = body.companyName;
            const response = await this.userFacade.signupUser(user);
            if (response.user) {
                response.user.password = undefined;
                response.user.salt = undefined;
            }
            
            return response
        } catch (err) {
            console.log(err)
            return { error: err.message }
            // throw err;
        }
    }

    public googleSignIn = async () => {
        const url = this.googleService.urlGoogle()
        return {
            url
        }
    }

    public facebookSignIn = () => {
        const url = this.facebookService.getLoginUrl()

        return {
            url
        }
    }

    public confirmAuthCode = async (req, code, type) => {
        let userAgent = req.headers['user-agent'];

        let remoteAddress = req.headers["X-Forwarded-For"]
            || req.headers["x-forwarded-for"]
            || req.client.remoteAddress;

        try {
            let account: any = null
            if (type === 'google') {
                account = await this.googleService.getGoogleAccountFromCode(code)
            } else if (type === 'fb') {
                account = await this.facebookService.getFacebookUserData(code)
            }

            if (!account) {
            await HelperClass.throwErrorHelper('auth:BadRequest');
            }
            let user: any = await this.userFacade.findByEmail(account.email);
            if (!user) {
                const new_user = new User();
                new_user.email = account.email;
                new_user.emailConfirmed = true
                if (account.first_name && account.last_name) {
                    new_user.firstName = account.first_name
                    new_user.lastName = account.last_name
                }
                user = await this.userFacade.signupGoogleUser(new_user);
            }
            
            
            //user.password = undefined;
            user.salt = undefined;
            let isAdmin = user.isAdmin ? user.isAdmin : false;
            let opentactToken = isAdmin ? 'admintoken123456789' : 'usertoken123456789';
            //const account: any = await this.userFacade.findAccountByAccountId(user.accountID);
            user.token = await AuthService.generateToken(user, remoteAddress, userAgent, user.salt || '', isAdmin, opentactToken, user.uuid);

            await this.userFacade.updateUserLastLoginField(user.id);
            return { user }          
            
        } catch (err) {
            console.log(err)
            return { error: err.message }
            // throw err;
        }

    }

    async generateApiKey(currentUser, remoteAddress: string, userAgent) {
        const user: any = await this.userFacade.findById(currentUser.userId);
        if (!user) throw new Error('user:userDoNotExist');
        /* const account: any = await this.userFacade.findAccountByAccountId(user.accountID);
        if (!account.status) throw new Error('account:userIsNotApproved'); */
        let isAdmin = (user.isAdmin) ? user.isAdmin : false;
        let nonce = await this.opentactService.nonce();
        let adminToken = await this.opentactService.adminLoginGettignToken();
        let userTokenOpentact = (!isAdmin) ? await this.opentactService.getSessionTokenByUuidAndNonce(nonce.nonce, user.uuid) : null;
        let opentactToken = (isAdmin) ? adminToken.token : userTokenOpentact.sessionToken;
        let token = await AuthService.generateToken(user, remoteAddress, userAgent, user.salt || '', isAdmin, opentactToken, user.uuid);
        const token_obj: any = await JWTHelper.verify(token);
        let api_key = new ApiKey();
        api_key.createdOn = new Date(token_obj.iat * 1000);
        api_key.apiKey = token;
        api_key.expiredOn = new Date(token_obj.exp * 1000);
        api_key.user = User.withId(token_obj.userId);
        await this.userFacade.saveApiKey(api_key);
        return 'Bearer ' + token;
    }

    async getAllApiKey(currentUser) {
        return this.userFacade.getAllApiKey(currentUser.userId);
    }

}

interface SignInResponse {
    user?: User;
    account?: Account;
    // company?: any;
    error?: string;
}
