CREATE DATABASE worldthoughts;

DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS answers CASCADE;

CREATE TABLE polls(
    poll_id SERIAL PRIMARY KEY NOT NULL,
    question VARCHAR(255) NOT NULL,
    is_single BOOLEAN NOT NULL
);

CREATE TABLE options(
    option_id SERIAL PRIMARY KEY NOT NULL,
    poll_id INT NOT NULL REFERENCES polls(poll_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE answers(
    answer_id SERIAL PRIMARY KEY NOT NULL,
    poll_id INT NOT NULL REFERENCES polls(poll_id) ON DELETE CASCADE,
    option_id INT NOT NULL REFERENCES options(option_id) ON DELETE CASCADE,
    cookie VARCHAR(10) NOT NULL
);