import { ApiProperty } from '@nestjs/swagger';

export class ContactReq {
    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    active: boolean;
}