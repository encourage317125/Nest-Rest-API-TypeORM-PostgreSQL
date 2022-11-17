'use strict';

import { Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
//import { AccountController } from './account.controller';
// import {PlanControllerWithoutToken} from "./plan.without.token.controller";
// import { BlackListController } from './blacklist.controller';
import { DidController } from './did.controller';
import { Upload } from './upload';
import { PublicApi } from './public';
import { AuthModule } from '../auth';
import { FacadeModule } from '../facade';
import { EmailModule } from '../email';
import { TrackingNumberController } from './tracking.number.controller';
//import {MiddlewaresConsumer} from "@nestjs/common";
import { MiddlewareConsumer } from "@nestjs/common";
import { AuthMiddleware } from "../../filters/auth.middleware";
import { DeleteFileController } from "./delete";
import { UserController } from "./user.controller";
import { TypesController } from './types.controller';
// import { OpentactController } from './opentact.controller';
import { ContactController } from './contact.controller';
import { TtsController } from './tts.controller';
import { SmsController } from './sms.controller';
// import { PaymentsController } from './payments.controller'
import { DBFactoryModule } from '../db';
import { CommonService } from '../services/common.service';
import { PermissionsService } from '../services/permissions.service';
import { Repositories} from '../db/repositories';
import { LogController } from './log.controller';
import { OpentactModule } from '../opentact';


@Module({
    controllers: [AuthController,
        // OpentactController,
        //AccountController,
        TrackingNumberController,
        // PaymentsController,
        // BlackListController,
        Upload,
        DeleteFileController,
        DidController,
        // PlanControllerWithoutToken,
        PublicApi,
        UserController,
        TypesController,
        ContactController,
        TtsController,
        SmsController,
        LogController,
    ],
    //components: [],
    //modules: [AuthModule, FacadeModule, EmailModule, OpentactModule],
    imports: [AuthModule, FacadeModule, EmailModule, OpentactModule, DBFactoryModule],
    providers: [/*PaymentsService,*/ CommonService, PermissionsService, Repositories],
    exports: []
})
export class RestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(
            { path: '/**', method: RequestMethod.ALL },
        );
    }
}
