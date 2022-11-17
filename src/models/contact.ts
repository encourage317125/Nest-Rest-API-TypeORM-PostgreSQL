import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { User } from "./user.entity";
import { Account } from "./account.entity";

@Entity()
@Entity("contacts")
export class Contact {
    @PrimaryGeneratedColumn({ name: "cont_id" })
    id: number;

    @ApiProperty()
    @Column({ name: "cont_phone_number" })
    phoneNumber: string;

    @Column({ name: "cont_first_name" })
    @ApiProperty()
    firstName: string;

    @Column({ name: "cont_last_name" })
    @ApiProperty()
    lastName: string;

    @Column({ name: "cont_created_on" })
    @ApiProperty()
    createdOn?: Date;

    @Column({ name: "cont_last_modified" })
    @ApiProperty()
    lastModified?: Date;

    @Column({name: "cont_active"})
    @ApiProperty()
    active: boolean;

    @ApiProperty({ description: "USER" })
    @ManyToOne(type => User)
    @JoinColumn({ name: "modified_by" })
    modifiedBy: User;

    @ApiProperty({ description: "ACCOUNT" })
    @ManyToOne(type => Account)
    @JoinColumn({ name: "account_id" })
    account: Account;


    static withId(id: number): Contact {
        let cont = new Contact();
        cont.id = id;
        return cont;
    }
}
