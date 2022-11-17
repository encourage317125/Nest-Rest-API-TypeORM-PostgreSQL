import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { LogConsumer } from "./log_queue";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'log',
        })
    ],
    providers: [LogConsumer]
})
export class QueueModule {}

export { LogConsumer } from "./log_queue";