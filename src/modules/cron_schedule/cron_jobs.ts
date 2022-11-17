import {Injectable} from '@nestjs/common';
import moment = require('moment');
import { Cron, Timeout, NestSchedule } from 'nest-schedule';
import { EntityManager } from 'typeorm';
import { CallLogTableList, SmsTableList } from '../../models';


@Injectable() // Only support SINGLETON scope
export class CronJobs extends NestSchedule {
    constructor(private entityManager: EntityManager) {
        super();
    }

    @Cron('15 * * * *', {
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    })
    async cronJob() {
        console.log('->>>>>>>>>>>>>>>>executing cron job', new Date());
    }

    @Cron('0 0 0 * * *')
    async cronJobEvent() {
        await this.createDailyTables();
    }

    @Timeout(1000)
    async onceJob() {
        await this.createDailyTables();
    }

    async tableExists(table_name) {
        let table_exists = await this.entityManager.query(`SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name   = '${table_name}'
        );`);

        return table_exists[0].exists;
    }

    async createDailyTables() {
        await this.createInboundCallLogTable();
        await this.createSmsTable();
    }

    async createInboundCallLogTable() {
        const inbound_table_name = `inbound_call_log_${moment().format('YYYY_MM_DD')}`;
        let table_exists = await this.tableExists(inbound_table_name);
    
        if (!table_exists) {
            await this.entityManager.query(`CREATE TABLE "${inbound_table_name}" 
                (
                    "caller_id" character varying, 
                    "caller_number" character varying, 
                    "caller_country" character varying, 
                    "caller_state" character varying, 
                    "caller_city" character varying, 
                    "dest_number" character varying, 
                    "start_time" TIMESTAMP, 
                    "end_time" TIMESTAMP, 
                    "ring_time" TIMESTAMP, 
                    "answer_time" TIMESTAMP, 
                    "call_duration" real, 
                    "has_voicemail" boolean NOT NULL DEFAULT false, 
                    "has_recording" boolean NOT NULL DEFAULT false, 
                    "recording_url" character varying, 
                    "transcribed_text" character varying, 
                    "tags" character varying array, 
                    "score" integer, 
                    "call_uuid" character varying NOT NULL, 
                    "acco_id" integer
                );`);

            await this.entityManager.createQueryBuilder()
                .insert()
                .into(CallLogTableList)
                .values({
                    tableName: inbound_table_name,
                    created: new Date()
                })
                .execute();
        }
    }

    async createSmsTable() {
        const table_name = `sms_${moment().format('YYYY_MM_DD')}`;
        let table_exists = await this.tableExists(table_name);

        if (!table_exists) {
            await this.entityManager.query(`CREATE TABLE "${table_name}" 
                ${this.getSmsSchema()};`);

            await this.entityManager.createQueryBuilder()
                .insert()
                .into(SmsTableList)
                .values({
                    tableName: table_name,
                    created: new Date()
                })
                .execute();
        }
    }

    getSmsSchema() {
        return `(
            "created_at" TIMESTAMP, 
            "message" character varying, 
            "sender_number" character varying NOT NULL, 
            "sender_country" character varying, 
            "sender_state" character varying, 
            "sender_city" character varying, 
            "dest_number" character varying, 
            "sms_uuid" character varying NOT NULL, 
            "type" character varying NOT NULL,
            "thread" character varying NOT NULL,
            "is_read" boolean NOT NULL DEFAULT false,
            "success" boolean NOT NULL DEFAULT false
        )`;
    }
}