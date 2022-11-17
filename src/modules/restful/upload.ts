'use strict';

import {
    Controller,
    HttpStatus,
    Req,
    Res,
    Post,
    UseInterceptors,
    //FileInterceptor,
    UploadedFile
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiTags,
    ApiResponse,
    ApiConsumes,
    ApiParam,
    ApiBody,
    // ApiImplicitFile,
    ApiOperation
} from '@nestjs/swagger';
import { errorResponse } from '../../filters/errorRespone';
import { Response } from "express";
import { UserFacade } from "../facade/";
import { diskStorage } from 'multer';
import { HelperClass } from "../../filters/Helper";
import { FileInterceptor } from '@nestjs/platform-express';
import constants from '../../constants';
import { existsSync, mkdirSync, unlinkSync } from 'fs';

@Controller("upload")
@ApiTags("Upload")
@ApiBearerAuth()
export class Upload {
    constructor(
        private userFacade: UserFacade
    ) {
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req: any, file, cb) => {
                if (!existsSync(constants.PATH_TO_IMAGE_FOLDER)){
                    mkdirSync(constants.PATH_TO_IMAGE_FOLDER);
                }
                return cb(null, `${constants.PATH_TO_IMAGE_FOLDER}`);
            },
            filename: (req: any, file, cb) => {
                if (existsSync(`${constants.PATH_TO_IMAGE_FOLDER}/${req.user.userUuid}.jpeg`)){
                    unlinkSync(`${constants.PATH_TO_IMAGE_FOLDER}/${req.user.userUuid}.jpeg`);
                }
                return cb(null, `${req.user.userUuid}.jpeg`);
            }
        }),
        fileFilter: async (req, file: any, cb) => {
            let prefix = file.mimetype.substring(0, 5);
            // if (!file.mimetype.match(/(image)\/(jpeg)$/)) {
            if (prefix != 'image') {
                return cb(null, false);
            }
            return cb(null, file);
        }
    }))
    @ApiResponse({ status: 200, description: "Successful image uploading" })
    @Post('user/image')
    @ApiConsumes("multipart/form-data")
    // @ApiParam({name: "file", description: "User Image File"})
    // @ApiImplicitFile({name: "file", description: "JPEG file", required: true})
    @ApiBody({
        type: 'multipart/form-data',
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    // required: true,
                    type: "file",
                    description: "The file to upload.",
                    format: 'binary',
                },
            },
        },
    })
    @ApiOperation({
        description: "multipart/form-data. upload UserImageFile",
        operationId: "uploadUserImageFile",
        summary: "Upload UserImageFile "
    })
    public async uploadImageForUser(@Req() req, @Res() res: Response, @UploadedFile() file) {
        try {
            if (!req.file) return HelperClass.throwErrorHelper('upload:fileFormatWrong');
            let link = `${process.env.CURRENT_SERVER}/user/image/${req.user.userUuid}.jpeg`;
            await this.userFacade.uploadedImageLinkToUserTable(link, req.user.userUuid);
            // return res.status(200).json({ response: link });
            return res.status(200).json({ response: 'Successful image uploading' });
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }

}
