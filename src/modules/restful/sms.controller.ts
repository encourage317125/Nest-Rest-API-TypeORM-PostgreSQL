'use strict';

import { Controller, Get, Post, Patch, HttpStatus, Req, Res, Query, Param, Body } from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiResponse, ApiOperation, ApiBearerAuth, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { errorResponse } from "../../filters/errorRespone";
import { MessageCodeError } from '../../util/error';
import { SmsFacade } from '../facade/sms.facade';
import { SendSms } from '../../util/swagger/send_sms.dto';
import { CommonService } from '../services/common.service';
import { OpentactService } from "../opentact";
import { AccountNumberFacade } from '../facade';
import { SmsReadStatus } from '../../util/swagger';

//import { Sms } from '../../models/sms';

@Controller("sms")
@ApiBearerAuth()
@ApiTags("sms")
export class SmsController {
    constructor(
        private smsFacade: SmsFacade,
        private commonService: CommonService,
        private accountNumberFacade: AccountNumberFacade,
    ) {
    }

    @Post()
    // @ApiBody({ 
    //     // name: "sms", 
    //     type: SendSms })
    @ApiOperation({ description: "send SMS", operationId: "sendSMS", summary: "send SMS" })
    @ApiResponse({ status: 200, description: "sms sent" })
    @ApiResponse({ status: 400, description: "Returns error in header x-message-code-error " })
    public async create(@Req() req, @Body() body: SendSms, @Res() res: Response,) {
        // if (!req.body.from) {
        //     throw new MessageCodeError("from:NotFound");
        // }
        // if (!req.body.to) {
        //     throw new MessageCodeError("to:NotFound");
        // }
        // if (!req.body.msg) {
        //     throw new MessageCodeError("msg:NotFound");
        // }
        // let sms = await this.smsFacade.create(req.user, req.body.from, req.body.to, req.body.msg);
        //console.log(Object.keys( sms ));
        let sms = await this.commonService.sendSms(req.user, body.to, body.msg, body.from,);
        res.status(HttpStatus.OK).json(sms);
    }

    @Post('webhook')
    @ApiOperation({ description: "Receives sms to webhook", operationId: "sendSMSwebhook", summary: "Receives sms to webhook" })
    @ApiResponse({ status: 200, description: "webhook sent" })
    @ApiResponse({ status: 400, description: "Returns error in header x-message-code-error " })
    public async webhook(@Req() req, @Res() res: Response) {
        // if (!req.body.referenceId) {
        //     return res.status(HttpStatus.OK).json({error:"referenceId:NotFound"});
        // }
        if (!req.body.from) {
            return res.status(HttpStatus.OK).json({ error: "from:NotFound" });
        }
        if (!req.body.to) {
            return res.status(HttpStatus.OK).json({ error: "to:NotFound" });
        }
        if (!req.body.text) {
            return res.status(HttpStatus.OK).json({ error: "text:NotFound" });
        }
        if ('undefined' == typeof req.body.deliveryReceipt) {
            return res.status(HttpStatus.OK).json({ error: "deliveryReceipt:NotFound" });
        }
        let sms = await this.smsFacade.webhook(req.body.referenceId, req.body.from, req.body.to, req.body.text, req.body.deliveryReceipt, req.body.is_outgoing, req.body.status, req.body.error, req.body.id);
        res.status(HttpStatus.OK).json(sms);
    }

    @Get("incoming")
    @ApiOperation({ description: "Get incoming sms from Opentact", operationId: "getSmsIncoming", summary: "Get incoming sms list from Opentact" })
    @ApiQuery({ name: "offset", description: "Pagination offset. default 0", required: false })
    @ApiQuery({ name: "limit", description: "Max elements to return. default 10", required: false })
    @ApiResponse({ status: 200, description: "sms list" })
    @ApiResponse({ status: 400, description: "Returns error in header x-message-code-error " })
    public async incoming(@Req() req, @Res() res: Response,
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 10
    ) {
        // let us = await this.smsFacade.getUserSms(req.user, offset, limit, false);
        // res.status(HttpStatus.OK).json({response: us[0], entries: us[1]});
        let smsList = await this.commonService.getIncommingSms(req.user, limit, offset);
        res.status(HttpStatus.OK).json(smsList);
    }

