\echo 'Delete and recreate tea_time db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE tea_time;
CREATE DATABASE tea_time;
\connect tea_time

\i tea_time-schema.sql
\i tea_time-seed.sql

\echo 'Delete and recreate tea_time_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE tea_time_test;
CREATE DATABASE tea_time_test;
\connect tea_time_test

\i tea_time-schema.sql

