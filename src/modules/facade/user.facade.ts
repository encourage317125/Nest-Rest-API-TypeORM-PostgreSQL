import { User, Account, ApiKey } from "../../models";
import { Injectable } from '@nestjs/common';
import { EmailService } from '../email';
import { Config } from '../../util/config';
import { PasswordHelper } from '../../util/helper';
import { genSaltSync, hashSync } from 'bcrypt';
import { v4 } from 'uuid';
import { EntityRepository, EntityManager } from "typeorm";
import * as jwt from 'jsonwebtoken';
import * as fs from "fs";
import { OpentactService } from "../opentact";
import { UserTypes } from "../../models/user.entity";
import constants from "../../constants";
import { errorMessagesConfig } from "../../util/error";

@EntityRepository()
@Injectable()
export class UserFacade {

    constructor(
        private entityManager: EntityManager,
        private emailService: EmailService,
        private opentactService: OpentactService,
        
    ) {
        // super()
    }

    static async getTokenForResetPassword(email) {
        let secret: string | any = constants.JWT_KEY;
        // process.env.JWT_KEY;
        return jwt.sign({
            email: email
        }, secret, { expiresIn: '1h' });
    }

    async deleteUserByUserUuid(userUuid) {
        return this.entityManager.createQueryBuilder()
            .delete()
            .from(User)
            .where('uuid=:userUuid', { userUuid: userUuid })
            .returning('*')
            .execute();
    }

    async updateUserActive(active: boolean, userID) {
        return await this.entityManager.createQueryBuilder()
            .update(User)
            .set({
                active: active
            })
            .where('user_id=:id', { id: userID })
            .execute();
    }