    @Get("outgoing")
    @ApiOperation({ description: "Get outgoing sms from Opentact", operationId: "getSmsOutgoing", summary: "Get outgoing sms list from Opentact" })
    @ApiQuery({ name: "offset", description: "Pagination offset. default 0", required: false })
    @ApiQuery({ name: "limit", description: "Max elements to return. default 10", required: false })
    @ApiResponse({ status: 200, description: "sms list" })
    @ApiResponse({ status: 400, description: "Returns error in header x-message-code-error " })
    public async outgoing(@Req() req, @Res() res: Response,
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 10
    ) {
        let us = await this.smsFacade.getUserSms(req.user, offset, limit, true);
        res.status(HttpStatus.OK).json({ response: us[0], entries: us[1] });
    }

    @Get("all")
    @ApiOperation({ description: "Get all sms from Opentact", operationId: "getAllSms", summary: "Get all sms list from Opentact" })
    @ApiQuery({ name: "offset", description: "Pagination offset. default 0", required: false })
    @ApiQuery({ name: "limit", description: "Max elements to return. default 10", required: false })
    @ApiQuery({ name: "startDate", description: "start date param in pagination query. YYYY/MM/DD format. not timestamp, default=start day", required: false })
    @ApiQuery({ name: "endDate", description: "end date param in pagination query. YYYY/MM/DD format. not timestamp. default=end day", required: false })
    @ApiQuery({ name: "direction", description: "Direction:inbound/outbound", required: false })
    @ApiQuery({ name: "number", description: "Number", required: false, type: String })
    @ApiResponse({ status: 200, description: "sms list" })
    @ApiResponse({ status: 400, description: "Returns error in header x-message-code-error " })
    public async getAllSms(@Req() req, @Res() res: Response,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query("direction") direction: string,
        @Query("number") number,
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 10
    ) {
        // let is_outgoing = direction == 'outbound'? true: direction == 'inbound'? false: null;
        // let us = await this.smsFacade.getUserSms(req.user, offset, limit, is_outgoing, startDate, endDate, number);
        // res.status(HttpStatus.OK).json({response: us[0], entries: us[1]});
        let smsList = await this.commonService.getAllSms(req.user, limit, offset, startDate, endDate, direction, number);
        res.status(HttpStatus.OK).json({ success: true, payload: { items: smsList, total: smsList.length } });
    }

    @Get(':type')
    @ApiOperation({ description: "Get sms ", operationId: "getSms", summary: "Get sms list" })
    @ApiParam({ name: 'type', description: 'Sms type, in, out or every', enum: ['in', 'out', 'every'] })
    @ApiQuery({ name: 'is_read', description: 'Provide "true" or "false" to filter read or not read sms', required: false })
    @ApiQuery({ name: 'startDate', description: 'Start date to select sms from. YYYY/MM/DD format. not timestamp. Default 5 days ago date', required: false })
    @ApiQuery({ name: 'endDate', description: 'End date to select sms to. YYYY/MM/DD format. not timestamp. Default current date', required: false })
    @ApiQuery({ name: 'order_by', description: 'Order by', required: false, enum: ['date'] })
    @ApiQuery({ name: 'order_type', description: 'Order type', required: false, enum: ['asc', 'desc'] })
    @ApiQuery({ name: 'sms_uuid', description: 'Get log by sms uuid', required: false })
    @ApiQuery({ name: 'sender_number', description: 'Get log by sender number', required: false })
    @ApiQuery({ name: 'destination_number', description: 'Get log by destination number', required: false })
    @ApiQuery({ name: 'text', description: 'Search log by sms text', required: false })
    @ApiQuery({ name: 'group', description: 'Group sms by date', required: false, enum: ['yes', 'no'] })
    async getSmsLogs(@Req() req, @Res() res: Response, 
        @Param('type') type: string,
        @Query('is_read') is_read: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('order_by') order_by: string = 'date',
        @Query('order_type') order_type: string = 'desc',
        @Query('sms_uuid') sms_uuid: string,
        @Query('sender_number') sender_number: string,
        @Query('destination_number') destination_number: string,
        @Query('text') text: string,
        @Query('group') group: string,
    ) {
        try {
            const sms_data = {
                type: 'sms' + type[0],
                direction: type,
                is_read,
                order_by,
                order_type,
                sms_uuid,
                sender_number,
                destination_number,
                text,
                table_list: await this.smsFacade.getSmsTableList(startDate, endDate, 5),
                group: (group === 'yes')
            }

            if (req.user.role !== 'admin') {
                let user_numbers: string[] = await this.accountNumberFacade.getUserAccountTrackingNumbers(req.user.userId, req.user.accountId);
                sms_data['numbers'] = user_numbers;
            }

            let sms = await this.smsFacade.getSms(sms_data);

            return res.status(200).json({ success: true, payload: { items: sms, total: sms.length } });
        } catch (e) {
            console.log(e);
            return { message: e.message };
        }
    }

