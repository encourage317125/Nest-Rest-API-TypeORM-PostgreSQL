import { ApiProperty } from "@nestjs/swagger";

export class OrderDid {
    @ApiProperty()
    tn: number;
    @ApiProperty()
    features: string[];
    @ApiProperty()
    autorenew: boolean;
}