import {ApiProperty} from '@nestjs/swagger';

export class UpdatePassword {
    @ApiProperty()
    password: string;

    @ApiProperty()
    rePassword: string;
}
