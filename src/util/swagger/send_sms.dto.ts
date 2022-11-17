import { Data } from '../../models'
import { ApiProperty } from '@nestjs/swagger';
//import { ContactInvitation } from './contact_invitation';
import { ValidateNested, IsArray } from "class-validator";
//import { Type } from "class-transformer";

export class SendSms {

    @ApiProperty()
    from?: string;
    @ApiProperty()
    to: string;
    @ApiProperty()
    msg: string;

}