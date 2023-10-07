CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.users (id serial4 NOT NULL,"name" bpchar(30) NOT NULL,"password" bpchar(60) NOT NULL,status int2 NOT NULL DEFAULT 0,CONSTRAINT users_pk PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.challenges (id serial4 NOT NULL,"name" bpchar(30) NOT NULL,"desc" varchar NOT NULL,flag bpchar(30) NOT NULL,section_id int4 NOT NULL,release_epoch int8 NOT NULL DEFAULT 0,first_blood_uid int4 NULL,score int4 NOT NULL DEFAULT 500);

CREATE TABLE IF NOT EXISTS public.sections (id serial4 NOT NULL,"name" bpchar(30) NULL,enabled bool NOT NULL DEFAULT false);

CREATE TABLE IF NOT EXISTS public.done (id serial4 NOT NULL,uid int4 NOT NULL,cid int4 NOT NULL,base_points int4 NOT NULL DEFAULT 0);