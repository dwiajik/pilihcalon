let dbm;
let type;
let seed;

const tableName = 'candidates';

const setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const up = function(db, callback) {
  db.runSql(`
    CREATE TABLE ${tableName} (
      id BIGSERIAL,
      election_id BIGINT,
      name VARCHAR NOT NULL,
      photo VARCHAR NOT NULL,
      summary TEXT,
      data JSONB,
      vote_count BIGINT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMPTZ DEFAULT NULL,
      PRIMARY KEY (id),
      CONSTRAINT ${tableName}_election_id_fk FOREIGN KEY (election_id)
        REFERENCES elections (id)
        MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    );
  `, callback);
  db.runSql(`
    CREATE INDEX ${tableName}_election_id_idx
    ON ${tableName} (election_id);
  `, callback);
  db.runSql(`
    CREATE INDEX ${tableName}_name_idx
    ON ${tableName} USING gin (name gin_trgm_ops);
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