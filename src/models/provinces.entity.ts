import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, JoinColumn } from "typeorm";
import { Country } from "./countries.entity";



export interface IProvinceCreateProps {
    countryUuid: string;
    shortName: string;
    fullName: string;
}


export interface IProvince extends IProvinceCreateProps {
    provinceUuid: string;
    updated_on: Date;
    created_on: Date;
}
@Entity("provinces")
export class Province implements IProvinceCreateProps {

    @PrimaryGeneratedColumn("uuid", { name: "province_uuid" })
    provinceUuid: string;

    @Column({ name: "country_uuid" })
    countryUuid: string;

    @Column({ name: "short_name" })
    shortName: string;

    @Column({ name: "full_name" })
    fullName: string;

    @UpdateDateColumn({ name: "updated_on", type: "timestamp" })
    updated_on: Date;

    @CreateDateColumn({ type: "timestamp" })
    created_on: Date;

    @ManyToOne(() => Country, country => country.provinces)
    @JoinColumn({ name: "country_uuid" })
    country: Country;

}