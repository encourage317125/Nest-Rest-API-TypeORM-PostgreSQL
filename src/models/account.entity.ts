import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
// import { AccountNumber } from "./account_number";
import { Did } from "./did.entity";
// import { AccountBlacklist } from "./account_blacklist.entity";

@Entity()
export class Account extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn({ name: "acco_id" })
    id: number;

    @ApiProperty()
    @Column({ name: "acco_name", nullable: true })
    name?: string;

    @ApiProperty()
    @Column({ name: "acco_number" })
    number: string;

    @ApiProperty()
    @Column({ name: "acco_tech_prefix", nullable: true })
    techPrefix?: string;

    @ApiProperty()
    @Column({ name: "acco_dnl_id", nullable: true  })
    dnlId?: string;

    @ApiProperty()
    @Column({ name: "plan_uuid", nullable: true })
    planUuid?: string;

    @Column({name: "plan_id", nullable: true})
    @ApiProperty()
    planID?: number;

    @CreateDateColumn({ name: "acco_creation", type: 'timestamp' })
    creation: Date;

    @UpdateDateColumn({name: "updated_on", type: "timestamp"})
    updatedOn?: Date;

    @Column({ name: "acco_status" })
    status: boolean;

    @ApiProperty()
    @Column({ name: "acco_allow_outbound" })
    allowOutbound: boolean;

    @Column("jsonb", { name: "acco_json", nullable: true  })
    metadata?: any;

    @OneToMany(() => Did, did => did.account)
    did?: Did[];

    // @OneToMany(() => AccountBlacklist, blacklists => blacklists.account)
    // blacklists?: AccountBlacklist[];

    static withId(id: number): Account {
        let ac = new Account();
        ac.id = id;
        return ac;
    }
}
