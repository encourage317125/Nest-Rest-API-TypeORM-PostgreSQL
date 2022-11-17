import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn} from "typeorm";
import {ApiProperty, ApiHideProperty} from '@nestjs/swagger';
import {Payment} from './payment.entity'

@Entity()
export class Invoice {
    @ApiProperty()
    @PrimaryGeneratedColumn({name: "invo_id"})
    id: number;

    @CreateDateColumn({name: "invo_creation", type: 'date'})
    @ApiHideProperty()
    creation: Date;

    @ApiProperty()
    @Column({type: "float",name: "invo_amount" })
    amount: number;

    @Column({name: "invo_paid", default:false})
    paid: boolean;

    @Column({name: "paid_on", type: 'date'})
    paidOn?: Date;

    @OneToOne(() => Payment)
    @JoinColumn({ name: "pay_id" })
    payment?: Payment;

    static withId (id: number): Invoice {
        let ac = new Invoice();
        ac.id = id;
        return ac;
    }
}
