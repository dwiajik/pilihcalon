let dbm;
let type;
let seed;

const tableName = 'users';

const setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const up = function(db, callback) {
  db.runSql(`
    CREATE TABLE ${tableName} (
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
    CREATE INDEX ${tableName}_name_idx
    ON ${tableName} USING gin (name gin_trgm_ops);
  `, callback);
  db.runSql(`
    CREATE INDEX ${tableName}_email_hash_idx
    ON ${tableName} USING HASH (email);
  `, callback);
};

const down = function(db, callback) {
  db.runSql(`
    DROP TABLE ${tableName};
  `, callback);
};

const _meta = {
  "version": 1
};

module.exports = {
  setup,
  up,
  down,
  _meta,
};