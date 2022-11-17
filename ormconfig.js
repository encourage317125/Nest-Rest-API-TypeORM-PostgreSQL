
const baseOptions = {
    cli: {
      migrationsDir: `src/modules/db/migrations`,
    },
    entities: ['build/models/*.js'],
    migrations: ['build/modules/db/migrations/*.js'],
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || 5432,
    type: "postgres",
    username: process.env.DB_USER || "postgres",
    autoLoadEntities: true,
    logging:true,
    //"synchronize": true,
  };
  
  module.exports = [
    Object.assign({}, baseOptions, { name: "default", database: "freesms" }),
  ];
  