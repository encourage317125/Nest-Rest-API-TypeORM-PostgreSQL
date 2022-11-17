import { Get, Param, Query, Req, Res } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AccountNumberFacade, LogFacade } from "../facade";

@Controller('log')
@ApiTags("Log")
@ApiBearerAuth()
export class LogController {
    constructor(
        private logFacade: LogFacade,
        private accountNumberFacade: AccountNumberFacade
    ) {}

    @Get('call/:direction')
    @ApiParam({ name: 'direction', description: 'Call direction, in or out', enum: ['in', 'out'] })
    @ApiQuery({ name: 'startDate', description: 'Start date to select sms from. YYYY/MM/DD format. not timestamp. Default 5 days ago date', required: false })
    @ApiQuery({ name: 'endDate', description: 'End date to select sms to. YYYY/MM/DD format. not timestamp. Default current date', required: false })
    @ApiQuery({ name: 'order_by', description: 'Order by', required: false, enum: ['start_date', 'end_date', 'duration'] })
    @ApiQuery({ name: 'order_type', description: 'Order type', required: false, enum: ['asc', 'desc'] })
    @ApiQuery({ name: 'call_uuid', description: 'Get log by call uuid', required: false })
    async getCallLogs(@Req() req, @Res() res: Response, 
        @Param('direction') direction: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('order_by') order_by: string = 'start_date',
        @Query('order_type') order_type: string = 'desc',
        @Query('call_uuid') call_uuid: string,
    ) {
        try {
            const log_data = {
                type: 'call_state',
                direction,
                order_by,
                order_type,
                call_uuid,
                table_list: await this.logFacade.getCallTableList(startDate, endDate)
            }

            if (req.user.role !== 'admin') {
                let user_numbers: string[] = await this.accountNumberFacade.getUserAccountTrackingNumbers(req.user.userId, req.user.accountId);
                log_data['numbers'] = user_numbers;
            }

            let logs = await this.logFacade.getCallLogs(log_data);

            return res.status(201).json({ success: true, payload: { items: logs, total: logs.length } });
        } catch (e) {
            console.log(e);
            return { message: e.message };
        }
    }

}