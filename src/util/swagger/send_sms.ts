import { ApiProperty } from '@nestjs/swagger';

export class SendSmsReq {
    @ApiProperty()
    from: number;
    
    @ApiProperty()
    to: number;

    @ApiProperty()
    message: string;
}