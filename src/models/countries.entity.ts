import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Province } from "./provinces.entity";



export class ICountryCreateProps {
    shortName: string;
    fullName: string;
}


export class ICountry extends ICountryCreateProps {
    countryUuid?: string;
    created_on?: Date;
}
@Entity("countries")
export class Country implements ICountryCreateProps {

    @PrimaryGeneratedColumn("uuid",{name:"country_uuid"})
    countryUuid: string;

    @Column({name: "short_name"})
    shortName: string;

    @Column({name: "full_name"})
    fullName: string;

    @UpdateDateColumn({ name: "updated_on", type: "timestamp" })
    updated_on?: Date;

    @CreateDateColumn({ type: "timestamp" })
    created_on: Date;

    @OneToMany(() => Province, provinces => provinces.country)
    provinces: Province[];

}