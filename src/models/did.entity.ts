import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { Account } from "./account.entity";
import { User } from "./user.entity";

@Entity()
export class Did {
    @PrimaryGeneratedColumn({ name: "did_id" })
    id: number;
    @Column({ name: "did_number" })
    number: string;
    @Column({ name: "number_name", nullable: true })
    numberName: string;
    @Column({ name: "did_status", default: false })
    status: boolean;
    @Column({ name: "did_opentact_id", nullable: true })
    didOpentactID?: string;
    @Column({ name: "acco_id" })
    accountID: number;
    @Column({ name: "user_id" })
    userID: number;
    @Column({ name: "did_opentact_identity_id", nullable: true })
    didOpentactIdentityID?: number;

    @UpdateDateColumn({ name: "updated_on", type: "timestamp" })
    updatedOn?: Date;
  
    @CreateDateColumn({ name: "created_on", type: "timestamp"  })
    createdOn?: Date;

    @Column({ name: "expire_on", type: "timestamp", nullable: true })
    expireOn?: Date;

    @ApiProperty({ type: () => Account })
    @ManyToOne(() => Account, account => account.did)
    @JoinColumn({ name: "acco_id" })
    account: Account;

    @Column({ name: "cf_id" , nullable: true})
    cfId: number;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, user => user.did)
    @JoinColumn({ name: "user_id" })
    user: User;

    static withId(id: number): Did {
        let did = new Did();
        did.id = id;
        return did;
    }
}