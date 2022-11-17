'use strict';

import {Body, Controller, Get, Param, Patch, Query, Req, Res} from '@nestjs/common';
import {Response} from 'express';
import {ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import { JWTHelper } from '../../util/jwt';
import { UserFacade } from '../facade';
import { UpdatePassword } from '../../util/swagger/update_password';
import { OpentactService } from '../opentact';
import { join } from 'path';

@Controller("public")
@ApiTags("Public")
export class PublicApi {
    constructor(
        private userFacade: UserFacade,
        private opentactService: OpentactService,
    ) {
    }

    @Get("timezone/list")
    @ApiResponse({status: 200, description: "dids search OK"})
    public async getXmlFile(@Req() req, @Res() res: Response) {
        // let helper = new HelperClass();
        // let json = await helper.callbackGetJson();
        let json: string = '';
        try {
            json = require('../../../assets/timezones.json');
        } catch (e) {
            return res.status(404).send({message: e.message.split('\n')[0]});
        }
        return res.status(200).send(json);
    }

    @Patch("user/:token")
    @ApiQuery({ name: "token", description: "provided token", required: true, type: String })
    @ApiBody({
        required: true, type: UpdatePassword })
    @ApiResponse({status: 200, description: "verifies token and updates password"})
    public async verifyTokenAndUpdatePassword(@Req() req, @Res() res: Response,
        @Param("token") token: string,
        @Body() body: any
    ) {
        try {
            let data: any = await JWTHelper.verify(token);
            if(!data.email) return res.status(400).send('Invalid token');
            if(!body.password) return res.status(400).send('Password is required');
            if(!body.rePassword) return res.status(400).send('Repeat Password is required');
            if(!body.password !== body.rePassword) return res.status(400).send('Password doesn\'t match Repeat Password');
            let user = await this.userFacade.findByEmail(data.email);
            if(!user) return res.status(404).send('User not found.');
            let update = await this.userFacade.updatePassword(body.password, user.uuid);
            return res.status(200).send(update);
        } catch (e) {
            return res.status(404).send({message: e.message});
        }
    }

    @Get("number_search/:type")
    @ApiParam({ name: 'type', description: 'type must be \"long_code\" or \"toll_free\"', required: true, type: String })
    @ApiQuery({ name: 'state', description: 'Two-letter state or province abbreviation (e.g. IL, CA)', required: false})
    @ApiQuery({ name: 'npa', description: 'first 3 digits of the phone number', required: false})
    @ApiQuery({ name: 'skip', description: 'Pagination page. default 1', required: false })
    @ApiQuery({ name: 'take', description: 'Max elements to return. default 10', required: false })
    @ApiResponse({status: 200, description: "get numbers"})
    public async searchNumber(@Req() req, @Res() res: Response,
        @Param("type") type: string,
        @Query("state") state: any,
        @Query("npa") npa: any,
        @Query("take") take: number,
        @Query("skip") skip: number
    ) {
        try {
            if (!["long_code", "toll_free"].includes(type)) {
                return res.status(404).send(`${req.url} not found`);
            }

            let response = await this.opentactService.getTrackingNumbers({ skip, take, type, state, npa });
            
            return res.status(200).send(response);
        } catch (e) {
            return res.status(404).send({message: e.message});
        }
    }

    @Get("list/npa/:state")
    @ApiParam({ name: 'state', description: 'state with two general letters', required: true, type: String })
    @ApiResponse({status: 200, description: "get npa for state"})
    public async searchStateNPA(@Req() req, @Res() res: Response,
        @Param("state") state: string,
    ) {
        try {
            
            let response = await this.opentactService.getAvailableRatecenterNpaNxx(state);
            
            return res.status(200).send(response);
        } catch (e) {
            return res.status(404).send({message: e.message});
        }
    }

    @Get("assets/:image")
    public async getFreeSmsLogo(@Req() req, @Res() res: Response, @Param('image') image) {
        try {
            res.contentType('content-type: image/png').sendFile(join(process.cwd(), `/assets/${image}`), function (err) {
                if (err) {
                  return res.status(404).end();
                }
            })
        } catch (e) {
            return res.status(404).send({message: e.message});
        }
    }
}
