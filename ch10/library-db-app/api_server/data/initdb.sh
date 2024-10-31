#!env bash
set -e

psql -v ON_ERROR_STOP=1 <<-EOSQL
  CREATE ROLE $PG_USERNAME WITH LOGIN PASSWORD '$PG_PASSWORD';

  CREATE DATABASE $PG_DATABASE
  WITH template=template0 ENCODING='UTF-8' LC_COLLATE='ru_RU.UTF-8' LC_CTYPE='ru_RU.UTF-8'
  OWNER $PG_USERNAME;

  ALTER USER postgres WITH PASSWORD '$PG_POSTGRES_PASSWORD'; 
  /* COMMENTED: tables are created in the app
  GRANT pg_read_all_data TO $PG_USERNAME;
  GRANT pg_write_all_data TO $PG_USERNAME;

  CREATE EXTENSION dblink;

  SELECT dblink_connect('dbname=$PG_DATABASE');

  SELECT dblink_exec('CREATE TABLE $PG_DATABASE.public.author (
    id serial PRIMARY KEY,
    author_name text NOT NULL,
    bio text NOT NULL,
    picture text
  );');

  SELECT dblink_exec('CREATE TABLE $PG_DATABASE.public.book (
    id serial PRIMARY KEY,
    title text NOT NULL,
    year int NOT NULL,
    cover text
  );');

  SELECT dblink_exec('CREATE TABLE $PG_DATABASE.public.author_book (
    author_id int REFERENCES public.author (id) ON UPDATE CASCADE ON DELETE CASCADE,
    book_id int REFERENCES public.book (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT author_book_pkey PRIMARY KEY (author_id, book_id)
  );');

  SELECT dblink_disconnect();
  */
EOSQL
