import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770841732499 implements MigrationInterface {
    name = 'InitialSchema1770841732499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`investments\` CHANGE \`is_active\` \`is_active\` tinyint(1) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`portfolios\` CHANGE \`is_active\` \`is_active\` tinyint(1) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` CHANGE \`revoked\` \`revoked\` tinyint(1) NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` CHANGE \`revoked\` \`revoked\` tinyint NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`portfolios\` CHANGE \`is_active\` \`is_active\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`investments\` CHANGE \`is_active\` \`is_active\` tinyint NOT NULL DEFAULT '1'`);
    }

}
