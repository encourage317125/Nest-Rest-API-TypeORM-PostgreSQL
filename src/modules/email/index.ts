import { EmailService } from './email_service';
import { Module } from '@nestjs/common';

@Module({
    //components: [EmailService],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }

export { EmailService } from './email_service';
