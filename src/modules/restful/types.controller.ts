'use strict';

import { Controller, Get, Put, Post, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MessageCodeError } from '../../util/error';
import { Constants } from '../../util/constants';
import { AuthService } from '../auth/';
import { DataFacade } from '../facade';
import { Data } from '../../models';
import { ApiBody, ApiParam, ApiResponse, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';

@Controller("types")
@ApiBearerAuth()
export class TypesController {
    constructor(private dataFacade: DataFacade) {
    }

    @Get("numbers")
    @ApiOperation({ description: "returns number types.", operationId: "numbers", summary: "numbers type" })
    @ApiResponse({ status: 200, description: "numbers OK", type: Data, isArray: true })
    public async number( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CATEGORY_NUMBERS)));
    }
    
    @Get("blackListReasons")
    @ApiOperation({ description: "returns blackList Reasons.", operationId: "blackListReasons", summary: "blackList Reasons" })
    @ApiResponse({ status: 200, description: "numbers OK", type: Data, isArray: true })
    public async blackListReasons( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CATEGORY_BLACKLIST_REASONS)));
    }

    @Get("users")
    @ApiOperation({ description: "returns users types.", operationId: "typeUsers", summary: "Users type" })
    @ApiResponse({ status: 200, description: "USERS TYPES OK", type: Data, isArray: true })
    public async user( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.USER_TYPE)));
    }
    // @Get("callFlow")
    // @ApiOperation({ description: "returns call flow types.", operationId: "callFlowTypes", summary: "call flow type" })
    // @ApiResponse({ status: 200, description: "CALL FLOW TYPES OK", type: Data, isArray: true })
    // public async callFlow( @Req() req, @Res() res: Response) {
    //     res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CALL_FLOW_TYPES)));
    // }
    @Get("interactionTypes")
    @ApiOperation({ description: "returns interaction types.", operationId: "interactionTypes", summary: "Interactions type" })
    @ApiResponse({ status: 200, description: "Interactions types OK", type: Data, isArray: true })
    public async interactions( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.INTERACTION_TYPE)));
    }
    @Get("alertTypes")
    @ApiOperation({ description: "returns alert types.", operationId: "alertTypes", summary: "Alert types" })
    @ApiResponse({ status: 200, description: "alerts types OK", type: Data, isArray: true })
    public async alerts( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.ALERT_TYPE)));
    }
    @Get("frequency")
    @ApiOperation({ description: "returns frequency types.", operationId: "frequencyTypes", summary: "frequency types" })
    @ApiResponse({ status: 200, description: "frequency types OK", type: Data, isArray: true })
    public async frequency( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CATEGORY_FREQUENCY)));
    }
    @Get("timezone")
    @ApiOperation({ description: "returns timezone list.", operationId: "timezoneList", summary: "timezone list" })
    @ApiResponse({ status: 200, description: "typezone list OK", type: Data, isArray: true })
    public async timezone( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.TIMEZONE_TYPE)));
    }
    @Get("callType")
    @ApiOperation({ description: "returns call types.", operationId: "callType", summary: "callType list" })
    @ApiResponse({ status: 200, description: "call type list OK", type: Data, isArray: true })
    public async callType( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CALL_TRANSLATE_CALL_TYPE)));
    }
    @Get("callDuration")
    @ApiOperation({ description: "returns call duration.", operationId: "callDuration", summary: "call duration list" })
    @ApiResponse({ status: 200, description: "call duration list OK", type: Data, isArray: true })
    public async callDuration( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CALL_TRANSLATE_CALL_DURATION)));
    }
    @Get("callDirection")
    @ApiOperation({ description: "returns call direction.", operationId: "callDirection", summary: "call direction list" })
    @ApiResponse({ status: 200, description: "call direction list OK", type: Data, isArray: true })
    public async callDirection( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CALL_TRANSLATE_CALL_DIRECTION)));
    }
    @Get("emailContent")
    @ApiOperation({ description: "returns emailContent types.", operationId: "emailContentTypes", summary: "emailContent types" })
    @ApiResponse({ status: 200, description: "emailContent types OK", type: Data, isArray: true })
    public async emailContent( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CATEGORY_EMAIL_CONTENT)));
    }
    @Get("dialNumber")
    @ApiOperation({ description: "returns dial Number types.", operationId: "dialNumberTypes", summary: "Dial Number types" })
    @ApiResponse({ status: 200, description: "emailContent types OK", type: Data, isArray: true })
    public async dialNumber( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.DIAL_NUMBER_TYPE)));
    }
    @Get("callerType")
    @ApiOperation({ description: "returns call types.", operationId: "callerType", summary: "callerType list" })
    @ApiResponse({ status: 200, description: "call type list OK", type: Data, isArray: true })
    public async callerType( @Req() req, @Res() res: Response) {
        res.status(HttpStatus.OK).json((await this.dataFacade.findByCategory(Constants.CALLER_TYPE)));
    }
}
