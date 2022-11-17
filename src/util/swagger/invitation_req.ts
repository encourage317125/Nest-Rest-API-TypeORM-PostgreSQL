import { ApiProperty } from '@nestjs/swagger';

export class InvitationReq {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    type: number;

    @ApiProperty()
    compId: number;
}