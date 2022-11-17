import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne, OneToOne, JoinColumn, UpdateDateColumn, CreateDateColumn} from "typeorm";
// import {Plan} from "./plan";
import {Account} from "./account.entity";
import {ApiProperty} from '@nestjs/swagger';

import {IsEmail} from "class-validator";
import { Payment } from "./payment.entity";
import { Did } from "./did.entity";
// import { AccountBlacklist } from "./account_blacklist.entity";

export enum UserTypes {
    USER = "user",
    NOTIFICATION = "notification",
  }

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({name: "user_id"})
    id: number;

    @ApiProperty()
    @Column({name: "user_first_name", nullable: true})
    firstName?: string;

    @Column({name: "user_last_name", nullable: true})
    @ApiProperty()
    lastName?: string;

    @Column({name: "image_link", nullable: true})
    @ApiProperty()
    link?: string;

    @Column({name: "two_fa" , nullable: true})
    @ApiProperty()
    twoFA?: boolean;

    @Column("enum", { enum: UserTypes, default:UserTypes.NOTIFICATION })
    type: UserTypes;

    @IsEmail()
    @Column({name: "user_email"})
    @ApiProperty()
    email: string;

    @Column({ name: "sip_username", nullable: true })
    sipUsername?: string;


    @Column({name: "user_password", nullable: true})
    password?: string;

    @Column({name: "user_salt", nullable: true})
    salt?: string;

    @Column({name: "user_avatar", nullable: true})
    @ApiProperty()
    avatar?: string;

    @Column({type:'uuid', name: "user_uuid"})
    @ApiProperty()
    uuid?: string;

    @Column({name: "user_activation_hash" , nullable: true})
    activationHash?: string;

    @CreateDateColumn({name: "user_creation", type: "timestamp"})
    @ApiProperty()
    creation?: Date;

    @Column({name: "user_activation_expire", type: "date", nullable: true})
    @ApiProperty()
    activationExpire?: Date;

    @UpdateDateColumn({name: "user_updated", type: "timestamp"})
    @ApiProperty()
    updated?: Date;

    @Column({name: "email_confirmed", default:false})
    @ApiProperty()
    emailConfirmed?: boolean;

    @Column({name: "user_active", default: false})
    @ApiProperty()
    active?: boolean;

    @Column({name: "user_last_login", nullable: true})
    @ApiProperty()
    userLastLogin?: Date;

    // @Column({name: "plan_id", nullable: true})
    // @ApiProperty()
    // planID?: number;

    @Column({name: "user_plain_text"})
    @ApiProperty()
    plaintText?: boolean;

    @Column({name: "is_admin", default:false})
    @ApiProperty()
    isAdmin?: boolean;

    @Column({name: "user_identity_opentact"})
    @ApiProperty()
    userIdentityOpenTact?: boolean;

    @Column({name: "user_invoice_email"})
    @ApiProperty()
    invoiceEmail?: boolean;

/*     @Column({ name: "account_id" })
    @ApiProperty()
    accountID: number; */

    @Column({name: "user_machine_detection", nullable: true})
    @ApiProperty()
    machineDetection?: boolean;

    @Column({name: "user_forward_softphone", nullable: true})
    forwardSoftphone?: boolean;

    @OneToMany(() => Payment, payments => payments.user)
    payments?: Payment[];

    /* @ApiProperty({ type: () => Account })
    @ManyToOne(() => Account,{ onDelete: 'CASCADE' })
    @JoinColumn({name: 'account_id'})
    account?: Account; */

    @OneToMany(() => Did, did => did.user)
    did?: Did[];

    // @OneToMany(() => AccountBlacklist, blacklists => blacklists.user)
    // blacklists?: AccountBlacklist[];

    @ApiProperty({description: "TOKEN JWT"})
    token?: string;
    rePassword?: string;
    numbers?: any;

    static withId(id: number): User {
        let us = new User();
        us.id = id;
        return us;
    }
}
