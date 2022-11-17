import {ApiProperty} from '@nestjs/swagger';

export class AuthReq {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}
