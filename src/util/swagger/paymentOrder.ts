import {ApiProperty} from '@nestjs/swagger';

export class PaymentOrder {
    @ApiProperty()
    orderId: string;
}
