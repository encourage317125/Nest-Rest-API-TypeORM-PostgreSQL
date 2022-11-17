import { Module } from '@nestjs/common';
import { ScheduleModule } from 'nest-schedule';

import { CronJobs } from './cron_jobs';

@Module({
    imports: [
        ScheduleModule.register(),
    ],
    //components: [InvoiceGeneration],
    providers: [CronJobs]
})
export class CronScheduleModule {
}

