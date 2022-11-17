import {Entity, PrimaryGeneratedColumn, JoinColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne} from "typeorm";
import { User } from "./user.entity";


@Entity("tokens")
export class Token {
   
    @PrimaryGeneratedColumn("uuid")
    token_uuid?: string;

    // @Column({ name: "account_id" })
    // accountID: number;

    // @Column({ name: "user_id", nullable: true })
    // userID: number;

    @Column({nullable: true })
    ha1: string;

    @Column( {nullable: true })
    ha1b: string;

    @UpdateDateColumn({type: "timestamp"})
    updated_on?: Date;

    @CreateDateColumn({type: "timestamp"})
    created_on?: Date;

    // @OneToOne(() => Account,{ onDelete: 'CASCADE' })
    // @JoinColumn({name: 'account_id'})
    // account?: Account;

    @OneToOne(() => User,{ onDelete: 'CASCADE' })
    @JoinColumn({name: 'user_id'})
    user?: User;

}