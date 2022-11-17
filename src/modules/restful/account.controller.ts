/* 'use strict';

import {Controller, Get, HttpStatus, Req, Res, Post, Param, Patch, Put, UseGuards, Query} from '@nestjs/common';
import {Response} from 'express';
import {AccountFacade, UserFacade} from '../facade';
import {ApiOperation, ApiBearerAuth, ApiTags, ApiParam, ApiBody, ApiResponse, ApiQuery} from '@nestjs/swagger';
import {errorResponse} from "../../filters/errorRespone";
import {HelperClass} from "../../filters/Helper";
import {AccountInfo} from "../../util/swagger/account_number_tiny"
import { RoleGuard } from '../../util/guard/RoleGuard';
import { Roles } from '../../util/decorator/roles.decorator';

@Controller("account")
@ApiTags("Account")
@UseGuards(RoleGuard)
@ApiBearerAuth()
export class AccountController {
    constructor(private accountFacade: AccountFacade) {
    }

    // @Get('all')
    // @Roles("admin")
    // @ApiQuery({name: 'orderBy', required: false })
    // @ApiQuery({name: 'orderType', required: false })
    // @ApiQuery({name: 'offset', description: 'page parameter, default 0', required: false })
    // @ApiQuery({name: 'limit', description: 'perPage parameter, default 10', required: false })
    // @ApiOperation({description: "Get all account.", operationId: "getAllAccount", summary: "Get all account"})
    // public async getAllAccount(@Req() req, @Res() res: Response,
    //                         @Query('offset') offset: string = '0',
    //                         @Query('limit') limit: string = '10',
    //                         @Query('orderBy') orderBy: string,
    //                         @Query('orderType') orderType: string) {
    //     try {
    //         const account = await this.accountFacade.getAll(orderBy, orderType, offset, limit);
    //         res.status(HttpStatus.OK).json({ 
    //             success: true, 
    //             payload: { 
    //                 items: account[0], 
    //                 total: account[1], 
    //                 page: parseInt(offset), 
    //                 per_page: parseInt(limit) 
    //             } 
    //         });
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    @Get()
    @ApiOperation({description: "Get current account.", operationId: "get", summary: "Get account"})
    public async details(@Req() req, @Res() res: Response) {
        try {
            let user = req.user;
            const account = await this.accountFacade.findById(user.accountId);
            res.status(HttpStatus.OK).json({ success: true, payload: account });
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    // @Post('/user')
    // @ApiBody({
    //     // name: "user", 
    //     required: true, type: CreateUserReq})
    // @ApiOperation({description: "Create user.", operationId: "createUser", summary: "Create user"})
    // public async createSelfUser(@Req() req, @Res() res: Response) {
    //     try {
    //         const body = req.body;
    //         const user = new User();
    //         user.email = body.email;
    //         user.firstName = body.firstName;
    //         user.lastName = body.lastName;
    //         user.password = body.password;
    //         user.type = body.type;
    //         // user.userLastLogin = body.userLastLogin;
    //         user.accountID = req.user.accountId;
    //         await this.accountFacade.createUser(user);
    //         const us = await this.userFacade.getUserListByAccId(user.accountID, undefined);
    //         us.forEach(function(item, i) {
    //             item.password = undefined;
    //             item.salt = undefined;
    //         })
            
    //         res.status(HttpStatus.OK).json(us);
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // @Post(':uuid/user')
    // @ApiParam({name: "uuid", description: "account uuid", required: true, type: String})
    // @ApiBody({
    //     // name: "user", 
    //     required: true, type: CreateUserReq})
    // @ApiOperation({description: "Create user.", operationId: "createUser", summary: "Create user"})
    // public async createUser(@Req() req, @Param("uuid") uuid: string, @Res() res: Response) {
    //     try {
    //         const body = req.body;
    //         const user = new User();
    //         user.email = body.email;
    //         user.firstName = body.firstName;
    //         user.lastName = body.lastName;
    //         user.password = body.password;
    //         user.isAdmin = body.isAdmin;
    //         // user.userLastLogin = body.userLastLogin;
    //         const account = await this.accountFacade.findByUuid(uuid);
    //         if (!account)
    //             await HelperClass.throwErrorHelper('account:accountWithThisUuidIsNotExist');
    //         else
    //             user.accountID = account.id;
    //         await this.accountFacade.createUser(user);
    //         const us = await this.userFacade.getUserListByAccId(user.accountID, undefined);
    //         us.forEach(function(item, i) {
    //             item.password = undefined;
    //             item.salt = undefined;
    //         })
            
    //         res.status(HttpStatus.OK).json(us);
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    @Put()
    @ApiOperation({description: "Change account information", operationId: "changeAccount", summary: "Change account information"})
    @ApiBody({
        // name: "account", 
        required: true, type: AccountInfo})
    @ApiResponse({status: 200, description: "Add OK"})
    public async updateAccount(@Req() req, @Res() res: Response) {
        try {
            let {userId, accountId} = req.user;
            let {name, techPrefix, dnlId, status, allowOutbound, metadata, number} = req.body;
            let account = await this.accountFacade.findById(accountId);
            if (!account) {
                await HelperClass.throwErrorHelper('account:accountWithThisIdIsNotExist');
            }
            else {
                if (name)
                    account.name = name;
                if (number)
                    account.number = number;
                if (allowOutbound != undefined)
                    account.allowOutbound = allowOutbound;
                if (techPrefix)
                    account.techPrefix = techPrefix;
                if (dnlId)
                    account.dnlId = dnlId;
                // if (planUuid)
                //     account.planUuid = planUuid;
                if (status != undefined)
                    account.status = status;
                if (metadata)
                    account.metadata = metadata;
            }

            const result = await this.accountFacade.changeAccount(account);
            res.status(HttpStatus.OK).json(result);
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }
    
    // @Patch(':uuid')
    // @ApiParam({name: "uuid", description: "account uuid", required: true, type: String})
    // @ApiOperation({description: "Change account information", operationId: "changeAccount", summary: "Change account information"})
    // @ApiBody({
    //     // name: "account", 
    //     required: true, type: AccountInfo})
    // @ApiResponse({status: 200, description: "Add OK"})
    // public async changeAccount(@Req() req, @Param("uuid") uuid: string, @Res() res: Response) {
    //     try {
    //         let {name, techPrefix, dnlId, planUuid, status, allowOutbound, metadata} = req.body;
    //         let account = await this.accountFacade.findByUuid(uuid);
    //         if (!account) {
    //             await HelperClass.throwErrorHelper('account:accountWithThisUuidIsNotExist');
    //         }
    //         else {
    //             if (name)
    //                 account.name = name;
    //             if (techPrefix)
    //                 account.techPrefix = techPrefix;
    //             if (dnlId)
    //                 account.dnlId = dnlId;
    //             if (planUuid)
    //                 account.planUuid = planUuid;
    //             if (status != undefined)
    //                 account.status = status;
    //             if (allowOutbound != undefined)
    //                 account.allowOutbound = allowOutbound;
    //             if (metadata)
    //                 account.metadata = metadata;
    //         }

    //         const result = await this.accountFacade.changeAccount(account);
    //         res.status(HttpStatus.OK).json(result);
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }
}
 */