    async getUserByUuid(userUuid) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(User, "user")
            .where("user.uuid = :uuid ")
            .setParameters({ uuid: userUuid })
            .getOne();
    }

    async findByEmail(email: string) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(User, "user")
            .where("user.email = :email ")
            .setParameters({ email: email })
            .getOne();
    }

    async findById (id) {        
        return await this.entityManager.createQueryBuilder(User, "user")
            .where("user.id = :id ")
            .setParameters({ id: id })
            .getOne();
    }

    async updatePassword(password: string, userUuid) {
        return this.entityManager.createQueryBuilder()
            .update(User)
            .set({
                password: password
            })
            .where('uuid=:userUuid', { userUuid: userUuid })
            .execute();
    }

    async findAccountByAccountId(accountID) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(Account, "a")
            .where("a.id = :accountID ")
            .setParameters({ accountID: accountID })
            .getOne();
    }

    // async getAllCompaniesByUserIdAndAccountId(userCreatorID, accountID) {
    //     let manager = await this.entityManager;
    //     return manager.createQueryBuilder(Company, "c")
    //         .where('c.userCreatorID=:userCreatorID', { userCreatorID: userCreatorID })
    //         .andWhere('c.accountID=:accountID', { accountID: accountID })
    //         .getMany();

    // }

    // async getCompanyByUserIdAndAccountId(userCreatorID, accountID) {
    //     let manager = await this.entityManager;
    //     return manager.createQueryBuilder(Company, "c")
    //         .where('c.user_creator=:userCreatorID', { userCreatorID: userCreatorID })
    //         .andWhere('c.acco_id=:accountID', { accountID: accountID })
    //         .getOne();
    // }

    async resetPassword(email: string) {
        let user: any = await this.findByEmail(email);
        if (!user) throw new Error('auth:thisUserDoesNotExist');
        let token = await UserFacade.getTokenForResetPassword(email);
        this.emailService.sendMail("auth:resetPassword", user.email, {
            FIRST_NAME: user.firstName,
            LAST_NAME: user.lastName,
            TOKEN: token,
            LINK: `${constants.FREESMS_URL}/ResetPassword/${token}`
        });
    }

    async updateUserLastLoginField(userID) {
        return await this.entityManager.createQueryBuilder()
            .update(User)
            .set({
                userLastLogin: new Date()
            })
            .where('user_id=:id', { id: userID })
            .execute();
    }

    async signupUser(user: User) {
        //console.log(user);
        try {
            if (!user) throw new Error(errorMessagesConfig['auth:signup:missingInformation'].errorMessage);
            if (!user.firstName) throw new Error(errorMessagesConfig['auth:signup:missingFirstName'].errorMessage);
            if (!user.lastName) throw new Error(errorMessagesConfig['auth:signup:missingLastName'].errorMessage);
            if (!user.email) throw new Error(errorMessagesConfig['auth:signup:missingEmail'].errorMessage);
            // if (!user.companyName) throw new Error(errorMessagesConfig['auth:signup:missignCompanyName'].errorMessage);
            if (!user.password) throw new Error(errorMessagesConfig['auth:signup:missingPassword'].errorMessage);
            if (!user.rePassword) throw new Error(errorMessagesConfig['auth:signup:missinRePassword'].errorMessage);
            if (user.password !== user.rePassword) throw new Error(errorMessagesConfig['auth:signup:passwordMatch'].errorMessage);
            await PasswordHelper.validatePassword(user.password);
            const found = await this.findByEmail(user.email);
            if (found) throw new Error(errorMessagesConfig['user:alreadyExists'].errorMessage);
            // let manager = await this.entityManager;
            // return await manager.transaction(async tEM => {
                // let company = new Company();
                const password = user.password
                let account = new Account();
                account.creation = new Date();
                account.number = v4();
                account.status = false;
                // account.planID = user.planID;
                account.allowOutbound = true;
                // account = await tEM.save(account);
                account = await account.save();
                user.uuid = v4();
                user.plaintText = true;
                //user.accountID = account.id;
                user.invoiceEmail = false;
                user.type = UserTypes.USER;
                // user.creation = new Date();
                // user.updated = new Date();
                const salt = genSaltSync(Config.number("BCRYPT_SALT_ROUNDS", 10));
                user.password = await hashSync(user.password, salt);
                user.emailConfirmed = false;
                user.salt = salt;
                user.userIdentityOpenTact = false;

                const { success, payload } = await this.opentactService.createSipUser({
                    login: `${user.email}_${Date.now()}`, //return in payload
                    password: password
                })
                if (success) {
                    user.sipUsername = payload.login
                }

                // let userEntity = await tEM.save(user);
                // let company_uuid = v4();
                // user.companyUuid = company_uuid;
                let userEntity = await user.save();
                // let companyResponse
                // if (userEntity.companyName) {
                //     company.companyName = userEntity.companyName;
                //     company.companyUuid = company_uuid;
                //     company.userUuid = userEntity.uuid
                //     company.userCreatorID = userEntity.id;
                //     company.accountID = account.id;
                //     company.status = true;
                //     company.balance = 0;
                //     company.created = new Date();
                //     // companyResponse = await tEM.save(company);
                //     companyResponse = await company.save();
                // }
 
                return {
                    user: userEntity,
                    account: account,
                    // company: companyResponse
                };
            // });
        } catch (err) {
            console.log(err)
            return { error: err.message }
            // throw err;
        }
    }

    private generatePassword(passwordLength) {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let password = "";
       
        for (var i = 0; i <= passwordLength; i++) {
          var randomNumber = Math.floor(Math.random() * chars.length);
          password += chars.substring(randomNumber, randomNumber +1);
        }
        return password
    }

    async signupGoogleUser(user: User) {
        //console.log(user);
        try {
            if (!user) throw new Error(errorMessagesConfig['auth:signup:missingInformation'].errorMessage);
            if (!user.email) throw new Error(errorMessagesConfig['auth:signup:missingEmail'].errorMessage);
                const password = this.generatePassword(12)

                /* let account = new Account();
                account.creation = new Date();
                account.number = v4();
                account.status = false; */

                // account.planID = user.planID;
                //account.allowOutbound = true;
                // account = await tEM.save(account);
                //account = await account.save();
                const salt = genSaltSync(Config.number("BCRYPT_SALT_ROUNDS", 10));
                user.salt = salt
                user.password = await hashSync(password, salt);
                user.uuid = v4();
                user.plaintText = true;
                //user.accountID = account.id;
                user.invoiceEmail = false;
                user.type = UserTypes.USER;
                user.userIdentityOpenTact = false;
                user.active = true

                const { success, payload } = await this.opentactService.createSipUser({
                    login: `${user.email}_${Date.now()}`, //return in payload
                    password: password
                })
                if (success) {
                    user.sipUsername = payload.login
                }

                let userEntity = await user.save();
                userEntity.password = password
                return userEntity
                /* return {
                    user: userEntity,
                    //account: account,
                    // company: companyResponse
                }; */
            // });
        } catch (err) {
            console.log(err)
            return { error: err.message }
            // throw err;
        }
    }

    async uploadedImageLinkToUserTable(link, userUuid) {
        return this.entityManager.createQueryBuilder()
            .update(User)
            .set({
                link: link
            })
            .where('uuid=:userUuid', { userUuid: userUuid })
            .execute();
    }

    async deleteImageFromTable(userUuid) {
        return this.entityManager.createQueryBuilder()
            .update(User)
            .set({
                link: undefined
            })
            .where('uuid=:userUuid', { userUuid: userUuid })
            .returning('*')
            .execute();
    }

    async deleteImageFromDisk(link, userUuid) {
        if (fs.existsSync(`${link}/${userUuid}.jpeg`)) {
            fs.unlinkSync(`${link}/${userUuid}.jpeg`);
        }
    }

    async deleteImageFromDistPromise(link, userUuid) {
        return await this.deleteImageFromDisk(link, userUuid);
    }

    async getUserById(userId, accountId) {
        return await this.entityManager.createQueryBuilder(User, 'u')
            .where('u.id=:userId', { userId: userId })
            .andWhere('u.accountID=:accountId', { accountId: accountId })
            .getOne();
    }

    // async getUserListByAccId(accountId, company) {
    //     let query = await this.entityManager.createQueryBuilder(User, 'u')
    //         .where('u.accountID=:accountId', { accountId: accountId })
    //     if (company) {
    //         query.andWhere('u.companyName=:company', { company: company })
    //     }
    //     return query.getMany();
    // }

    // async getUserListByCompName(currentUser, name) {
    //     return await this.entityManager.createQueryBuilder(User, 'u')
    //         .where('u.companyName=:compName', { compName: name })
    //         .andWhere('u.accountID=:accountId', { accountId: currentUser.accountId })
    //         .getMany();
    // }

    async updateUserFieldsEntity(userId, emailField, fn, ln, twoFA, password, machineDetection, forwardSoftphone) {
        try {
            let body = new Object();
            body = {
                email: emailField,
                firstName: fn,
                lastName: ln,
                twoFA: twoFA,
                machineDetection: machineDetection,
                forwardSoftphone: forwardSoftphone,
            };
            if (password) {
                const salt = genSaltSync(Config.number("BCRYPT_SALT_ROUNDS", 10));
                let pass = await hashSync(password, salt);
                body = {
                    email: emailField,
                    firstName: fn,
                    lastName: ln,
                    twoFA: twoFA,
                    machineDetection: machineDetection,
                    forwardSoftphone: forwardSoftphone,
                    password: pass,
                    salt: salt,
                };
            }
            const res = await this.entityManager.createQueryBuilder()
                .update(User)
                .set(body)
                .where('user_id=:userId', { userId })
                .returning('*')
                .execute();
            return res.raw[0]
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async findByIdAndAccount(userId: number) {
        let manager = await this.entityManager;
        return await manager.createQueryBuilder(User, "user")
            .where("user.id = :userId ")/* 
            .andWhere("account.id = :accountId ")
            .leftJoinAndSelect("user.account", "account") */
            .leftJoinAndSelect("user.type", "data1")
            .setParameters({ userId })
            .getOne();
    }

    async saveApiKey(api_key) {
        let manager = await this.entityManager;
        return await manager.save(api_key);
    }

    async getAllApiKey(userCreatorID) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(ApiKey, "ak")
            .where('ak.user=:userCreatorID', { userCreatorID: userCreatorID })
            .getMany();

    }

    // async unassignCompanyUsers(company_name) {
    //     let manager = await this.entityManager;
    //     return await manager.createQueryBuilder()
    //         .update(User)
    //         .set({ companyName: undefined })
    //         .where("companyName=:compName", { compName: company_name })
    //         .execute();
    // }

    // Never used
    // async disableEnableUser(id, enable) {
    //     return this.entityManager.createQueryBuilder()
    //         .update(User)
    //         .set({
    //             status: enable
    //         })
    //         .where('id=:id', { id })
    //         .returning('*')
    //         .execute();
    // }

    async suspendUser(currentUser, token, apdiID, didID, trackingNumberID) {
        let manager = await this.entityManager;
        return await manager.transaction(async tEM => {
            if (trackingNumberID)
                await tEM.query("delete from tracking_numbers where id = $1", [trackingNumberID]);
            if (didID)
                await tEM.query("delete from did where did_id = $1", [didID]);
            await tEM.query(`update account set acco_status = false where acco_id = ${currentUser.accountId}`);
            await tEM.query(`update "user" set email_confirmed = false where user_id = ${currentUser.userId}`);
            if (token && apdiID)
                await this.opentactService.releaseAppDid(token, apdiID);
        })
    }

    async closeUser(currentUser, token, apdiID, didID, trackingNumberID) {
        let manager = await this.entityManager;
        return await manager.transaction(async tEM => {
            if (trackingNumberID)
                await tEM.query("delete from tracking_numbers where id = $1", [trackingNumberID]);
            if (didID)
                await tEM.query("delete from did where did_id = $1", [didID]);
            await tEM.query(`update account set acco_status = false where acco_id = ${currentUser.accountId}`);
            await tEM.query(`update "user" set email_confirmed = false where user_id = ${currentUser.userId}`);
            if (token && apdiID)
                await this.opentactService.releaseAppDid(token, apdiID);
        })
    }

    async updateStatus(id, status) {
        return this.entityManager.createQueryBuilder()
            .update(User)
            .set({
                emailConfirmed: status
            })
            .where('user_id=:id', { id: id })
            .returning('*')
            .execute();

    }

    async updateUserActivationStatus(accountID, userUuid, status) {
        let manager = await this.entityManager;
        await manager.createQueryBuilder()
            .update(User)
            .set({emailConfirmed: status})
            .where("uuid = :userUuid", {userUuid})
            .execute();
        await manager.createQueryBuilder()
            .update(Account)
            .set({status: status})
            .where("id = :accountID", {accountID})
            .execute();
    }

    // async updateUserByAdmin(id, status, companyName) {
    //     return await this.entityManager.createQueryBuilder()
    //         .update(User)
    //         .set({
    //             active: status,
    //             companyName: companyName
    //         })
    //         .where('user_id=:id', { id: id })
    //         .returning('*')
    //         .execute();

    // }

    // async cancelAccount(account_Id) {
    //     try {
    //         let removed_tn_leases: any,
    //             numbers_array: Array<number> = [], 
    //             user_account = await this.entityManager.createQueryBuilder()
    //                 .update(Account)
    //                 .set({
    //                     status: false,
    //                 })
    //                 .where('account.acco_status = true')
    //                 .andWhere('account.acco_id=:account_Id', { account_Id })
    //                 .returning('*')
    //                 .execute();
    
    //         if (user_account.affected) {
    //             numbers_array = (await this.entityManager.query(`select array(select number from tracking_numbers where acco_id=$1)`,
    //                 [account_Id]))[0].array;

    //             if (numbers_array.length) {
    //                 removed_tn_leases = await this.opentactService.removeTNLeases(numbers_array)
    //             }
    //         }

    //         return {
    //             message: 'Account was canceled successfuly.',
    //             user_account,
    //             numbers_array,
    //             removed_tn_leases
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         return { error: err.message }
    //     }

    // }
}
