import {Module} from '@nestjs/common';

import {AccountNumberFacade} from './accountnumber.facade';
import {UserFacade} from './user.facade';
import {AccountFacade} from './account.facade';
// import {BlackListFacade} from './blacklist.facade';
import {DidFacade} from './did.facade';
import {DBFactoryModule} from '../db';
import {EmailModule} from '../email';
import {DataFacade} from './data.facade';
import {RecordingFacade} from './recording.facade';
import {ContactFacade} from './contact.facade';
import {InvoiceFacade} from './invoice.facade';
import {SmsFacade} from './sms.facade';
import {CallerDetailsFacade} from './caller_details.facade';
import { Repositories} from '../db/repositories';
import { LogFacade } from './log.facade';
import { LogConsumer } from '../queues';
import { BullModule } from '@nestjs/bull';
import { OpentactModule } from '../opentact';

const FACADES = [UserFacade,
    AccountFacade, DidFacade, AccountNumberFacade, DataFacade, RecordingFacade, ContactFacade,
    InvoiceFacade, SmsFacade, CallerDetailsFacade, LogFacade, LogConsumer, //BlackListFacade
];

@Module({
    //components: [...FACADES],
    providers: [...FACADES, Repositories],
    exports: [...FACADES],
    imports: [
        DBFactoryModule, 
        EmailModule, 
        OpentactModule, 
        BullModule.registerQueue({
            name: 'log',
        })
    ]
})
export class FacadeModule {
}

export {UserFacade} from './user.facade';
export {AccountFacade} from './account.facade';
export {AccountNumberFacade} from './accountnumber.facade';
// export {BlackListFacade} from './blacklist.facade';
export {DidFacade} from './did.facade';
export {DataFacade} from './data.facade';
export {RecordingFacade} from './recording.facade';
export {ContactFacade} from './contact.facade';
export {InvoiceFacade} from './invoice.facade';
export {SmsFacade} from './sms.facade';
export {CallerDetailsFacade} from './caller_details.facade';
export {LogFacade} from './log.facade';
export {LogConsumer} from '../queues';