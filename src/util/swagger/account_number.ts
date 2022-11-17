import {ApiProperty} from '@nestjs/swagger';

export class AccountNumberReq {
    @ApiProperty()
    didID: string;
    // @ApiProperty()
    // companyUuid: string;
    @ApiProperty()
    userID: number;
    @ApiProperty()
    accountID: number;
    @ApiProperty()
    planID: number;
    @ApiProperty()
    recordCalls: string;
    @ApiProperty()
    whisperMessage: string;
    @ApiProperty()
    recordCallsBoolean: boolean;
    @ApiProperty()
    whisperMessageBoolean: boolean;
    @ApiProperty()
    number: number;
    @ApiProperty()
    visitorFor: string;
    @ApiProperty()
    visitorFrom: string;
    @ApiProperty()
    alwaysSwap: boolean;
    @ApiProperty()
    direct: boolean;
    @ApiProperty()
    lendParams: boolean;
    @ApiProperty()
    lendPage: boolean;
    @ApiProperty()
    webRef: boolean;
    @ApiProperty()
    search: boolean;
    @ApiProperty()
    poolSize: number;
    @ApiProperty()
    destinationNumber: number;
    @ApiProperty()
    poolName: string;
    @ApiProperty()
    trackCampaign: boolean;
    @ApiProperty()
    trackEachVisitor: boolean;
    @ApiProperty()
    numberOnWebSite: boolean;
    @ApiProperty()
    numberOnline: boolean;
    @ApiProperty()
    status: boolean;
    // @ApiProperty()
    // companyName: string;
    @ApiProperty()
    registerDate?: Date;
    @ApiProperty()
    isTextMessaging: boolean;
}
