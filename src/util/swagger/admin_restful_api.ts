import {ApiProperty} from '@nestjs/swagger';

export class AdminUserActivation {
    @ApiProperty()
    userUuid: string;
    @ApiProperty()
    status: boolean;
}

export class ActivationResend {
    @ApiProperty()
    userUuid: string;
}

export class PaymentSettingsRequest {
    @ApiProperty()
    stripeSkey: string;

    @ApiProperty()
    stripePkey: string;

    @ApiProperty()
    paypalClient: string;

    @ApiProperty()
    chargeType: string;

    @ApiProperty()
    paypalTestMode: boolean;

    @ApiProperty()
    paymentConfirm: boolean;

    @ApiProperty()
    emailNote: boolean;

    @ApiProperty()
    emailConfirmTo: string;

    @ApiProperty()
    emailCcTo: string;
}