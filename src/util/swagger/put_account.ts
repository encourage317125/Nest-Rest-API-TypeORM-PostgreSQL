import {ApiProperty} from '@nestjs/swagger';

export class PutAccount {
    @ApiProperty()
    name: string;

    @ApiProperty()
    number: string;

    @ApiProperty()
    techPrefix: string;

    @ApiProperty()
    dnlId: string;

    @ApiProperty()
    allowOutbound: boolean;

}
