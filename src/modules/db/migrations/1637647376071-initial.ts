import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1637647376071 implements MigrationInterface {
    name = 'initial1637647376071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
        await queryRunner.query(`CREATE TABLE "account_blacklist" ("acbl_id" SERIAL NOT NULL, "acbl_uuid" character varying, "account_id" integer NOT NULL, "user_id" integer, "reason" character varying, "number" character varying NOT NULL, "status" boolean, "other_detail" character varying, CONSTRAINT "PK_ef00b0cdb81b9ace995149d14d2" PRIMARY KEY ("acbl_id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("acco_id" SERIAL NOT NULL, "acco_name" character varying, "acco_number" character varying NOT NULL, "acco_tech_prefix" character varying, "acco_dnl_id" character varying, "plan_uuid" character varying, "plan_id" integer, "acco_creation" TIMESTAMP NOT NULL DEFAULT now(), "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "acco_status" boolean NOT NULL, "acco_allow_outbound" boolean NOT NULL, "acco_json" jsonb, CONSTRAINT "PK_d7939f94333cb0f851a095039c0" PRIMARY KEY ("acco_id"))`);
        await queryRunner.query(`CREATE TABLE "invoice" ("invo_id" SERIAL NOT NULL, "invo_creation" date NOT NULL DEFAULT now(), "invo_amount" double precision NOT NULL, "invo_paid" boolean NOT NULL DEFAULT false, "paid_on" date NOT NULL, "pay_id" integer, CONSTRAINT "REL_1f876145f98b549399feaa9476" UNIQUE ("pay_id"), CONSTRAINT "PK_cd92ddc71abb8deeaa34c5b8e05" PRIMARY KEY ("invo_id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("pay_id" SERIAL NOT NULL, "pay_amount" double precision NOT NULL, "pay_with" character varying NOT NULL, "transaction_id" character varying NOT NULL, "success" boolean NOT NULL DEFAULT false, "pay_on" TIMESTAMP NOT NULL DEFAULT now(), "invo_id" integer, "user_id" integer NOT NULL, "account_id" integer, "current_balance" integer, "gateway" character varying, "transition" character varying, "numbers" text array, "updated_on" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_e3bbc67f252b11b95c270f50c6" UNIQUE ("invo_id"), CONSTRAINT "PK_0d524fddf1c394b2b1d382b4cde" PRIMARY KEY ("pay_id"))`);
        await queryRunner.query(`CREATE TYPE "user_type_enum" AS ENUM('user', 'notification')`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "user_first_name" character varying NOT NULL, "user_last_name" character varying NOT NULL, "image_link" character varying, "two_fa" boolean, "type" "user_type_enum" NOT NULL DEFAULT 'notification', "user_email" character varying NOT NULL, "sip_username" character varying, "user_password" character varying NOT NULL, "user_salt" character varying NOT NULL, "user_avatar" character varying, "user_uuid" uuid NOT NULL, "user_activation_hash" character varying, "user_creation" TIMESTAMP NOT NULL DEFAULT now(), "user_activation_expire" date, "user_updated" TIMESTAMP NOT NULL DEFAULT now(), "email_confirmed" boolean NOT NULL DEFAULT false, "user_active" boolean NOT NULL DEFAULT false, "user_last_login" TIMESTAMP, "user_plain_text" boolean NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "user_identity_opentact" boolean NOT NULL, "user_invoice_email" boolean NOT NULL, "account_id" integer NOT NULL, "user_machine_detection" boolean, "user_forward_softphone" boolean, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "did" ("did_id" SERIAL NOT NULL, "did_number" character varying NOT NULL, "number_name" character varying, "did_status" boolean NOT NULL DEFAULT false, "did_opentact_id" character varying, "acco_id" integer NOT NULL, "user_id" integer NOT NULL, "did_opentact_identity_id" integer, "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "created_on" TIMESTAMP NOT NULL DEFAULT now(), "expire_on" TIMESTAMP, "cf_id" integer, CONSTRAINT "PK_7a297360fece5c8df5e1c2a0e03" PRIMARY KEY ("did_id"))`);
        await queryRunner.query(`CREATE TABLE "tracking_numbers" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "acco_id" integer NOT NULL, "plan_id" integer NOT NULL, "record_calls" character varying NOT NULL, "whisper_message" character varying NOT NULL, "reacord_calls_boolean" boolean NOT NULL, "whisper_message_boolean" boolean NOT NULL, "number" character varying NOT NULL, "visitor_for" character varying NOT NULL, "visitor_from" character varying NOT NULL, "always_swap" boolean NOT NULL, "direct" boolean NOT NULL, "lend_params" boolean NOT NULL, "land_page" boolean NOT NULL, "web_ref" boolean NOT NULL, "search" boolean NOT NULL, "pool_size" integer NOT NULL, "destination_number" integer NOT NULL, "pool_name" character varying NOT NULL, "track_campaign" boolean NOT NULL, "track_each_visitor" boolean NOT NULL, "number_on_web_site" boolean NOT NULL, "number_online" boolean NOT NULL, "status" boolean NOT NULL, "register_date" date NOT NULL, "is_text_messaging" boolean NOT NULL, "did_id" integer, CONSTRAINT "REL_83623f6ca11ae14e3a36e029df" UNIQUE ("did_id"), CONSTRAINT "PK_999fdd0e0d26bf3a85bacd82ecb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_key" ("ak_id" SERIAL NOT NULL, "ak_created_on" TIMESTAMP NOT NULL, "ak_api_key" character varying NOT NULL, "ak_expired_on" TIMESTAMP NOT NULL, "user_id" integer, CONSTRAINT "REL_6a0830f03e537b239a53269b27" UNIQUE ("user_id"), CONSTRAINT "PK_8ca2910e3ef8a16d6078ad8ece9" PRIMARY KEY ("ak_id"))`);
        await queryRunner.query(`CREATE TABLE "call_log_table_list" ("id" SERIAL NOT NULL, "table_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_445e9d582217f12a2976b8d800f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contacts" ("cont_id" SERIAL NOT NULL, "cont_phone_number" character varying NOT NULL, "cont_first_name" character varying NOT NULL, "cont_last_name" character varying NOT NULL, "cont_created_on" TIMESTAMP NOT NULL, "cont_last_modified" TIMESTAMP NOT NULL, "cont_active" boolean NOT NULL, "modified_by" integer, "account_id" integer, CONSTRAINT "PK_4eaa9e949ebdb036774006b2dde" PRIMARY KEY ("cont_id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("cont_id" SERIAL NOT NULL, "cont_phone_number" character varying NOT NULL, "cont_first_name" character varying NOT NULL, "cont_last_name" character varying NOT NULL, "cont_created_on" TIMESTAMP NOT NULL, "cont_last_modified" TIMESTAMP NOT NULL, "cont_active" boolean NOT NULL, "modified_by" integer, "account_id" integer, CONSTRAINT "PK_46f1a638bf40fa5236d4c56beb6" PRIMARY KEY ("cont_id"))`);
        await queryRunner.query(`CREATE TABLE "provinces" ("province_uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "country_uuid" uuid NOT NULL, "short_name" character varying NOT NULL, "full_name" character varying NOT NULL, "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "created_on" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9e1198910df8563b37614dc21be" PRIMARY KEY ("province_uuid"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("country_uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "short_name" character varying NOT NULL, "full_name" character varying NOT NULL, "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "created_on" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf5975abed7b132cb206b6921fb" PRIMARY KEY ("country_uuid"))`);
        await queryRunner.query(`CREATE TABLE "data_category" ("daca_id" SERIAL NOT NULL, "daca_name" character varying NOT NULL, "daca_status" boolean NOT NULL, "daca_json" jsonb, CONSTRAINT "PK_187319af11e1ce1294f587f2a81" PRIMARY KEY ("daca_id"))`);
        await queryRunner.query(`CREATE TABLE "data" ("data_id" SERIAL NOT NULL, "data_name" character varying NOT NULL, "data_slug" character varying NOT NULL, "data_status" boolean NOT NULL, "data_json" jsonb, "daca_id" integer, CONSTRAINT "PK_d73655924a9d3e83a9508159c63" PRIMARY KEY ("data_id"))`);
        await queryRunner.query(`CREATE TABLE "recordings" ("reco_id" SERIAL NOT NULL, "reco_path" character varying NOT NULL, "reco_name" character varying NOT NULL, "reco_url" character varying NOT NULL, "reco_creation" date NOT NULL, "reco_updated" date NOT NULL, "reco_json" jsonb NOT NULL, "data_id" integer, "acco_id" integer, "user_id" integer, CONSTRAINT "PK_a8efb79304f00aebcd51b2b0d9a" PRIMARY KEY ("reco_id"))`);
        await queryRunner.query(`CREATE TABLE "recording" ("reco_id" SERIAL NOT NULL, "reco_path" character varying NOT NULL, "reco_name" character varying NOT NULL, "reco_url" character varying NOT NULL, "reco_creation" date NOT NULL, "reco_updated" date NOT NULL, "reco_json" jsonb NOT NULL, "data_id" integer, "acco_id" integer, "user_id" integer, CONSTRAINT "PK_23f70934a447a77fa31b44b4b41" PRIMARY KEY ("reco_id"))`);
        await queryRunner.query(`CREATE TABLE "tokens" ("token_uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "ha1" character varying, "ha1b" character varying, "updated_on" TIMESTAMP NOT NULL DEFAULT now(), "created_on" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_8769073e38c365f315426554ca" UNIQUE ("user_id"), CONSTRAINT "PK_190649e5417d2c75f653cd474e8" PRIMARY KEY ("token_uuid"))`);
        await queryRunner.query(`CREATE TABLE "sms_webhook_storage" ("sms_wh_id" SERIAL NOT NULL, "sms_wh_did_id" integer NOT NULL, "sms_wh_reference_id" character varying NOT NULL, "sms_wh_from" character varying NOT NULL, "sms_wh_to" character varying NOT NULL, "sms_wh_text" character varying NOT NULL, "sms_wh_delivery_receipt" boolean NOT NULL, "sms_wh_time" TIMESTAMP NOT NULL, "sms_wh_outgoing" boolean NOT NULL, "sms_wh_status" character varying NOT NULL, "sms_wh_error" character varying NOT NULL, CONSTRAINT "REL_a72e4f35c1f100021e0678b13b" UNIQUE ("sms_wh_did_id"), CONSTRAINT "PK_98037ede2580e0c4f408249047d" PRIMARY KEY ("sms_wh_id"))`);
        await queryRunner.query(`CREATE TABLE "sms_table_list" ("id" SERIAL NOT NULL, "table_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_1c6650f0d0430a39828f20c5b36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_settings" ("pay_set_id" SERIAL NOT NULL, "stripe_skey" character varying, "stripe_pkey" character varying, "paypal_client_id" character varying, "charge_type" character varying, "paypal_test_mode" boolean NOT NULL DEFAULT true, "payment_confirm" boolean NOT NULL DEFAULT true, "email_note" boolean NOT NULL DEFAULT false, "email_confirm_to" character varying, "email_cc_to" character varying, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_69484cc88f3fbfe1d02c9028afd" PRIMARY KEY ("pay_set_id"))`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_1f876145f98b549399feaa9476e" FOREIGN KEY ("pay_id") REFERENCES "payment"("pay_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_e3bbc67f252b11b95c270f50c6c" FOREIGN KEY ("invo_id") REFERENCES "invoice"("invo_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6acfec7285fdf9f463462de3e9f" FOREIGN KEY ("account_id") REFERENCES "account"("acco_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "did" ADD CONSTRAINT "FK_4482009f2c2213288dbe2c4123e" FOREIGN KEY ("acco_id") REFERENCES "account"("acco_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "did" ADD CONSTRAINT "FK_2b13bc8d1415d174a0598918db0" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracking_numbers" ADD CONSTRAINT "FK_83623f6ca11ae14e3a36e029df8" FOREIGN KEY ("did_id") REFERENCES "did"("did_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_key" ADD CONSTRAINT "FK_6a0830f03e537b239a53269b27d" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_3c65cde8db4fba1bac42f3b3661" FOREIGN KEY ("modified_by") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_85bbf0f254d76347a346a8cbb15" FOREIGN KEY ("account_id") REFERENCES "account"("acco_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_7d9cbfd5853e773780df39c0202" FOREIGN KEY ("modified_by") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_6b3555c0d3d0f0d0b6887b5308b" FOREIGN KEY ("account_id") REFERENCES "account"("acco_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_d54f29c28fae4da8134f2ac2784" FOREIGN KEY ("country_uuid") REFERENCES "countries"("country_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "data" ADD CONSTRAINT "FK_4e8f0a02939b1a71c5271b442f0" FOREIGN KEY ("daca_id") REFERENCES "data_category"("daca_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recordings" ADD CONSTRAINT "FK_664adc586ceb0edf271d936bcd4" FOREIGN KEY ("data_id") REFERENCES "data"("data_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recordings" ADD CONSTRAINT "FK_9f1639deff555993adc0731340d" FOREIGN KEY ("acco_id") REFERENCES "account"("acco_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recordings" ADD CONSTRAINT "FK_dff6133071fb6c0d947b5e7b509" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recording" ADD CONSTRAINT "FK_1dc9ba98e7542e198c9e29a6170" FOREIGN KEY ("data_id") REFERENCES "data"("data_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recording" ADD CONSTRAINT "FK_83d86d0e41ff89d9a2a650d3be5" FOREIGN KEY ("acco_id") REFERENCES "account"("acco_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recording" ADD CONSTRAINT "FK_e94aa361be2e1b97725df1aa46d" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sms_webhook_storage" ADD CONSTRAINT "FK_a72e4f35c1f100021e0678b13ba" FOREIGN KEY ("sms_wh_did_id") REFERENCES "did"("did_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sms_webhook_storage" DROP CONSTRAINT "FK_a72e4f35c1f100021e0678b13ba"`);
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`);
        await queryRunner.query(`ALTER TABLE "recording" DROP CONSTRAINT "FK_e94aa361be2e1b97725df1aa46d"`);
        await queryRunner.query(`ALTER TABLE "recording" DROP CONSTRAINT "FK_83d86d0e41ff89d9a2a650d3be5"`);
        await queryRunner.query(`ALTER TABLE "recording" DROP CONSTRAINT "FK_1dc9ba98e7542e198c9e29a6170"`);
        await queryRunner.query(`ALTER TABLE "recordings" DROP CONSTRAINT "FK_dff6133071fb6c0d947b5e7b509"`);
        await queryRunner.query(`ALTER TABLE "recordings" DROP CONSTRAINT "FK_9f1639deff555993adc0731340d"`);
        await queryRunner.query(`ALTER TABLE "recordings" DROP CONSTRAINT "FK_664adc586ceb0edf271d936bcd4"`);
        await queryRunner.query(`ALTER TABLE "data" DROP CONSTRAINT "FK_4e8f0a02939b1a71c5271b442f0"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_d54f29c28fae4da8134f2ac2784"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_6b3555c0d3d0f0d0b6887b5308b"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_7d9cbfd5853e773780df39c0202"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_85bbf0f254d76347a346a8cbb15"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_3c65cde8db4fba1bac42f3b3661"`);
        await queryRunner.query(`ALTER TABLE "api_key" DROP CONSTRAINT "FK_6a0830f03e537b239a53269b27d"`);
        await queryRunner.query(`ALTER TABLE "tracking_numbers" DROP CONSTRAINT "FK_83623f6ca11ae14e3a36e029df8"`);
        await queryRunner.query(`ALTER TABLE "did" DROP CONSTRAINT "FK_2b13bc8d1415d174a0598918db0"`);
        await queryRunner.query(`ALTER TABLE "did" DROP CONSTRAINT "FK_4482009f2c2213288dbe2c4123e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6acfec7285fdf9f463462de3e9f"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_c66c60a17b56ec882fcd8ec770b"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_e3bbc67f252b11b95c270f50c6c"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_1f876145f98b549399feaa9476e"`);
        await queryRunner.query(`DROP TABLE "payment_settings"`);
        await queryRunner.query(`DROP TABLE "sms_table_list"`);
        await queryRunner.query(`DROP TABLE "sms_webhook_storage"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "recording"`);
        await queryRunner.query(`DROP TABLE "recordings"`);
        await queryRunner.query(`DROP TABLE "data"`);
        await queryRunner.query(`DROP TABLE "data_category"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "call_log_table_list"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
        await queryRunner.query(`DROP TABLE "tracking_numbers"`);
        await queryRunner.query(`DROP TABLE "did"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_type_enum"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "account_blacklist"`);
    }

}
