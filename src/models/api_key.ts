import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
// import {Plan} from "./plan";
import {ApiProperty} from '@nestjs/swagger';
import {User} from './user.entity'

@Entity()
export class ApiKey {
    @PrimaryGeneratedColumn({name: "ak_id"})
    id: number;

    @Column({name: "ak_created_on"})
    @ApiProperty()
    createdOn?: Date;

    @ApiProperty()
    @Column({name: "ak_api_key"})
    apiKey: string;

    @Column({name: "ak_expired_on"})
    @ApiProperty()
    expiredOn?: Date;

    @OneToOne(type => User)
    @JoinColumn({ name: "user_id" })
    user?: User;

    static withId(id: number): ApiKey {
        let api_key = new ApiKey();
        api_key.id = id;
        return api_key;
    }
}
