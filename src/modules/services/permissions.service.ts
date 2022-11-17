import { CommonService } from './common.service';
import { Injectable, Inject } from '@nestjs/common';


export interface PermissionsData {
    userData?: object,
    object?: object,
    where?: object,
    body?: object,
    entity?: string,
}


@Injectable()
export class PermissionsService {

    constructor(@Inject('CommonService')
    private readonly commonService: CommonService,
    ) { }


    public checkPermissions = async ({ userData = undefined, object = undefined, where = undefined, body = undefined, entity = undefined }: PermissionsData) => {
            if (entity === 'user') {
                await this.checkPermissionsUser({ userData, object, body })
            }
    }

    private checkPermissionsUser = async ({ userData, object, body }) => {
        if (userData.is_admin) {
            return
        } else if (userData.userType === 'user' && userData.accountId) {
            object.accountID = userData.accountId;
        } else {
            throw new Error("404")
        }
    }

}
