const SCHEMA = 'pilihcalon';
const TABLE = 'users';

const up = (db, callback) => {
  db.runSql(`
    CREATE TABLE ${SCHEMA}.${TABLE} (
      id BIGSERIAL,
      email VARCHAR NOT NULL,
      password VARCHAR NOT NULL,
      name VARCHAR NOT NULL,
      data JSONB,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE (email)
    );
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_name_idx
    ON ${TABLE} USING gin (name gin_trgm_ops);
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_email_hash_idx
    ON ${TABLE} USING HASH (email);
  `, callback);
};

const down = (db, callback) => {
  db.runSql(`
    DROP TABLE ${SCHEMA}.${TABLE};
  `, callback);
};

module.exports = {
  up,
  down,
};
