import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('payment_settings')
export class PaymentSettings {
    @ApiProperty()
    @PrimaryGeneratedColumn({ name: 'pay_set_id' })
    id: number;

    @ApiProperty()
    @Column({ name: 'stripe_skey', nullable: true })
    stripeSkey: string;

    @ApiProperty()
    @Column({ name: 'stripe_pkey', nullable: true })
    stripePkey: string;

    @ApiProperty()
    @Column({ name: 'paypal_client_id', nullable: true })
    paypalClient: string;

    @ApiProperty()
    @Column({ name: 'charge_type', nullable: true })
    chargeType: string;

    @ApiProperty()
    @Column({ name: 'paypal_test_mode', default: true })
    paypalTestMode: boolean;

    @ApiProperty()
    @Column({ name: 'payment_confirm', default: true })
    paymentConfirm: boolean;

    @ApiProperty()
    @Column({ name: 'email_note', default: false })
    emailNote: boolean;

    @ApiProperty()
    @Column({ name: 'email_confirm_to', nullable: true })
    emailConfirmTo: string;

    @ApiProperty()
    @Column({ name: 'email_cc_to', nullable: true })
    emailCcTo: string;

    @ApiProperty()
    @Column({ name: 'status', default: true })
    status: boolean;
}