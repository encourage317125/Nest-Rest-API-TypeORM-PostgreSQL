import {ApiProperty} from '@nestjs/swagger';

export class AccountNumberTiny {
    @ApiProperty()
    id: number;

    @ApiProperty()
    number: string;
}

export class AccountInfo {
    @ApiProperty()
    name: string;

    @ApiProperty()
    techPrefix: string;

    @ApiProperty()
    dnlId: string;

    // @ApiProperty()
    // planUuid: string;

    @ApiProperty()
    status: boolean;

    @ApiProperty()
    allowOutbound: boolean;

    @ApiProperty()
    metadata?: any;
}
