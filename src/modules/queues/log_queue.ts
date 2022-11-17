import { Process, Processor } from "@nestjs/bull";
import { Job } from 'bull';
import { EntityManager } from "typeorm";
import axios from 'axios';

@Processor('log')
export class LogConsumer {
    constructor(private entityManager: EntityManager) {}
    
    @Process()
    async transcode(job: Job<unknown>) {
        let data = job.data;

        if (data.type === 'call_state') {
            if (data.payload.direction === 'in') await this.storeOrEditInboundCallLog(data);
        }

        if (data.type === 'sms') {
            await this.storeOrEditSms(data);
        }

        return {};
    }

    async storeOrEditInboundCallLog(data: any) {
        let log_exists = await this.entityManager.query(`SELECT * FROM "public"."${data.table_name}" WHERE call_uuid='${data.payload.uuid}'`);
        let query: string;

        if(log_exists.length) {
            let update_fields:any = [];
            
            query = `UPDATE "public"."${data.table_name}" SET `;

            if(data.payload.finished_on) {
                update_fields.push(`end_time='${data.payload.finished_on}'::timestamp`);
            }
            if(data.payload.duration) {
                update_fields.push(`call_duration=${data.payload.duration}`);
            }

            query += update_fields.join(',') + ` WHERE call_uuid='${data.payload.uuid}' AND call_duration IS NULL`;
        } else {
            let caller_data = (await axios.get(`https://lerg.denovolab.com/number/${data.payload.from}`)).data;
            let insert_fields:any = [];
            let insert_values:any = [];
            
            query = `INSERT INTO "public"."${data.table_name}"(`;

            // Call Data
            if(data.payload.caller_id) {
                // Nothing for this option
            }
            if(data.payload.from) {
                insert_fields.push(`caller_number`);
                insert_values.push(data.payload.from);
            }
            if(data.payload.to) {
                insert_fields.push(`dest_number`);
                insert_values.push(data.payload.to);
            }
            if(data.payload.created_on) {
                insert_fields.push(`start_time`);
                insert_values.push(data.payload.created_on);
            }
            if(data.payload.finished_on) {
                insert_fields.push(`end_time`);
                insert_values.push(data.payload.finished_on);
            }
            if(data.payload.duration) {
                insert_fields.push(`call_duration`);
                insert_values.push(data.payload.duration);
            }
            if(data.payload.has_voicemail) {
                // Nothing for this option
            }
            if(data.payload.has_recording) {
                // Nothing for this option
            }
            if(data.payload.recording_url) {
                // Nothing for this option
            }
            if(data.payload.transcribed_text) {
                // Nothing for this option
            }
            if(data.payload.tags) {
                // Nothing for this option
            }
            if(data.payload.score) {
                // Nothing for this option
            }
            if(data.payload.uuid) {
                insert_fields.push(`call_uuid`);
                insert_values.push(data.payload.uuid);
            }
            if(data.payload.acco_id) {
                // Nothing for this option
            }

            // Caller Data
            if(caller_data.country) {
                insert_fields.push(`caller_country`);
                insert_values.push(caller_data.country);
            }
            if(caller_data.state) {
                insert_fields.push(`caller_state`);
                insert_values.push(caller_data.state);
            }
            if(caller_data.rate_center) {
                insert_fields.push(`caller_city`);
                insert_values.push(caller_data.rate_center);
            }

            query += insert_fields.join(',') + `) values('` + insert_values.join(`','`) + `') returning *`;
        }

        return await this.entityManager.query(query);
    }

    async storeOrEditSms(data: any) {
        let sender_data = (await axios.get(`https://lerg.denovolab.com/number/${data.payload.from}`)).data;

        let query = this.getSmsQuery(data, sender_data);

        return await this.entityManager.query(query);
    }

    getSmsQuery(data, sender_data) {
        let insert_fields: any = [];
        let insert_values: any = [];
        
        // Sms Data
        if(data.payload.from) {
            insert_fields.push(`sender_number`);
            insert_values.push(data.payload.type === 'smsr' ? data.payload.tn.tn : data.payload.from);
        }
        if(data.payload.to) {
            insert_fields.push(`dest_number`);
            insert_values.push(data.payload.to);
        }
        if(data.payload.uuid) {
            insert_fields.push(`sms_uuid`);
            insert_values.push(data.payload.uuid);
        }
        if(data.payload.created_on) {
            insert_fields.push(`created_at`);
            insert_values.push(data.payload.created_on);
        }
        if(data.success) {
            insert_fields.push(`success`);
            insert_values.push(data.success);
        }
        if(data.payload.thread) {
            insert_fields.push(`thread`);
            insert_values.push(data.payload.thread);
        }
        if(data.payload.type) {
            insert_fields.push(`type`);
            insert_values.push(data.payload.type);
        }
        if(data.payload.message) {
            insert_fields.push(`message`);
            insert_values.push(data.payload.message);
        }

        // Sender Data
        if(sender_data.country) {
            insert_fields.push(`sender_country`);
            insert_values.push(sender_data.country);
        }
        if(sender_data.state) {
            insert_fields.push(`sender_state`);
            insert_values.push(sender_data.state);
        }
        if(sender_data.rate_center) {
            insert_fields.push(`sender_city`);
            insert_values.push(sender_data.rate_center);
        }

        return `INSERT INTO "public"."${data.table_name}"(${insert_fields.join(',')}) values('${insert_values.join(`','`)}') returning *`;
    }
}