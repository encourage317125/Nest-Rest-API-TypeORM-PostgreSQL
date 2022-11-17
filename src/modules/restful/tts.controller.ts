'use strict';

import { Controller, Get, Post, Patch, HttpStatus, Req, Res, Query, Param } from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiResponse, ApiOperation, ApiBearerAuth, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { errorResponse } from "../../filters/errorRespone";
import { MessageCodeError } from '../../util/error';
import { OpentactService } from "../opentact";
//import {HelperClass} from "../../filters/Helper";


@Controller("tts")
@ApiBearerAuth()
@ApiTags("tts")
export class TtsController {
    constructor(
        private opentactService: OpentactService,
    ) {
    }

    @Post('play')
    @ApiOperation({ description: "get audio file", operationId: "play", summary: "Play the text" })
    @ApiResponse({ status: 200, description: "play OK" })
    @ApiResponse({ status: 400, description: "Returns error in header x-message-code-error " })
    public async play(@Req() req, @Res() res: Response) {
        try {
            if (!req.body.text) {
                throw new MessageCodeError("playText:NotFound");
            }

            let adminToken = await this.opentactService.adminLoginGettignToken();
            const file = await this.opentactService.playTTS(adminToken.token, req.body.text);
            res.status(HttpStatus.OK).json(file);
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
