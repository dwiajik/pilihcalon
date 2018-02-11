let dbm;
let type;
let seed;

const tableName = 'voters';

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
      voter_id VARCHAR NOT NULL,
      name VARCHAR NOT NULL,
      passcode VARCHAR NOT NULL,
      data JSONB,
      has_voted BOOLEAN,
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
    CREATE INDEX ${tableName}_election_id_hash_idx
    ON ${tableName} USING HASH (election_id);
  `, callback);
  db.runSql(`
    CREATE INDEX ${tableName}_voter_id_hash_idx
    ON ${tableName} USING HASH (voter_id);
  `, callback);
  db.runSql(`
    CREATE INDEX ${tableName}_has_voted_idx
    ON ${tableName} (has_voted);
  `, callback);
  db.runSql(`
    CREATE INDEX ${tableName}_voter_id_idx
    ON ${tableName} USING gin (voter_id gin_trgm_ops);
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