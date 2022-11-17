import {ApiProperty} from "@nestjs/swagger";

export class CreditCardPost {
    @ApiProperty()
    cardNumber: string;
    @ApiProperty()
    expirationMonth: string;
    @ApiProperty()
    expirationYear: string;
    @ApiProperty()
    cvv: number;
}

export class CreditCardDelete {
    @ApiProperty()
    id: number;
}
