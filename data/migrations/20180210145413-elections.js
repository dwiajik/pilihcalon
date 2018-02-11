let dbm;
let type;
let seed;

const SCHEMA = 'pilihcalon';
const TABLE = 'elections';

const setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const up = function(db, callback) {
  db.runSql(`
    CREATE TABLE ${SCHEMA}.${TABLE} (
      id BIGSERIAL,
      name VARCHAR NOT NULL,
      description TEXT,
      data JSONB,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      PRIMARY KEY (id)
    );
  `, null, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_name_idx
    ON ${TABLE} USING gin (name gin_trgm_ops);
  `, null, callback);
};

const down = function(db, callback) {
  db.runSql(`
    DROP TABLE ${SCHEMA}.${TABLE};
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