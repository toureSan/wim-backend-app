import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create providers table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone VARCHAR NOT NULL,
        address VARCHAR NOT NULL,
        profile_picture_url VARCHAR,
        service_description TEXT,
        service_rate DECIMAL(10,2) NOT NULL,
        service_radius INTEGER NOT NULL,
        experience_description TEXT,
        certifications TEXT[] DEFAULT '{}',
        provider_references TEXT[] DEFAULT '{}',
        schedule JSONB,
        start_date DATE NOT NULL,
        services TEXT[] DEFAULT '{}',
        rating DECIMAL(3,2) DEFAULT 0,
        status VARCHAR DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create user_profiles table with provider fields
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id VARCHAR NOT NULL,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone VARCHAR NOT NULL,
        address VARCHAR NOT NULL,
        role VARCHAR NOT NULL DEFAULT 'client',
        is_available BOOLEAN NOT NULL DEFAULT false,
        latitude FLOAT,
        longitude FLOAT,
        profile_picture_url VARCHAR,
        service_description TEXT,
        service_rate DECIMAL(10,2),
        service_radius INTEGER,
        experience_description TEXT,
        certifications TEXT[] DEFAULT '{}',
        provider_references TEXT[] DEFAULT '{}',
        schedule JSONB,
        start_date DATE,
        services TEXT[] DEFAULT '{}',
        rating DECIMAL(3,2) DEFAULT 0,
        status VARCHAR DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create user_credits table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_credits (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id VARCHAR NOT NULL,
        credits INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create conversations table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id VARCHAR NOT NULL,
        provider_id VARCHAR NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create messages table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        conversation_id UUID NOT NULL,
        sender_id VARCHAR NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS messages`);
    await queryRunner.query(`DROP TABLE IF EXISTS conversations`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_credits`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_profiles`);
    await queryRunner.query(`DROP TABLE IF EXISTS providers`);
  }
} 