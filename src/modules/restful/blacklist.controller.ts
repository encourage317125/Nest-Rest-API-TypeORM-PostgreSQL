// 'use strict';

// import {Controller, Get, Post, HttpStatus, Req, Res, Delete, Patch, Param} from '@nestjs/common';
// import {Response} from 'express';
// import {BlackListFacade} from '../facade';
// import {AccountBlacklist} from '../../models';
// import {AccountBlacklistSwagger, AccountBlacklistStatus} from '../../util/swagger/acoountBlacklist';
// import {ApiResponse, ApiBearerAuth, ApiBody, ApiTags, ApiParam} from '@nestjs/swagger';
// import {errorResponse} from "../../filters/errorRespone";
// import {HelperClass} from "../../filters/Helper";

// @Controller('blacklists')
// @ApiTags("BL")
// @ApiBearerAuth()
// export class BlackListController {
//     constructor(private blackListFacade: BlackListFacade) {
//     }

//     @Delete(':uuid/:accountId')
//     @ApiParam({name: "uuid", description: "uuid", required: true, type: String})
//     @ApiParam({name: "accountId", description: "accountId", required: true, type: String})
//     @ApiResponse({status: 200, description: "black list removed"})
//     public async deleteEntity(@Req() req, @Res() res: Response, @Param("uuid") uuid: string, @Param("accountId") accountId: string) {
//         try {
//             if (req.user.role !== 'admin' && req.user.userType !== 'user') {
//                 return res.status(HttpStatus.FORBIDDEN).json({ message: 'You have no permission to perform this action' })
//             }
//             if (!uuid) await HelperClass.throwErrorHelper('blacklist:youShouldPassUuidField');
//             if (!accountId) await HelperClass.throwErrorHelper('blacklist:youShouldPassaccountIdField');
//             // if (req.user.role !== 'admin') {
//             let bl = await this.blackListFacade.isBlackListExist(req.user.accountId, uuid);
//             if (!bl) await HelperClass.throwErrorHelper('blacklist:thisBlDoesNotExist');
//             // }
//             let response = await this.blackListFacade.deletePhone(req.user, uuid, accountId);
//             return res.status(HttpStatus.OK).json({response: response});
//         } catch (err) {
//             errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
//         }
//     }

//     @Get()
//     // @ApiQuery({name: 'companyUuid', description: 'You should pass here companyUuid', required: true})
//     @ApiResponse({status: 200, description: "black list OK", type: AccountBlacklist, isArray: true})
//     public async all(@Req() req, @Res() res: Response) {
//         try {
//             if (req.user.role !== 'admin' && req.user.userType !== 'user') {
//                 return res.status(HttpStatus.FORBIDDEN).json({ message: 'You have no permission to perform this action' })
//             }
//             let response = await this.blackListFacade.getAllBlackListsByAccountId(req.user.accountId, req.user.role);
//             res.status(HttpStatus.OK).json({ success: true, payload: { items: response, total: response.length } });
//         } catch (err) {
//             errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
//         }
//     }

//     @Get(':number')
//     @ApiParam({name: 'number', description: 'You should pass the number here', required: true})
//     @ApiResponse({status: 200, description: "black list OK", type: AccountBlacklist, isArray: true})
//     public async getBlacklistByNumber(@Req() req, @Res() res: Response, @Param('number') number: string) {
//         try {
//             let response = await this.blackListFacade.getBlackListsByNumberAccountId(req.user.accountId, number);
//             res.status(HttpStatus.OK).json({ success: true, payload: response });
//         } catch (err) {
//             errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
//         }
//     }

//     @Post()
//     @ApiBody({required: true, type: AccountBlacklistSwagger, 
//         // name: "body"
//     })
//     @ApiResponse({status: 200, description: "black list OK", type: AccountBlacklist})
//     public async create(@Req() req, @Res() res: Response) {
//         try {
//             if (req.user.role !== 'admin' && req.user.userType !== 'user') {
//                 return res.status(HttpStatus.FORBIDDEN).json({ message: 'You have no permission to perform this action' })
//             }
//             let response = await this.blackListFacade.create(req.user, req.body);
//             return res.status(HttpStatus.OK).json({response: response});
//         } catch (err) {
//             errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
//         }
//     }

//     @Patch('/:uuid/:accountId/status')
//     @ApiParam({name: "uuid", description: "uuid", required: true, type: String})
//     @ApiParam({name: "accountId", description: "accountId", required: true, type: String})
//     @ApiBody({required: true, type: AccountBlacklistStatus, 
//         // name: "body"
//     })
//     @ApiResponse({status: 200, description: "black list OK", type: AccountBlacklist})
//     public async edit(@Req() req, @Param("uuid") uuid: string, @Param("accountId") accountId: string, @Res() res: Response) {
//         try {
//             if (req.user.role !== 'admin' && req.user.userType !== 'user') {
//                 return res.status(HttpStatus.FORBIDDEN).json({ message: 'You have no permission to perform this action' })
//             }
//             if (!uuid) await HelperClass.throwErrorHelper('blacklist:youShouldPassUuidField');
//             if (!accountId) await HelperClass.throwErrorHelper('blacklist:youShouldPassAccountIdField');
//             // if (req.user.role === 'admin') {
//             let bl = await this.blackListFacade.isBlackListExist(req.user.accountId, uuid);
//             if (!bl) await HelperClass.throwErrorHelper('blacklist:thisBlDoesNotExist');
//             // }
//             let response = await this.blackListFacade.changeStatus(req.body.status, uuid, accountId);
//             return res.status(HttpStatus.OK).json({response: response});
//         } catch (err) {
//             errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
//         }
//     }
// }