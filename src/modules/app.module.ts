'use strict';

import {Module} from '@nestjs/common';
import {RestModule} from './restful';
import {AuthModule} from './auth';
import {DBFactoryModule} from './db';
import {FacadeModule} from './facade';
import {EmailModule} from './email';
import {CronScheduleModule} from './cron_schedule';
// import{PaymentsService} from './payments'
import { PaymentsRepository } from './db/repositories/payments.repository'
import { Payment } from '../models';
import { TypeOrmModule } from '@nestjs/typeorm';

//import { ScheduleModule } from 'nest-schedule'
// import { PaymentsController } from './restful/payments.controller';
import { WSGateway } from './websocket/sms.gateway';
import { Repositories} from './db/repositories';
import { AppGateway } from './websocket/app.geteway';
import { BullModule } from '@nestjs/bull';
import { OpentactModule } from './opentact';
import { GoogleModule } from './google';
import { FacebookModule } from './facebook';


@Module({
    // controllers: [PaymentsController],
    //components: [],
    //modules: [
    imports: [
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            }
        }),
        RestModule,
        AuthModule,
        // PaymentsModule,
        DBFactoryModule,
        // DBFactoryModule(),
        // TypeOrmModule.forFeature([Payment]),
        FacadeModule,
        EmailModule,
        GoogleModule,
        FacebookModule,
        CronScheduleModule,
        //ScheduleModule.register({}),
        OpentactModule,
    ],
    providers:[WSGateway, Repositories, AppGateway],
    //providers: [
    //    CronScheduleModule,
    //],
    exports: []
})
export class ApplicationModule {
}
