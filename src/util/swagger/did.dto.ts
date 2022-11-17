import {ApiProperty} from "@nestjs/swagger";

// export class BuyDid {
//     @ApiProperty()
//     didID: number;
//     @ApiProperty()
//     companyUuid: string;
// }


// export class IUpdateDid{
//     numberName: string;
//     cfId: number;
// }

export class DisableEnableDid {
    @ApiProperty()
    id: number;
    @ApiProperty()
    enable: boolean;
}

// export class AssignCallFlow {
//     @ApiProperty()
//     id: number;
//     @ApiProperty()
//     cfId: number;
// }