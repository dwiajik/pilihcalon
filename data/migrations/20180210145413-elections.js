let dbm;
let type;
let seed;

const tableName = 'elections';

const setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const up = function(db, callback) {
  db.runSql(`
    CREATE TABLE ${tableName} (
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
    CREATE INDEX ${tableName}_name_idx
    ON ${tableName} USING gin (name gin_trgm_ops);
  `, null, callback);
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