import {ApiProperty} from "@nestjs/swagger";

export class AccountBlacklistSwagger {
    @ApiProperty()
    number: number;
    @ApiProperty()
    reason: string;
    // @ApiProperty()
    // companyUuid?: string;
    @ApiProperty()
    other_detail?: string;
}

export class AccountBlacklistDelete {
    @ApiProperty()
    uuid: string;
    // @ApiProperty()
    // companyUuid: string;
}

export class AccountBlacklistStatus{
    @ApiProperty()
    status: boolean;
}