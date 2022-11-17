import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";

import { DataCategory } from './data_category'
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Data {
    @PrimaryGeneratedColumn({ name: "data_id" })
    @ApiProperty()
    id: number;
    @Column({ name: "data_name" })
    @ApiProperty()
    name: string;
    @Column({ name: "data_slug" })
    slug: string;
    @Column({ name: "data_status" })
    status: boolean;

    @ManyToOne(type => DataCategory)
    @JoinColumn({ name: "daca_id" })
    category?: DataCategory;

    @Column("jsonb", { name: "data_json", nullable: true})
    metadata?: any;

    static withId(id: number) {
        let data = new Data();
        data.id = id;
        return data;
    }
}