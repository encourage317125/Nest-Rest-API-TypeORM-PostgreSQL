import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sms_table_list')
export class SmsTableList {
    @ApiProperty()
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ApiProperty()
    @Column({ name: 'table_name' })
    tableName: string;

    @ApiProperty()
    @Column({ name: 'created_at' })
    created: Date;
}