FROM postgres:16

COPY backup.tar /docker-entrypoint-initdb.d/
COPY restore.sh /docker-entrypoint-initdb.d/