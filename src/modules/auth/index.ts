'use strict';

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FacadeModule } from '../facade';
import { DBFactoryModule } from '../db';
import { OpentactModule } from '../opentact';
import { TokensRepository } from '../db/repositories/tokens.repository';
import { GoogleModule } from '../google';
import { FacebookModule } from '../facebook';

@Module({
    //components: [AuthService],
    providers: [AuthService ],
    //modules: [FacadeModule, OpentactModule],
    imports: [FacadeModule, OpentactModule, DBFactoryModule, GoogleModule, FacebookModule],
    exports: [AuthService]
})
export class AuthModule { }

export { AuthService } from './auth.service';
