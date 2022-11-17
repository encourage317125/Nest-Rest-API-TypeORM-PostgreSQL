import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Data } from "./data"
//import { AppRoom } from "./app_room"
import { Did } from './did.entity'
import { ApiProperty } from '@nestjs/swagger';


@Entity("sms_webhook_storage")
export class SmsWebhookStorage {

    @PrimaryGeneratedColumn({ name: "sms_wh_id" })
    id: number;

    @ApiProperty()
    @Column({ name: "sms_wh_did_id" })
    didId: number;

    //@ApiProperty()
    //@Column({ name: "sms_wh_app_id" })
    //appId: number;

    @ApiProperty()
    @Column({ name: "sms_wh_reference_id" })
    referenceId: string;

    @ApiProperty()
    @Column({ name: "sms_wh_from" })
    from: string;

    @ApiProperty()
    @Column({ name: "sms_wh_to" })
    to: string;

    @ApiProperty()
    @Column({ name: "sms_wh_text" })
    text: string;

    @ApiProperty()
    @Column({ name: "sms_wh_delivery_receipt" })
    deliveryReceipt: boolean;

    @ApiProperty()
    @Column({ name: "sms_wh_time" })
    date: Date;

    @ApiProperty()
    @Column({ name: "sms_wh_outgoing" })
    outgoing: boolean;

    @OneToOne(type => Did)
    @JoinColumn({ name: "sms_wh_did_id" })
    did: Did;

    @ApiProperty()
    @Column({ name: "sms_wh_status" })
    status: string;

    @ApiProperty()
    @Column({ name: "sms_wh_error" })
    error: string;
}

