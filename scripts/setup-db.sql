CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- public.users definition
-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	"name" bpchar(30) NOT NULL,
	"password" bpchar(60) NOT NULL,
	status int2 NOT NULL DEFAULT 0,
	CONSTRAINT users_pk PRIMARY KEY (id)
);


-- public.challenges definition
-- DROP TABLE public.challenges;

CREATE TABLE public.challenges (
	id serial4 NOT NULL,
	"name" bpchar(30) NOT NULL,
	"desc" varchar NOT NULL,
	flag bpchar(30) NOT NULL,
	section_id int4 NOT NULL,
	release_epoch int8 NOT NULL DEFAULT 0,
	first_blood_uid int4 NULL,
	score int4 NOT NULL DEFAULT 500
);


-- public.sections definition
-- DROP TABLE public.sections;

CREATE TABLE public.sections (
	id serial4 NOT NULL,
	"name" bpchar(30) NULL,
	enabled bool NOT NULL DEFAULT false
);


-- public.done definition
-- DROP TABLE public.done;

CREATE TABLE public.done (
	id serial4 NOT NULL,
	uid int4 NOT NULL,
	cid int4 NOT NULL,
	base_points int4 NOT NULL DEFAULT 0
);