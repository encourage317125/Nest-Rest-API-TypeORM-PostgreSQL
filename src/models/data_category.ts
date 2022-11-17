import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class DataCategory {
    @PrimaryGeneratedColumn({ name: "daca_id" })
    id: number;
    @Column({ name: "daca_name" })
    name: string;
    @Column({ name: "daca_status" })
    status: boolean;

    @Column("jsonb", { name: "daca_json", nullable: true})
    metadata?: any;

    static withId(id: number) {
        let dc = new DataCategory();
        dc.id = id;
        return dc;
    }
}