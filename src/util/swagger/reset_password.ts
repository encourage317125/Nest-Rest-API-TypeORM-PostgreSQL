import {ApiProperty} from '@nestjs/swagger';

export class ResetPassword {
    @ApiProperty()
    email: string;
}
