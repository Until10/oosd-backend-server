FROM mysql

WORKDIR /schema

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE cms

COPY ./schema.sql .
COPY ./insert.sql .

ADD ./init.sql /docker-entrypoint-initdb.d

EXPOSE 3306