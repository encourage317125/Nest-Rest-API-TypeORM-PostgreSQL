import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Delete, HttpStatus, Req, Res} from "@nestjs/common";
import {Response} from "express";
import {errorResponse} from "../../filters/errorRespone";
import {UserFacade} from "../facade";
import constants from "../../constants";

@Controller("delete")
@ApiTags("Upload")
@ApiBearerAuth()
export class DeleteFileController {
    constructor(private userFacade: UserFacade) {
    }

    @ApiResponse({status: 200, description: "Successful delete"})
    @Delete('user/image')
    public async removeUserImage(@Req() req, @Res() res: Response) {
        try {
            let {userUuid} = req.user;
            await this.userFacade.deleteImageFromDistPromise(`${constants.PATH_TO_IMAGE_FOLDER}`, userUuid);
            await this.userFacade.deleteImageFromTable(userUuid);
            return res.status(200).json({response: 'Image was removed'});
        } catch (err) {
            errorResponse(res, err.message, HttpStatus.BAD_REQUEST);
        }
    }
}