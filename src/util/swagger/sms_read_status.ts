import { ApiProperty } from "@nestjs/swagger";

class smsRead {
    @ApiProperty()
    date: Date;
    @ApiProperty()
    uuids: string[];
}

export class SmsReadStatus {
    @ApiProperty({ isArray: true, type: smsRead })
    data: smsRead[];
    @ApiProperty()
    read: boolean;
};
