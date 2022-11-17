import {ApiProperty} from '@nestjs/swagger';

export class LeadCreate {

    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    email: string;
}
