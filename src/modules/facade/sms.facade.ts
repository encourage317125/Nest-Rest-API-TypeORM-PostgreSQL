import { SmsWebhookStorage } from "../../models";
import { Injectable } from '@nestjs/common';
import { DidFacade } from './did.facade';
import { EntityRepository, EntityManager } from "typeorm";
import moment = require("moment");

@EntityRepository()
@Injectable()
export class SmsFacade {

    constructor(
        private entityManager: EntityManager,
        private didFacade: DidFacade
    ) { }

    // async create(currentUser, from: string, to: string, msg: string) {
    //     return await this.opentactService_old.sendSms(currentUser.opentactToken, from, to, msg);
    // }

    async webhook(referenceId: string, from: string, to: string, text: string, deliveryReceipt: boolean = false, isOutgoing: boolean = false, status: string, error: string, id?: number) {
        let manager = await this.entityManager;
        // let outgoing = /^id:.*sub:.*dlvrd:.*submit date:.*done date:.*stat.*err:/.test(text);
        let outgoing = isOutgoing;
        let numbers = outgoing ? [from] : [to];
        let didH =  await this.didFacade.findByNumbers(numbers);
        if (didH.length) {
            for (let didHItem of didH) {
                let query = manager.createQueryBuilder(SmsWebhookStorage, "sms_webhook_storage");
                let reqParams = {
                    didId: didHItem.id,
                    //appId: appHItem.app_id,
                    referenceId: referenceId,
                    from: outgoing? didHItem.number: from,
                    to: !outgoing? didHItem.number: to,
                    text: text,
                    deliveryReceipt: deliveryReceipt,
                    date: new Date(),
                    outgoing: outgoing,
                    status: status,
                    error: error
                };
                if (!id)
                    return query.insert().values(reqParams).returning('*').execute();
                else
                    return this.entityManager.createQueryBuilder()
                        .update(SmsWebhookStorage)
                        .set({
                            status: status,
                            error: error,
                            referenceId: referenceId,
                            date: new Date()
                        })
                        .where('id=:id', { id: id })
                        .returning('*')
                        .execute();
            }
        }
    }

    async getUserSms(currentUser, offset: number, limit: number, isOutgoing?: any, startDate?: string, endDate?: string, number?: string) {
        let manager = await this.entityManager;
        let query = manager.createQueryBuilder(SmsWebhookStorage, "webhook_storage")
            //.join("data", "ec", " ec.data_id = cse.data_id")
            .innerJoin("webhook_storage.did", "did")
        query.where("did.user_id = :userId ", {userId:currentUser.userId});
        if (isOutgoing != null)
            query.andWhere("webhook_storage.outgoing = :isOutgoing ", {isOutgoing})
        if (startDate)
            query.andWhere("webhook_storage.date > :startDate", {startDate})
        if (endDate)
            query.andWhere("webhook_storage.date < DATE(:endDate) + interval '1 day'", {endDate})
        else
            query.andWhere("webhook_storage.date < now()")
        if (number) {
            const likeNumber = `%${number}%`
            query.andWhere("(webhook_storage.sms_wh_from like :likeNumber or webhook_storage.sms_wh_to like :likeNumber)", {likeNumber})
        }
        return query.offset(offset)
            .limit(limit)
            .orderBy('webhook_storage.date', 'DESC')
            .getManyAndCount();
    }

    async getSms(data: any) {
        let sms: any[] = [];
        let query_string_array: any[] = [];
        let by;
        let owner: string = '';

        if (data.numbers) {
            if (data.direction === 'every' || data.direction === 'in') {
                owner += `dest_number IN ('${data.numbers.join(`','`)}')`
            }

            if (data.direction === 'every') owner += ' OR '

            if (data.direction === 'every' || data.direction === 'out') {
                owner += `sender_number IN ('${data.numbers.join(`','`)}')`
            }
        }
        
        if (data.order_by === 'date') by = 'created_at';

        for (let table_name of data.table_list) {
            let query_string: string = '';

            query_string += `(SELECT * FROM "${table_name}" WHERE success=true 
                ${data.direction === 'every' ? '' : `AND type='${data.type}'`} 
                ${data.is_read ? `AND is_read=${data.is_read}` :  ''} 
                ${data.sms_uuid ? `AND sms_uuid='${data.sms_uuid}'` :  ''} 
                ${data.text ? `AND LOWER(message) LIKE LOWER('%${data.text}%')` : ''} 
                ${data.sender_number ? `AND sender_number LIKE '%${data.sender_number}%'` : ''} 
                ${data.destination_number ? `AND dest_number='${data.destination_number}'` : ''} 
                ${data.numbers ? `AND (${owner})` : ''})`;
            
            query_string_array.push(query_string.trim());
        }

        let query = data.group ? `SELECT to_char(created_at, 'YYYY-MM-DD') AS date, count(sms) 
            FROM (${query_string_array.join(' UNION ')}) AS sms GROUP BY date`
            + ((data.order_by === 'date' && data.order_type) ? ` ORDER BY date ${data.order_type === 'asc' ? 'ASC' : 'DESC'}` : '')
            : `SELECT * FROM (${query_string_array.join(' UNION ')}) AS sms`
            + ((by && data.order_type) ? ` ORDER BY ${by} ${data.order_type === 'asc' ? 'ASC' : 'DESC'}` : '');

        sms = await this.entityManager.query(query);
        
        return sms;
    }