    @Get('count/:number')
    @ApiOperation({ description: "Get sms quantity for number", operationId: "getSmsQuantityForNumber", summary: "Get sms quantity for number" })
    @ApiParam({ name: 'number', description: 'Number to get in out sms quantity' })
    @ApiQuery({ name: 'startDate', description: 'Start date to select sms from. YYYY/MM/DD format. not timestamp. Default 5 days ago date', required: false })
    @ApiQuery({ name: 'endDate', description: 'End date to select sms to. YYYY/MM/DD format. not timestamp. Default current date', required: false })
    async getNumberSmsQuantity(@Req() req, @Res() res,
        @Param('number') number: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        try {
            if (req.user.role !== 'admin') {
                let user_numbers: string[] = await this.accountNumberFacade.getUserAccountTrackingNumbers(req.user.userId, req.user.accountId);
                if (!user_numbers.includes(number)) return res.status(HttpStatus.BAD_REQUEST).json({ error: 'This number does not belong to you.' });
            }

            let sms = await this.smsFacade.getSmsQuatity(number, startDate, endDate);

            return res.status(HttpStatus.OK).json(sms);
        } catch (e) {
            console.log(e);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
        }
    }

    @Get('conversation/:ownNumber/:interlocutorNumber')
    @ApiOperation({ description: "Get conversation for number", operationId: "getConversationForNumber", summary: "Get conversation for number" })
    @ApiParam({ name: 'ownNumber', description: 'Number of requester' })
    @ApiParam({ name: 'interlocutorNumber', description: 'Number of interlocutor' })
    @ApiQuery({ name: 'startDate', description: 'Start date to select sms from. YYYY/MM/DD format. not timestamp. Default 10 days ago date', required: false })
    @ApiQuery({ name: 'endDate', description: 'End date to select sms to. YYYY/MM/DD format. not timestamp. Default current date', required: false })
    @ApiQuery({ name: 'orderBy', description: 'Order by', required: false, enum: ['date'] })
    @ApiQuery({ name: 'orderType', description: 'Order type', required: false, enum: ['asc', 'desc'] })
    async getConversation(@Req() req, @Res() res,
        @Param('ownNumber') ownNumber: string,
        @Param('interlocutorNumber') interlocutorNumber: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('orderBy') orderBy: string = 'desc',
        @Query('orderType') orderType: string = 'date'
    ) {
        try {
            let number = await this.accountNumberFacade.ownNumber(req.user.userId, req.user.accountId, ownNumber);
            if (!number) return res.status(HttpStatus.BAD_REQUEST).json({ error: `This number "${ownNumber}" does not belong to you.` });

            const sms_data = {
                order_by: orderBy,
                order_type: orderType,
                own_number: ownNumber,
                interlocutor_number: interlocutorNumber,
                table_list: await this.smsFacade.getSmsTableList(startDate, endDate, 10)
            }

            let sms = await this.smsFacade.getConversation(sms_data);

            return res.status(HttpStatus.OK).json(sms);
        } catch (e) {
            console.log(e);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
        }
    }

    @Patch('read')
    @ApiOperation({ description: "Update sms read status", operationId: "UpdateSmsReadStatus", summary: "Update sms read status" })
    @ApiBody({
        required: true, type: SmsReadStatus })
    async updateSmsReadStatus(@Req() req, @Res() res: Response, 
        @Body() body: SmsReadStatus
    ) {
        try {
            let user_numbers: string[] = await this.accountNumberFacade.getUserAccountTrackingNumbers(req.user.userId, req.user.accountId);

            let update = await this.smsFacade.updateSmsReadStatus(body.data, user_numbers, body.read);

            return res.status(202).json({ success: !!update });
        } catch (e) {
            console.log(e);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
        }
    }
}