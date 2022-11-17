import { ConnectionOptions } from 'typeorm';
import { Config } from './util/config';

const config: ConnectionOptions = {
    type: "postgres",
    host: Config.string("DB_HOST", `${process.env.DB_HOST}`),
    logging: true,
    port: Config.number("DB_PORT", 5432),
    username: Config.string("DB_USER", `${process.env.DB_USER}`),
    password: Config.string("DB_PASSWORD", `${process.env.DB_PASSWORD}`),
    database: Config.string("DB_NAME", `${process.env.DB_NAME}`),
    entities: ['build/models/*.js'],
    synchronize: false,
    name:'freesms'
}

export = config
