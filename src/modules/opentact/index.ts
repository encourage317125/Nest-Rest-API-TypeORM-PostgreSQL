
import { OpentactService } from './opentact.service';
import { Module } from '@nestjs/common';
import { WSGateway } from '../websocket/sms.gateway';
import { DBFactoryModule } from '../db';
import { Repositories} from '../db/repositories';

@Module({
    imports: [DBFactoryModule],
    providers: [OpentactService, WSGateway, Repositories ],
    exports: [OpentactService]
})

export class OpentactModule { }
export {components} from './opentact-original.dto'
export { OpentactService } from './opentact.service';
export { opentactCreateSipUserDto, opentactISIPControlAppCallSearchParams,opentactITNLeaseSearchParams, opentactIOutboundVoiceProfileUpdateParams, opentactIOutboundVoiceProfileNewParams, opentactISIPDomainUpdateParams, opentactISIPControlAppUpdateParams, opentactISIPControlAppNewParams, opentactITNLeasesAssignParams, opentactISMSISMSSearchParams, opentactESearchMode, opentactISMSISearchParams, opentactIMessagingProfile, opentactISMSNewParams, opentactISIPUserResponse, opentactITNOrderNewParams, opentactITNSearchParams, opentactITNSearchResponse } from './opentact.dto';
