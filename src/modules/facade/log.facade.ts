import * as moment from "moment";
import { Injectable } from "@nestjs/common";
import { EntityManager, EntityRepository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from 'bull';
import { CallLogTableList } from "../../models";

@EntityRepository()
@Injectable()
export class LogFacade {
    constructor(
        private entityManager: EntityManager,
        @InjectQueue('log') private logQueue: Queue
    ) {}

    async addLog(data: any) {
        let table_name;

        // let blocked = (await this.entityManager.createQueryBuilder(AccountBlacklist, 'bl')
        //     .where('bl.number=:from', { from: data.payload.from }).getOne())?.status;

        // if (!blocked) {
            if (data.type === 'call_state') {
                table_name = `${data.payload.direction}bound_call_log_${moment().format('YYYY_MM_DD')}`;
            }
    
            if (data.type === 'sms') {
                if (data.payload.type === 'smsi' || data.payload.state === 'success') {
                    table_name = `sms_${moment().format('YYYY_MM_DD')}`;
                }
            }

            if (table_name) {
                const job = await this.logQueue.add({ ...data, table_name });
            }    
        // }
    }

    async getCallLogs(data: any) {
        let logs: any[] = [];
        let query_string_array: any[] = [];
        let by;
    
        if (data.order_by === 'start_date') by = 'start_time';
        else if (data.order_by === 'end_date') by = 'end_time';
        else if (data.order_by === 'duration') by = 'call_duration';

        if (data.direction === 'in') {
            for (let table_name of data.table_list) {
                let query_string: string = '';

                    query_string += `(SELECT * FROM "public"."${table_name}" 
                        ${data.call_uuid ? `WHERE call_uuid='${data.call_uuid}'` : ''} 
                        ${data.numbers ? (`${data.call_uuid ? 'AND' : 'WHERE'} dest_number IN ('${data.numbers.join(`','`)}')`) : ''})`;

                query_string_array.push(query_string);
            }
    
            let query = query_string_array.join(' UNION ') + ((by && data.order_type) ? ` ORDER BY ${by} ${data.order_type === 'asc' ? 'ASC' : 'DESC'}` : '')
            logs = await this.entityManager.query(query);
        
        }

        return logs;
    }

    async getCallTableList(startDate, endDate) {
        let start = (startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : moment().subtract(5,'d').format('YYYY-MM-DD')) + ' 00:00:00';
        let end = (endDate ? moment(new Date(endDate)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')) + ' 23:59:59';

        let tables = await this.entityManager.createQueryBuilder(CallLogTableList, 'cltl')
            .where(`cltl.created_at BETWEEN '${start}'::timestamp AND '${end}'::timestamp`)
            .getMany();
        
        return tables.map(({tableName}) => tableName);
    }

}