    async updateSmsReadStatus(data: any[], user_numbers: string[], read: boolean) {
        for (let messages of data) {
            let table_name = await this.getSmsTableList(messages.date, messages.date);

            await this.entityManager.query(`UPDATE "public"."${table_name[0]}" SET is_read = ${read} 
                WHERE sms_uuid IN ('${messages.uuids.join(`', '`)}')
                AND dest_number IN ('${user_numbers.join(`', '`)}')`);
        }

        return true;
    }
    
    async getSmsTableList(startDate: string, endDate: string, days: number = 0) {
        let start = (startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : moment().subtract(days,'d').format('YYYY-MM-DD')) + ' 00:00:00';
        let end = (endDate ? moment(new Date(endDate)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')) + ' 23:59:59';

        return (await this.entityManager.query(`
            SELECT ARRAY (
                SELECT table_name 
                FROM sms_table_list 
                WHERE created_at BETWEEN '${start}'::timestamp AND '${end}'::timestamp);`))[0].array;
    }

    async getConversation(data: any) {
        let sms: any[] = [];
        let query_string_array: any[] = [];
        let by: string = '';

        if (data.order_by === 'date') by = 'created_at';

        for (let table_name of data.table_list) {
            let query_string: string = '';

            query_string += `(SELECT * FROM "public"."${table_name}"
            WHERE 
                (sender_number LIKE '%${data.own_number}%' AND dest_number='${data.interlocutor_number}' AND type='smso') 
            OR 
                (sender_number LIKE '%${data.interlocutor_number}%' AND dest_number='${data.own_number}' AND type='smsi')
            )`;
            
            query_string_array.push(query_string);
        }

        let query = query_string_array.join(' UNION ')
            + ((by && data.order_type) ? ` ORDER BY ${by} ${data.order_type === 'asc' ? 'ASC' : 'DESC'}` : '');
        sms = await this.entityManager.query(query);
        
        return sms;
    }

    async getSmsQuatity(number, startDate, endDate) {
        let start, end;
        let in_query_string_array: any[] = [];
        let out_query_string_array: any[] = [];
        if (startDate) start = moment(new Date(startDate)).format('YYYY-MM-DD') + ' 00:00:00';
        if (endDate) end = moment(new Date(endDate)).format('YYYY-MM-DD') + ' 23:59:59';

        let tables = (await this.entityManager.query(`
            SELECT ARRAY (
                SELECT table_name 
                FROM sms_table_list 
                ${start || end ? `
                    WHERE ${start ? `stl.created_at >= '${start}'::timestamp` : ''}
                    ${start && end ? ' AND ' : ' ' } 
                    ${end ? `stl.created_at <= '${end}'::timestamp` : ''}
                ` : ''} 
            );`))[0].array;

        for (let table_name of tables) {
            let in_query_string: string = '';
            let out_query_string: string = '';

            in_query_string += `(SELECT * FROM "public"."${table_name}" WHERE success=true 
                AND dest_number='${number}')`;

            out_query_string += `(SELECT * FROM "public"."${table_name}" WHERE success=true 
                AND sender_number='${number}')`;
            
            in_query_string_array.push(in_query_string);
            out_query_string_array.push(out_query_string);
        }

        let in_query = in_query_string_array.join(' UNION ');
        let out_query = out_query_string_array.join(' UNION ');

        return { 
            sent_sms_count: (await this.entityManager.query(in_query)).length,
            received_sms_count: (await this.entityManager.query(out_query)).length
        };
    }
}