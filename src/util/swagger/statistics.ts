import {ApiProperty} from '@nestjs/swagger';

export class StatisticsGetSmsStat {
    @ApiProperty()
    source: string;
    @ApiProperty()
    totalConversation: string;
    @ApiProperty()
    totalSms: string;
    @ApiProperty()
    firstTimeSmsCount: string;
}

export class PostStatBody {
    @ApiProperty()
    startTime: string;
    @ApiProperty()
    endTime: string;
}
