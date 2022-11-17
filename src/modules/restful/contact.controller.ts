'use strict';

import {Controller, Get, Post, HttpStatus, Req, Res, Body, Delete, Param, Patch, Query} from '@nestjs/common';
import {Response} from 'express';
import {ContactReq} from '../../util/swagger';
import {ValidationPipe} from '../../util/validatior';
import {ContactFacade} from '../facade';
import {Contact} from '../../models';
import {ApiResponse, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery} from '@nestjs/swagger';
import {errorResponse} from "../../filters/errorRespone";

@Controller("contacts")
@ApiBearerAuth()
export class ContactController {
    constructor(private contactFacade: ContactFacade) {
    }

    @ApiResponse({status: 200, description: "contact created", type: Contact})
    @ApiOperation({ description: "create a contact.", operationId: "createContact", summary: "create a contact" })
    @Post()
    public async create(@Req() req, @Body('', new ValidationPipe()) contact: ContactReq, @Res() res: Response) {
        try {
            res.status(HttpStatus.OK).json(await this.contactFacade.create(req.user, contact));
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(":id")
    @ApiParam({name: "id", description: "id", required: true, type: Number})
    @ApiResponse({ status: 200, description: "contact updated", type: Contact })
    @ApiOperation({ description: "edit contact.", operationId: "editContact", summary: "Edit Contact" })
    public async edit( @Req() req, @Body() contact: ContactReq, @Res() res: Response, @Param("id") id: number) {
        try {
            res.status(HttpStatus.OK).json(await this.contactFacade.edit(req.user, id, contact));
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get(":id")
    @ApiParam({name: "id", description: "id", required: true, type: Number})
    @ApiResponse({ status: 200, description: "contact info", type: Contact })
    @ApiOperation({ description: "get contact.", operationId: "getContact", summary: "Get Contact" })
    public async get( @Req() req, @Res() res: Response, @Param("id") id: number) {
        try {
            res.status(HttpStatus.OK).json(await this.contactFacade.get(req.user, id));
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(":id")
    @ApiParam({name: "id", description: "id", required: true, type: Number})
    @ApiResponse({ status: 200, description: "contact info", type: Contact })
    @ApiOperation({ description: "delete contact.", operationId: "deleteContact", summary: "Delete Contact" })
    public async delete( @Req() req, @Res() res: Response, @Param("id") id: number) {
        try {
            await this.contactFacade.delete(req.user, id)
            res.status(HttpStatus.OK).json({response: 'ok'});
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    @ApiResponse({ status: 200, description: "contact info", type: Contact })
    @ApiOperation({ description: "get contact list.", operationId: "getContactList", summary: "Get Contact List" })
    @ApiQuery({ name: 'number', description: 'Search by number', required: false })
    public async getAll( @Req() req, @Res() res: Response, @Query('number') number: string) {
        try {
            let result = await this.contactFacade.getList(req.user, number);
            if (result)
                res.status(HttpStatus.OK).json({response: result[0], entries: result[1]});
            else
                res.status(HttpStatus.OK).json({response: [], entries: 0});
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
