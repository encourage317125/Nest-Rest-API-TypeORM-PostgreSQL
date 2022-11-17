import { GoogleService } from './google.service';
import { Module } from '@nestjs/common';

@Module({
    //components: [GoogleService],
    providers: [GoogleService],
    exports: [GoogleService]
})
export class GoogleModule { }

export { GoogleService } from './google.service';