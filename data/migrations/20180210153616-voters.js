let dbm;
let type;
let seed;

const SCHEMA = 'pilihcalon';
const TABLE = 'voters';

const setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const up = function(db, callback) {
  db.runSql(`
    CREATE TABLE ${SCHEMA}.${TABLE} (
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
      CONSTRAINT ${TABLE}_election_id_fk FOREIGN KEY (election_id)
        REFERENCES elections (id)
        MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    );
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_election_id_hash_idx
    ON ${TABLE} USING HASH (election_id);
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_voter_id_hash_idx
    ON ${TABLE} USING HASH (voter_id);
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_has_voted_idx
    ON ${TABLE} (has_voted);
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_voter_id_idx
    ON ${TABLE} USING gin (voter_id gin_trgm_ops);
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_name_idx
    ON ${TABLE} USING gin (name gin_trgm_ops);
  `, callback);
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