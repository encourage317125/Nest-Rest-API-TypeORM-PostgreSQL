import {Entity, PrimaryGeneratedColumn, Unique, ManyToOne, Column, JoinColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import { Account } from "./account.entity";
import { User } from "./user.entity";

@Entity()
export class AccountBlacklist {
    @ApiProperty()
    @PrimaryGeneratedColumn({name: 'acbl_id'})
    id: number;
    @ApiProperty()
    @Column({name: "acbl_uuid", nullable: true})
    uuid: string;
    @ApiProperty()
    @Column({name: "account_id"})
    accountId: number;
    @ApiProperty()
    @Column({name: "user_id", nullable: true})
    userId: number;
    @ApiProperty()
    @Column({name: "reason", nullable: true})
    reason: string;
    @ApiProperty()
    @Column({name: "number"})
    number: string;
    @ApiProperty()
    @Column({name: "status", nullable: true})
    status: boolean;
    @ApiProperty()
    @Column({name: "other_detail", nullable: true})
    otherDetail: string;

    // @ApiProperty({ type: () => Account })
    // @ManyToOne(() => Account, account => account.blacklists)
    // @JoinColumn({ name: "account_id" })
    // account: Account;

    // @ApiProperty({ type: () => User })
    // @ManyToOne(() => User, user => user.blacklists)
    // @JoinColumn({ name: "user_id" })
    // user: User;
}
