const SCHEMA = 'pilihcalon';
const TABLE = 'candidates';

const up = (db, callback) => {
  db.runSql(`
    CREATE TABLE ${SCHEMA}.${TABLE} (
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
      CONSTRAINT ${TABLE}_election_id_fk FOREIGN KEY (election_id)
        REFERENCES elections (id)
        MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    );
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_election_id_idx
    ON ${TABLE} (election_id);
  `, callback);
  db.runSql(`
    CREATE INDEX ${TABLE}_name_idx
    ON ${TABLE} USING gin (name gin_trgm_ops);
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
