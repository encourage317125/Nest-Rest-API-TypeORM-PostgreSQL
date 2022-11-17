import {ApiProperty} from '@nestjs/swagger';

export class TrackingNumber {
    @ApiProperty()
    didID: string;
    // @ApiProperty()
    // companyUuid: string;
    // @ApiProperty()
    // planID: number;
    @ApiProperty()
    recordCalls: string;
    @ApiProperty()
    whisperMessage: string;
    @ApiProperty()
    recordCallsBoolean: boolean;
    @ApiProperty()
    whisperMessageBoolean: boolean;
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
}

export class TrackingNumberPatch {
    // @ApiProperty()
    // callFlowID: number;
    @ApiProperty()
    id: number;
    @ApiProperty()
    didID: number;
    // @ApiProperty()
    // companyUuid: string;
    // @ApiProperty()
    // planID: number;
    @ApiProperty()
    recordCalls: string;
    @ApiProperty()
    whisperMessage: string;
    @ApiProperty()
    recordCallsBoolean: boolean;
    @ApiProperty()
    whisperMessageBoolean: boolean;
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
    isTextMessaging: boolean;
}

export class TrackingNumberDelete {
    @ApiProperty()
    id: number;
}

export class DisableEnable {
    @ApiProperty()
    id: number;
    @ApiProperty()
    status: boolean;
}

export class NumberFeatures {
    @ApiProperty()
    features: string[];
}