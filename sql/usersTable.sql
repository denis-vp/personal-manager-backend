CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    email text NOT NULL COLLATE pg_catalog."default" NOT NULL,
    "firstName" text NOT NULL COLLATE pg_catalog."default" NOT NULL,
    "lastName" text NOT NULL COLLATE pg_catalog."default" NOT NULL,
    "password" text NOT NULL COLLATE pg_catalog."default" NOT NULL,
    verified boolean NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)