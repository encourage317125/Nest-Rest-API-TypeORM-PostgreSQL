'use strict';

import {
  Controller,
  HttpStatus,
  Req,
  Res,
  Post,
  Patch,
  Param,
  Get,
  UseGuards,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
// import {PlanFacade} from '../facade';
// import {Plan} from '../../models';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { errorResponse } from '../../filters/errorRespone';
import { HelperClass } from '../../filters/Helper';
import {
  OpentactService,
  components,
  opentactISIPControlAppCallSearchParams,
  opentactITNLeaseSearchParams,
  opentactIOutboundVoiceProfileUpdateParams,
  opentactCreateSipUserDto,
  opentactISIPDomainUpdateParams,
  opentactIOutboundVoiceProfileNewParams,
  opentactISIPControlAppNewParams,
  opentactISIPControlAppUpdateParams,
  opentactITNLeasesAssignParams,
  opentactIMessagingProfile,
  opentactISMSNewParams,
  opentactISIPUserResponse,
  opentactISMSISMSSearchParams,
  opentactITNOrderNewParams,
} from '../opentact';
import uuid = require('uuid');
import { RoleGuard } from '../../util/guard/RoleGuard';
import { Roles } from '../../util/decorator/roles.decorator';

import * as fs from 'fs';
import * as path from 'path';

@Controller('opentact')
@ApiTags('Opentact')
@UseGuards(RoleGuard)
@Roles('admin')
@ApiBearerAuth()
export class OpentactController {
  constructor(
    /*private planFacade: PlanFacade*/
    private opentactService: OpentactService,
  ) {}

  @Get('country_codes')
  public async getCountryCodes(@Res() res: Response): Promise<any> {
    const token = await this.opentactService.getCountryCodes();
    res.status(HttpStatus.OK).json({ response: token });
  }

  @Get('opentact/token')
  public async getToken(@Res() res: Response): Promise<any> {
    const token = await this.opentactService.getToken();
    res.status(HttpStatus.OK).json({ response: token });
  }

  @Get('tn/search')
  // @ApiResponse({ status: 200, description: "numbers trackingNumber OK" })
  public async getTN(@Req() req, @Res() res: Response) {
    let response = await this.opentactService.getTrackingNumbers();
    return res
      .status(HttpStatus.OK)
      .json({ response: response.success, entries: response.payload.data });
  }

  @Get('sip_users')
  // @ApiResponse({ status: 200, description: "numbers trackingNumber OK" })
  public async getSipUsers(@Req() req, @Res() res: Response) {
    let response = await this.opentactService.getSipUsers();
    return res
      .status(HttpStatus.OK)
      .json({ response: response.success, entries: response.payload });
  }

  @Get('sip_connections')
  // @ApiResponse({ status: 200, description: "numbers trackingNumber OK" })
  public async getSipConnections(@Req() req, @Res() res: Response) {
    let response = await this.opentactService.getSipConnections();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('orders')
  // @ApiResponse({ status: 200, description: "numbers trackingNumber OK" })
  public async getOrders(@Req() req, @Res() res: Response) {
    let response = await this.opentactService.getOrders();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('sip_app')
  public async getSipApp(@Req() req, @Res() res: Response) {
    let response = await this.opentactService.getSipApp();
    return res.json(response);
  }

  // @Get("sip/app/call")
  // public async getSipAppCalls(@Req() req, @Res() res: Response,) {
  //     let response = await this.opentactService.getSipAppCalls();
  //     return res.json(response);
  // }

  @Post('sip_app/call/search')
  public async getSipAppCalls(
    @Req() req,
    @Body() body: opentactISIPControlAppCallSearchParams,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.getSipAppCalls(body);
    return res.json(response);
  }

  // @Get("sip/app/:uuid/logs")
  // public async getSipLogs(@Req() req, @Param("uuid") uuid: string, @Res() res: Response,) {
  //     let response = await this.opentactService.getSipAppLogs(uuid);
  //     return res.json(response);
  // }

  @Post('sip_app')
  public async createSipApp(
    @Req() req,
    @Body() body: opentactISIPControlAppNewParams,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.createSipApp(body);
    return res.json(response);
  }

  @Patch('sip_app/:uuid')
  public async updateSipApp(
    @Req() req,
    @Body() body: opentactISIPControlAppUpdateParams,
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.updateSipApp(uuid, body);
    return res.json(response);
  }

  @Get('sip_app/:uuid/tnLeases')
  public async getSipAppLeases(
    @Req() req,
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.getSipAppLeases(uuid);
    return res.json(response);
  }

  @Post('sip_app/:uuid/tnLeases')
  public async addSipAppLeases(
    @Req() req,
    @Param('uuid') uuid: string,
    @Body() body: opentactITNLeasesAssignParams,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.addSipAppLeases(body, uuid);
    return res.json(response);
  }

  @Get('outbound_voice_profile')
  public async getOutboundVoiceProfile(@Req() req, @Res() res: Response) {
    let response = await this.opentactService.getOutboundVoiceProfile();
    return res.json(response);
  }
  @Post('outbound_voice_profile')
  public async createOutboundVoiceProfile(
    @Req() req,
    @Body() body: opentactIOutboundVoiceProfileNewParams,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.createOutboundVoiceProfile(body);
    return res.json(response);
  }

  @Patch('outbound_voice_profile/:uuid')
  public async updateOutboundVoiceProfile(
    @Req() req,
    @Body() body: opentactIOutboundVoiceProfileUpdateParams,
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.updateOutboundVoiceProfile(
      body,
      uuid,
    );
    return res.json(response);
  }

  @Get('sip_domains')
  public async getSipDomains(@Req() req, @Res() res: Response) {
    let response = await this.opentactService.getSipDomains();
    return res.json(response);
  }

  @Patch('sip_domains/:uuid')
  public async updateSipDomain(
    @Req() req,
    @Body() body: opentactISIPDomainUpdateParams,
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.updateSipDomain(uuid, body);
    return res.json(response);
  }

  @Get('messaging_profile')
  public async getMessagingProfile(@Req() req, @Res() res: Response) {
    let response = await this.opentactService.getMessagingProfile();
    return res.json(response);
  }

  @Patch('messaging_profile/:uuid')
  public async updateMessagingProfile(
    @Req() req,
    @Body() body: opentactIMessagingProfile,
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.updateMessagingProfile(body, uuid);
    return res.json(response);
  }

  @Post('sms')
  @ApiOperation({ description: 'create SMS' })
  public async createSMS(
    @Req() req,
    @Res() res: Response,
    @Body() body: opentactISMSNewParams,
  ) {
    let response = await this.opentactService.createSMS(body);
    return res.json(response);
  }

  @Post('sms/sent_callback')
  public async smsSentCallback(
    @Req() req,
    @Body() body: any,
    @Res() res: Response,
  ) {
    let jsonPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'callback_SMS_APi.txt',
      );
  
     const date = new Date();
    let response = await this.opentactService.smsSentCallback(body);

    const showData = `method: POST\n response:\n ${response}\r\n\r\n`;

    await fs.appendFile(jsonPath, showData, function () {
      console.log('appended');
    });
    return res.json(response);
  }

  @Post('sms/get_callback')
  public async smsGetCallback(
    @Req() req,
    @Body() body: any,
    @Res() res: Response,
  ) {
    let jsonPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'callback_SMS_APi.txt',
      );
  
      const date = new Date();
       let response = await this.opentactService.smsGetCallback(body, req);

      const showData = `method: POST\n response:\n ${response}\r\n\r\n`;
      await fs.appendFile(jsonPath, showData, function () {
        console.log('appended');
      });
    return res.json(response);
  }

  // @Post('call_flow/callback')
  // @ApiQuery({ name: 'from', description: 'phone number from', required: false })
  // @ApiQuery({ name: 'to', description: 'phone number to', required: false })
  // public async callFlowCallbackPost(
  //   @Req() req,
  //   @Body() body: any,
  //   @Query('from') from: string | undefined = undefined,
  //   @Query('to') to: string | undefined = undefined,
  //   @Res() res: Response,
  // ) {
  //   let jsonPath = path.join(
  //     __dirname,
  //     '..',
  //     '..',
  //     '..',
  //     'callback_callFlowAPi.txt',
  //   );

  //   const date = new Date();
  //   let response = await this.opentactService.callFlowCallback(from, to, body);
  //   const showData = `method: POST\n input_from: ${from}\n input_to: ${to}\n date:${date}\n XML:\n ${response}\r\n\r\n`;
  //   await fs.appendFile(jsonPath, showData, function () {
  //     console.log('appended');
  //   });

  //   res.set('Content-Type', 'text/xml');
  //   return res.json(response);
  // }

  // @Get('call_flow/callback')
  // @ApiQuery({ name: 'from', description: 'phone number from', required: false })
  // @ApiQuery({ name: 'to', description: 'phone number to', required: false })
  // public async callFlowCallbackGet(
  //   @Req() req,
  //   @Query('from') from: string | undefined = undefined,
  //   @Query('to') to: string | undefined = undefined,
  //   @Res() res: Response,
  // ) {
  //   let jsonPath = path.join(
  //       __dirname,
  //       '..',
  //       '..',
  //       '..',
  //       'callback_callFlowAPi.txt',
  //     );
  //   const date = new Date();
  //   let response = await this.opentactService.callFlowCallback(from, to);
  //   const showData = `method: GET\n input_from: ${from}\n input_to: ${to}\n date:${date}\n XML:\n ${response}\r\n\r\n`;
  
  //   await fs.appendFile(jsonPath, showData, function () {
  //     console.log('appended');
  //   });

  //   res.set('Content-Type', 'text/xml');
  //   return res.send(response);
  // }

  @Post('sms/search')
  @ApiOperation({ description: 'search SMS' })
  public async searchSMS(
    @Req() req,
    @Res() res: Response,
    @Body() body: opentactISMSISMSSearchParams,
  ) {
    let response = await this.opentactService.searchSMS(body);
    return res.json(response);
  }

  @Post('sip_users')
  @ApiOperation({ description: 'returns new sipUser' })
  @ApiResponse({
    status: 200,
    description: 'new SipUser',
    type: opentactISIPUserResponse,
  })
  public async createSipUser(
    @Req() req,
    @Res() res: Response,
    @Body() body: opentactCreateSipUserDto,
  ) {
    let response = await this.opentactService.createSipUser(body);
    return res.status(HttpStatus.OK).json(response);
  }

  @Delete('sip_users/:uuid')
  @ApiOperation({ description: 'delete sipUser' })
  @ApiResponse({ status: 200, description: 'new SipUser' })
  public async deleteSipUser(
    @Req() req,
    @Res() res: Response,
    @Param('uuid') uuid: string,
  ) {
    let response = await this.opentactService.deleteSipUser(uuid);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('orders')
  @ApiOperation({ description: 'creates new TNOrder' })
  // @ApiResponse({ status: 200, description: "new SipUser", type: opentactITNOrderNewParams })
  public async createOrderTN(
    @Req() req,
    @Res() res: Response,
    @Body() body: opentactITNOrderNewParams,
  ) {
    let response = await this.opentactService.createTNOrder(body);
    return res.status(HttpStatus.OK).json(response);
  }

  // @Get("lease")
  // // @ApiResponse({ status: 200, description: "numbers trackingNumber OK" })
  // public async getLeases(@Req() req, @Res() res: Response,) {
  //     let response = await this.opentactService.getLeases();
  //     return res.status(HttpStatus.OK).json({ response });
  // }
  @Post('lease')
  @ApiOperation({ description: 'search leases' })
  public async getLeases(
    @Req() req,
    @Res() res: Response,
    @Body() body: opentactITNLeaseSearchParams,
  ) {
    let response = await this.opentactService.getLeases(body);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('lease/:uuid')
  // @ApiResponse({ status: 200, description: "numbers trackingNumber OK" })
  public async getLease(
    @Req() req,
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    let response = await this.opentactService.getLease(uuid);
    return res.status(HttpStatus.OK).json({ response });
  }

  @Get('dialplan')
  // @ApiQuery({name: 'orderBy'})
  // @ApiQuery({name: 'orderType'})
  // @ApiQuery({name: 'page', description: 'page parameter'})
  // @ApiQuery({name: 'perPage', description: 'perPage parameter'})
  @ApiOperation({
    description: 'returns dial plan.',
    operationId: 'getDialPlan',
    summary: 'Dial plan',
  })
  public async getDialPlan(@Req() req, @Res() res: Response) {
    console.log('getDialPlan req: ', req);
    // try {
    //     let plan = await this.planFacade.getAllPlans(orderBy, orderType, offset, limit);
    //     res.status(HttpStatus.OK).json({plan: plan});
    // } catch (err) {
    //     errorResponse(res, err, HttpStatus.BAD_REQUEST);
    // }
  }

  @Post('call_status_callback')
  @ApiOperation({
    description: 'returns call status.',
    operationId: 'getCallStatus',
    summary: 'Call Status',
  })
  public async postCallStatus(@Req() req, @Res() res: Response) {
    console.log('getCallStatus req: ', req);
    res.status(HttpStatus.OK).json({ response: true });
    // try {
    //     let plan = await this.planFacade.getAllPlans(orderBy, orderType, offset, limit);
    //     res.status(HttpStatus.OK).json({plan: plan});
    // } catch (err) {
    //     errorResponse(res, err, HttpStatus.BAD_REQUEST);
    // }
  }

  @Get('call_status_callback')
  @ApiOperation({
    description: 'returns call status.',
    operationId: 'getCallStatus',
    summary: 'Call Status',
  })
  public async getCallStatus(@Req() req, @Res() res: Response) {
    console.log('getCallStatus req: ', req);
    res.status(HttpStatus.OK).json({ response: true });
    // try {
    //     let plan = await this.planFacade.getAllPlans(orderBy, orderType, offset, limit);
    //     res.status(HttpStatus.OK).json({plan: plan});
    // } catch (err) {
    //     errorResponse(res, err, HttpStatus.BAD_REQUEST);
    // }
  }
}
