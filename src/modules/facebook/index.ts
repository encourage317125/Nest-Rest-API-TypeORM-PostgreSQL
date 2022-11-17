import { FacebookService } from './facebook.service';
import { Module } from '@nestjs/common';

@Module({
    //components: [GoogleService],
    providers: [FacebookService],
    exports: [FacebookService]
})
export class FacebookModule { }

export { FacebookService } from './facebook.service';