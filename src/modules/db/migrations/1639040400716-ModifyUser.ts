import {MigrationInterface, QueryRunner} from "typeorm";

export class ModifyUser1639040400716 implements MigrationInterface {
    name = 'ModifyUser1639040400716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6acfec7285fdf9f463462de3e9f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "account_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "account_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6acfec7285fdf9f463462de3e9f" FOREIGN KEY ("account_id") REFERENCES "account"("acco_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
