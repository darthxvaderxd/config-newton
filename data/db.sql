-- create the initial database
create database config_newton;

-- create the base deployment table
create table config_newton.deployment
(
    deployment_id bigint auto_increment
        primary key,
    name          varchar(50)          not null,
    secured       tinyint(1) default 0 null,
    constraint deployment_name_uindex
        unique (name)
);

-- create the base deployment_key table
create table config_newton.deployment_key
(
    deployment_key_id bigint auto_increment
        primary key,
    deployment_id     bigint      not null,
    `key`             varchar(64) not null,
    constraint deployment_key_key_uindex
        unique (`key`),
    constraint deployment_key___fk_deployment_id
        foreign key (deployment_id) references config_newton.deployment (deployment_id)
            on update cascade on delete cascade
);

-- create the base config table
create table config_newton.config
(
    config_id     bigint      not null
        primary key,
    deployment_id bigint      null,
    `key`         varchar(50) null,
    value         text        null,
    constraint config__index_deployment_key
        unique (`key`, deployment_id)
);

-- create the base migrations table
create table config_newton.migrations
(
    migration_id bigint auto_increment
        primary key,
    name         varchar(100)                        not null,
    hash         varchar(64)                         not null,
    date         timestamp default CURRENT_TIMESTAMP not null
);

create index migrations__index_hash
    on config_newton.migrations (hash);

create index migrations__index_name
    on config_newton.migrations (name);

-- won't require deployment key
insert into config_newton.deployment (name, secured) values ('dev', 0);
