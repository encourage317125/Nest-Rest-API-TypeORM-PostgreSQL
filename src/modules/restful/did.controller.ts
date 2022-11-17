'use strict';

import { Inject, Controller, Get, HttpStatus, Req, Res, Param, Patch, Delete, Query, Body } from '@nestjs/common';
import { Response } from 'express';
import { ApiParam, ApiResponse, ApiBearerAuth, ApiBody, ApiTags, ApiQuery } from '@nestjs/swagger';
import { OpentactService } from '../opentact/';
import { DidFacade } from '../facade/';
import { DisableEnableDid } from '../../util/swagger/did.dto';
import { errorResponse } from '../../filters/errorRespone';
import { HelperClass } from "../../filters/Helper";
import { CommonService } from '../services/common.service';
import { Repositories} from '../db/repositories';

const order_by_enum = ['number', 'createdOn'];
const order_dir_enum = ['ASC', 'DESC'];

@Controller("did")
@ApiTags("Did")
@ApiBearerAuth()
export class DidController {
    constructor(
        @Inject('Repositories')
        private readonly Repositories: Repositories, 
        private opentactService: OpentactService,
        private didFacade: DidFacade,
        private commonService: CommonService,) {
    }

    @Delete(":didId/disable")
    @ApiParam({ name: "didId", description: "did id", required: true, type: Number })
    @ApiResponse({ status: 200, description: "Successful did deleting" })
    public async disableDid(@Req() req, @Res() res: Response, @Param("didId") didId) {
        try {
            let token = await this.opentactService.adminLoginGettignToken();
            let response = await this.opentactService.disableDid(token.token, didId);
            return res.status(HttpStatus.OK).json({ response: response });
        } catch (err) {
            console.log("err: ", err);
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get("list/:areaCodeID")
    @ApiParam({ name: "areaCodeID", description: "from /area_codes ", required: true, type: Number })
    @ApiResponse({ status: 200, description: "Did list" })
    public async all(@Req() req, @Res() res: Response,
        @Param("areaCodeID") areaCodeID,
        @Query("offset") offset: number,
        @Query("limit") limit: number
    ) {

        if (!areaCodeID) {
            return HelperClass.throwErrorHelper('did:youShouldPassAreaCodeID');
        }
        res.status(HttpStatus.OK).json(
            (await this.opentactService.freeDids(req.user.opentactToken, areaCodeID, offset, limit))
        );

    }

    @Get("list")
    @ApiQuery({ name: 'offset', description: 'offset default 0', required: false })
    @ApiQuery({ name: 'limit', description: 'Max elements to return. default 10', required: false })
    @ApiQuery({ name: 'order_by', example: 'created_on', required: false, enum: order_by_enum })
    @ApiQuery({ name: 'order_dir', example: 'ASC', required: false, enum: order_dir_enum })
    @ApiQuery({ name: 'filterByNumber', required: false })
    @ApiResponse({ status: 200, description: "Did list" })
    public async didlist(@Req() req, @Res() res: Response,
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 10,
        @Query("filterByNumber") filterByNumber: any,
        @Query('order_by') order_by = order_by_enum[0],
        @Query('order_dir') order_dir = order_dir_enum[0],
    ) {
        const where = { accountID: req.user.accountId }
        if(filterByNumber) where['number'] = filterByNumber
        console.log('where',where)
        const response = await this.commonService.getEntities(this.Repositories.DID, {
            pageSize: limit,
            page: offset > 0 ? offset / limit : 0,
            where,
            // relations:["callFlow"],
        }, { [order_by]: order_dir })
        res.status(HttpStatus.OK).json({
            success: true,
            payload:response}
        );
    }

    @Get("list/searchBy/:did_id")
    @ApiQuery({ name: 'offset', description: 'offset default 0', required: false })
    @ApiQuery({ name: 'limit', description: 'Max elements to return. default 10', required: false })

    @ApiParam({ name: "did_id", description: "from / did_id ", required: true, type: Number })
    @ApiResponse({ status: 200, description: "Did list" })

    public async didlistByid(@Req() req, @Res() res: Response,
        @Param("did_id") did_id
    ) {
        if (!did_id) {
            return HelperClass.throwErrorHelper('did:youShouldPassDidId');
        }
        const accountID = req.user.accountId
        // const response = await this.commonService.getEntity(this.Repositories.DID, {
        // }, { id: 'ASC' })

        // const response = await this.commonService.getEntity(this.Repositories.DID,{ acco_id:accountId, id:trackId })
        
        const response = await this.commonService.getEntity(this.Repositories.DID, {
            id:did_id,
            accountID,
        })

        if(!response) {
            return HelperClass.throwErrorHelper('did:thereIsNotSuchEntitiy');
        }

        res.status(HttpStatus.OK).json({
            success: true,
            payload:response
        });
    }

    @Get("xml")
    @ApiResponse({ status: 200, description: "dids search OK" })
    public async getXmlFile(@Req() req, @Res() res: Response) {
        return res.status(200).send(`<document><section>Hello ,I'm xml file</section></document>`);
    }

    @Patch('disable/enable')
    @ApiBody({
        required: true, type: DisableEnableDid,
        // name: "body"
    })
    @ApiResponse({ status: 200, description: "Make did disable or enable" })
    public async disableOrEnableDid(@Req() req, @Res() res: Response) {
        try {
            let { id, enable } = req.body;
            let { userId, accountId } = req.user;
            let did = await this.didFacade.isDidCreatedByThisUser(userId, accountId, id);
            if (!did) await HelperClass.throwErrorHelper('did:thisDidIsNotExist');
            let response = await this.didFacade.disableEnableDid(id, enable);
            return res.status(HttpStatus.OK).json({ response });
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

    // @Patch('cf/:cf_id')
    // @ApiBody({
    //     required: true, type: AssignCallFlow,
    //     // name: "body"
    // })
    // @ApiResponse({ status: 200, description: "Assign Callflow" })
    // public async AssignCallFlow(@Req() req, 
    // @Param("cf_id") cfId, @Res() res: Response) {
    //     try {
    //         let { id, cfId } = req.body;
    //         let { userId, accountId } = req.user;
    //         let did = await this.didFacade.isDidCreatedByThisUser(userId, accountId, id);
    //         if (!did) await HelperClass.throwErrorHelper('did:thisDidIsNotExist');
    //         let response = await this.didFacade.assignCallFlow(id, cfId);
    //         return res.status(HttpStatus.OK).json({ response });
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // @Patch(':didId')
    // @ApiParam({ name: "didId", description: "did id", required: true, type: Number })
    // @ApiResponse({ status: 200, description: "Update Did" })
    // public async UpdateDid(@Req() req, 
    // @Param("didId") didId, @Res() res: Response, @Body() body:IUpdateDid ) {
    //     try {
    //         const { userId, accountId } = req.user;
    //         const where={accountID:accountId, id:didId}
    //         const {  cfId } = req.body;
    //         if(cfId){
    //         const cf= await this.commonService.getEntity(this.Repositories.CALL_FLOW,{accountId,id:cfId })
    //         if(!cf)await HelperClass.throwErrorHelper('cf:thisCfIsNotExist');
    //         }
    //         const response = await this.commonService.updateEntity(this.Repositories.DID, where, body)
    //         return res.status(HttpStatus.OK).json({ response });
    //     } catch (err) {
    //         errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
    //     }
    // }
}
