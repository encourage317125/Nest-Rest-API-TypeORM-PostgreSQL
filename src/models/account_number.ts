import {Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";

import {ApiProperty} from '@nestjs/swagger';
import {Did} from './did.entity';

@Entity("tracking_numbers")
export class AccountNumber {
    @PrimaryGeneratedColumn({name: "id"})
    @ApiProperty()
    id: number;
    @ApiProperty()
    @OneToOne(type => Did)
    @JoinColumn({ name: "did_id" })
    did?: Did;
    @ApiProperty()
    @Column({name: "user_id"})
    userID: number;
    @ApiProperty()
    @Column({name: "acco_id"})
    accountID: number;
    @ApiProperty()
    @Column({name: "plan_id"})
    planID: number;
    @ApiProperty()
    @Column({name: "record_calls"})
    recordCalls: string;
    @ApiProperty()
    @Column({name: "whisper_message"})
    whisperMessage: string;
    @ApiProperty()
    @Column({name: "reacord_calls_boolean"})
    recordCallsBoolean: boolean;
    @ApiProperty()
    @Column({name: "whisper_message_boolean"})
    whisperMessageBoolean: boolean;
    @ApiProperty()
    @Column({name: "number"})
    number: string;
    @ApiProperty()
    @Column({name: "visitor_for"})
    visitorFor: string;
    @ApiProperty()
    @Column({name: "visitor_from"})
    visitorFrom: string;
    @ApiProperty()
    @Column({name: "always_swap"})
    alwaysSwap: boolean;
    @ApiProperty()
    @Column({name: "direct"})
    direct: boolean;
    @ApiProperty()
    @Column({name: "lend_params"})
    lendParams: boolean;
    @ApiProperty()
    @Column({name: "land_page"})
    lendPage: boolean;
    @ApiProperty()
    @Column({name: "web_ref"})
    webRef: boolean;
    @ApiProperty()
    @Column({name: "search"})
    search: boolean;
    @ApiProperty()
    @Column({name: "pool_size"})
    poolSize: number;
    @ApiProperty()
    @Column({name: "destination_number"})
    destinationNumber: number;
    @ApiProperty()
    @Column({name: "pool_name"})
    poolName: string;
    @ApiProperty()
    @Column({name: "track_campaign"})
    trackCampaign: boolean;
    @ApiProperty()
    @Column({name: "track_each_visitor"})
    trackEachVisitor: boolean;
    @ApiProperty()
    @Column({name: "number_on_web_site"})
    numberOnWebSite: boolean;
    @ApiProperty()
    @Column({name: "number_online"})
    numberOnline: boolean;
    @ApiProperty()
    @Column({name: "status"})
    status: boolean;
    @ApiProperty()
    @Column({name: "register_date", type: "date"})
    @ApiProperty()
    registerDate?: Date;
    
    @ApiProperty()
    @Column({ name: "is_text_messaging" })
    isTextMessaging: boolean;

}
