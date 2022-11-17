import { ApiProperty } from '@nestjs/swagger';

export class ChangePassword {
    @ApiProperty()
    token: string;
    @ApiProperty()
    password: string;
}
