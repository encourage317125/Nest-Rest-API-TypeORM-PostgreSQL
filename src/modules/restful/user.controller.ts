'use strict';

import { join } from 'path';
import { Inject, Controller, Get, HttpStatus, Req, Res, Post, Patch, Param, Query, Put, Delete, Body, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserFacade } from '../facade';
import { ApiOperation, ApiBearerAuth, ApiTags, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { errorResponse } from "../../filters/errorRespone";
import { HelperClass } from "../../filters/Helper";
import { UserPatchMethod } from "../../util/swagger/user";
import { MessageCodeError } from '../../util/error';
import { OpentactService } from "../opentact";
import { AccountNumberFacade } from '../facade';
import { EmailService } from '../email';
import { InvitationReq } from '../../util/swagger';
import { CommonService } from '../services/common.service';
import { PermissionsService } from '../services/permissions.service';
import { Repositories} from '../db/repositories';
import constants from '../../constants';
import { BuyDidNumbers } from '../payments';
import { SendSmsReq } from '../../util/swagger/send_sms';
import { User } from '../../models';



@Controller("user")
@ApiTags("User")
@ApiBearerAuth()
export class UserController {
    constructor(
        @Inject('Repositories')
        private readonly Repositories: Repositories,
        private userFacade: UserFacade,
        private opentactService: OpentactService,
        private emailService: EmailService,
        private accountNumberFacade: AccountNumberFacade,
    ) {
    }

    // @Get('/list/byAccount')
    // @ApiOperation({ description: "Get user list of account.", summary: "Get user list of account" })
    // @ApiQuery({ name: "company", description: "company name", required: false, type: String })
    // public async getUserListByAccId(@Req() req, @Query("company") company: string, @Res() res: Response) {
    //     try {
    //         let { accountId } = req.user;
    //         let users: any = await this.userFacade.getUserListByAccId(accountId, company);
    //         return res.status(HttpStatus.OK).json({
    //             response: users
    //         });
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // @Get('/list/byCompany/:id')
    // @ApiParam({ name: "id", description: "company id", required: true, type: Number })
    // @ApiOperation({ description: "Get user list of account.", summary: "Get user list of account" })
    // public async getUserListByCompId(@Req() req, @Param("id") id: number, @Res() res: Response) {
    //     try {
    //         let name;
    //         const company = await this.companyFacade.getCompanyById(id);
    //         if (!company) {
    //             await HelperClass.throwErrorHelper('company:notFound');
    //         }
    //         else
    //             name = company.companyName;

    //         let users: any = await this.userFacade.getUserListByCompName(req.user, name);
    //         return res.status(HttpStatus.OK).json({
    //             response: users
    //         });
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    @Get()
    @ApiOperation({ description: "Get current account.", summary: "Get user infotmation" })
    public async getUserInformation(@Req() req, @Res() res: Response) {
        try {
            let { userId } = req.user;
            let user: any = await this.userFacade.findById(userId);
            if (!user) await HelperClass.throwErrorHelper('user:thisUserDoNotExist');
            return res.status(HttpStatus.OK).json({
                response: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    twoFA: user.twoFA,
                    imgLink: user.link
                }
            });
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    // @Put(":id")
    // @ApiParam({ name: "id", description: "id for getting user info", required: true, type: Number })
    // @ApiBody({
    //     type: UserPatchMethod, required: true,
    //     // name: "body"
    // })
    // @ApiOperation({ description: "Edit user account", summary: "Put account" })
    // public async putUserInformation(@Req() req, @Res() res: Response, @Param("id") id) {
    //     try {
    //         // console.log("body: ", req.body);
    //         let { userId, accountId } = req.user;
    //         let { email, firstName, lastName, twoFA, password, rePassword, machineDetection, forwardSoftphone, logoUuid, companyName } = req.body;
    //         let user: any = await this.userFacade.getUserById(id, accountId);
    //         if (!user) await HelperClass.throwErrorHelper('user:thisUserDoNotExist');
    //         let emailField = email ? email : user.email;
    //         let firstNameField = firstName ? firstName : user.firstName;
    //         let lastNameField = lastName ? lastName : user.lastName;
    //         let companyNameField = companyName ? companyName : user.companyName;
    //         let twoFaField = user.twoFA;
    //         if (twoFA != undefined)
    //             twoFaField = twoFA;
    //         let machineDetectionField = user.machineDetection;
    //         if (machineDetection != undefined)
    //             machineDetectionField = machineDetection;
    //         let forwardSoftphoneField = user.twoFA;
    //         if (forwardSoftphone != undefined)
    //             forwardSoftphoneField = forwardSoftphone;
    //         if (password !== rePassword) throw new MessageCodeError('rePassword:NotMatch');

    //         let response = await this.userFacade.updateUserFieldsEntity(id, accountId, emailField, firstNameField, lastNameField, twoFaField, password, machineDetectionField, forwardSoftphoneField, companyNameField);
    //         return res.status(HttpStatus.OK).json({ response: response });
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    @Patch()
    @ApiBody({
        type: UserPatchMethod, required: true,
        // name: "body"
    })
    @ApiOperation({ description: "Edit user account", summary: "Patch account" })
    public async patchUserInformation(@Req() req, @Res() res: Response) {
        try {
            // console.log("body: ", req.body);
            let { userId } = req.user;
            let { email, firstName, lastName, twoFA, password, rePassword, machineDetection, forwardSoftphone } = req.body;
            let user: any = await this.userFacade.findById(userId);
            if (!user) await HelperClass.throwErrorHelper('user:thisUserDoNotExist');
            let emailField = email ? email : user.email;
            let firstNameField = firstName ? firstName : user.firstName;
            let lastNameField = lastName ? lastName : user.lastName;
            let twoFaField = user.twoFA;
            if (twoFA != undefined)
                twoFaField = twoFA;
            let machineDetectionField = user.machineDetection;
            if (machineDetection != undefined)
                machineDetectionField = machineDetection;
            let forwardSoftphoneField = user.twoFA;
            if (forwardSoftphone != undefined)
                forwardSoftphoneField = forwardSoftphone;
            if (password !== rePassword) throw new MessageCodeError('rePassword:NotMatch');

            let response = await this.userFacade.updateUserFieldsEntity(userId, emailField, firstNameField, lastNameField, twoFaField, password, machineDetectionField, forwardSoftphoneField );
            return res.status(HttpStatus.OK).json({ response });
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    // @Get(':uuid/companies')
    // @ApiParam({ name: "uuid", description: "user uuid", required: true, type: String })
    // @ApiOperation({ description: "Get company informations.", operationId: "getCompanies", summary: "Get company infotmations" })
    // public async getCompanies(@Req() req, @Param("uuid") uuid: string, @Res() res: Response) {
    //     try {
    //         let accountId;
    //         const user = await this.userFacade.getUserByUuid(uuid);
    //         if (!user) {
    //             await HelperClass.throwErrorHelper('user:userWithThisUuidIsNotExist');
    //         }
    //         else
    //             accountId = user.accountID;
    //         const companies = await this.companyFacade.getAllCompaniesByAccountId(accountId);
    //         return res.status(HttpStatus.OK).json(companies);
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // @Delete(':id')
    // @ApiParam({ name: "id", description: "user id", required: true, type: String })
    // @ApiOperation({ description: "Delete user" })
    // public async deleteUser(@Req() req, @Param("id") id: number, @Res() res: Response): Promise<any> {
    //     let where = { id }
    //     await this.permissionsService.checkPermissions({ userData: req.user, entity: 'user', object: where })
    //     //TODO: delete sipuser
    //     const response = await this.commonService.deleteEntity(this.Repositories.USERS, where)
    //     return res.status(HttpStatus.OK).json(response);
    // }


    @Post('/suspend')
    @ApiOperation({ description: "Suspend user.", operationId: "suspendUser", summary: "Suspend user" })
    public async suspendUser(@Req() req, @Res() res: Response) {
        try {
            let token = await this.opentactService.adminLoginGettignToken();
            let tracking_numbers = (await this.accountNumberFacade.getTrackingNumbers(req.user.userId, req.user.accountId, undefined))[0];
            for (let i = 0; i < tracking_numbers.length; i++) {
                let did = tracking_numbers[i].did;
                if (did != undefined) {
                    await this.userFacade.suspendUser(req.user, token.token, did.didOpentactIdentityID, did.id, tracking_numbers[i].id);
                }
            }
            if (tracking_numbers.length == 0)
                await this.userFacade.suspendUser(req.user, undefined, undefined, undefined, undefined);
            res.status(HttpStatus.OK).json({ response: 'ok' });
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('/close')
    @ApiOperation({ description: "Close user.", operationId: "closeUser", summary: "Close user" })
    public async closeUser(@Req() req, @Res() res: Response) {
        try {
            let token = await this.opentactService.adminLoginGettignToken();
            let tracking_numbers = (await this.accountNumberFacade.getTrackingNumbers(req.user.userId, req.user.accountId, undefined))[0];
            for (let i = 0; i < tracking_numbers.length; i++) {
                let did = tracking_numbers[i].did;
                if (did != undefined) {
                    await this.userFacade.closeUser(req.user, token.token, did.didOpentactIdentityID, did.id, tracking_numbers[i].id);
                }
            }
            if (tracking_numbers.length == 0)
                await this.userFacade.closeUser(req.user, undefined, undefined, undefined, undefined);

            res.status(HttpStatus.OK).json({ response: 'ok' });
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    // @Post('/account/cancel')
    // @ApiOperation({ description: "Cancel user.", operationId: "cancelUser", summary: "Cancel user" })
    // public async cancelUser(@Req() req, @Res() res: Response) {
    //     try {
    //         let result = await this.userFacade.cancelAccount(req.user.accountId);
    //         // this.opentactService.deleteLease(uuid);
    //         res.status(HttpStatus.OK).json({ response: result });
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    @ApiBody({
        required: true, type: InvitationReq,
        // name: "invite"
    })
    @ApiResponse({ status: 200, description: "Invitation successful" })
    @Post('invite')
    public async invite(@Req() req, @Res() res: Response) {
        try {
            const body = req.body;
            await this.emailService.sendMail("user:invite", body.email, {
                FIRST_NAME: body.firstName,
                LAST_NAME: body.lastName,
                LINK: `${process.env.FREESMS_URL}/signup`
            });
            res.status(HttpStatus.OK).json({ response: 'ok' });
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get("image")
    @ApiOperation({ description: "Get user image" })
    public async getUserImage(
        @Req() req, 
        @Res() res: Response, 
    ) {
        try {
            res.sendFile(join(process.cwd(), `${constants.PATH_TO_IMAGE_FOLDER}/${req.user.userUuid}.jpeg`), function (err) {
                if (err) {
                  return res.status(404).end();
                }
            })
        } catch (e) {
            return res.status(404).send({message: e.message});
        }
    }

    @Get("recordings/:record")
    @ApiParam({ name: "record", description: "user record name", required: true, type: String })
    public async getUserRecords(
        @Req() req, 
        @Res() res: Response, 
        @Param('record') record,
    ) {
        try {
            let mode = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
            res.sendFile(join(process.cwd(), `/assets/${mode}/recordings/${record}`), function (err) {
                if (err || !record.includes(req.user.userUuid)) {
                  return res.status(404).end();
                }
            })
        } catch (e) {
            return res.status(404).send({message: e.message});
        }
    }

    @Post('buy_did_number')
    @ApiOperation({ description: "Buy number", })
    @ApiResponse({ status: 200, description: "id" })
    @ApiBody({
        required: true, type: BuyDidNumbers,
    })
    public async buyDidNumber(@Req() req, @Res() res: Response, @Body() body: BuyDidNumbers) {
        try {

            const { additionalNumbers } = body;

            let userID = req.user?.userId,
                accountID = req.user?.accountId,
                numbers = additionalNumbers,
                didNumbers,
                userNumbers;

            if (numbers) {
                let userToken = await this.opentactService.getToken();
                didNumbers = await this.opentactService.buyDidNumbers(userToken.payload.token, numbers);

                if (didNumbers.error) {
                    return res.status(didNumbers.error.status).json(didNumbers);
                }
                
                if (didNumbers.payload.failed || didNumbers.payload.state === 'failed') {
                    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Buying number is failed.' })
                }
            }

            if (numbers) {
                userNumbers = await this.accountNumberFacade.addDidNumbers(userID, accountID, true, didNumbers.payload.request.items);
                if (userNumbers.error) {
                    return res.status(HttpStatus.BAD_REQUEST).json(userNumbers.error);
                }
            }

            return res.status(HttpStatus.OK).json({ ...{numbers: userNumbers}, ...{userID, accountID} });
        } catch (err) {
            throw new Error(err.message)
        }
    }

    // @Get('sms')
    // @ApiOperation({ description: "Get sms", })
    // @ApiResponse({ status: 200, description: "sms" })
    // public async getSms(@Req() req, @Res() res: Response) {

    // }

    @Post('sms')
    @ApiOperation({ description: "Send sms", })
    @ApiResponse({ status: 200, description: "sms" })
    @ApiBody({
        required: true, type: SendSmsReq,
    })
    public async sendSms(@Req() req, @Res() res: Response, @Body() body: SendSmsReq) {
        try {
            const { from, to, message } = body;
            const { token } = (await this.opentactService.getToken()).payload;

            let own_number = await this.accountNumberFacade.ownNumber(req.user.userId, req.user.accountId, body.from);
            if (!own_number) return res.status(401).json({ message: 'From number does not belong to you.' });
            // let from_blocked = await this.accountNumberFacade.blockedNumber(from);
            // if (from_blocked) return res.status(401).json({ message: 'From number is blocked.' });
            // let to_blocked = await this.accountNumberFacade.blockedNumber(to);
            // if (to_blocked) return res.status(401).json({ message: 'To number is blocked.' });

            const sms = await this.opentactService.sendSms(token, from, to, message);

            return res.status(200).json({ sms });
        } catch (e) {
            console.log(e)
            return res.status(400).send({ message: e.message });
        }
    }
}
