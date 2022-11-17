import {ApiProperty} from '@nestjs/swagger';

export class UserPatchMethod {
    @ApiProperty()
    email: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    rePassword: string;
    @ApiProperty()
    twoFA: boolean;
    @ApiProperty()
    machineDetection: boolean;
    @ApiProperty()
    forwardSoftphone: boolean;
    @ApiProperty()
    logoUuid: string;
}

export class UserStatus {
    @ApiProperty()
    status: boolean;
}

// export class UserPatchByAdmin {
//     @ApiProperty()
//     status: boolean;
//     @ApiProperty()
//     company: string;
// }
