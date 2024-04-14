const { Pool } = require("pg")

class CondominiumMemberSeed {
  static async exec() {
    const config = new URL(process.env.DATABASE_URL)
    const pool = new Pool({
      host: config.hostname,
      user: config.username,
      password: config.password,
      port: parseInt(config.port),
      database: config.pathname.substring(1),
      ssl: process.env.DATABASE_SSL ? {
        rejectUnauthorized: true
      } : false
    })

    console.log('Executing queries!')
    await pool.query(`
       CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

       CREATE TABLE IF NOT EXISTS public.condominium_members (
          id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
          user_id uuid,
          role smallint DEFAULT '0'::smallint NOT NULL,

          CONSTRAINT "PK_condominium_member_id" PRIMARY KEY(id),
          CONSTRAINT "UQ_user_id" UNIQUE(user_id)
      );

      INSERT INTO public.condominium_members (user_id, role) 
      VALUES ('1465520e-f8be-445c-a8e6-34f708afc513', 1)
      ON CONFLICT DO NOTHING;
    `)

    await pool.end()
  }
}

CondominiumMemberSeed.exec()
