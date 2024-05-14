CREATE TABLE IF NOT EXISTS public."refreshTokens"
(
    token text NOT NULL,
    email text NOT NULL COLLATE pg_catalog."default" NOT NULL,
    "firstName" text NOT NULL COLLATE pg_catalog."default" NOT NULL,
    "lastName" text NOT NULL COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "refreshTokens_pkey" PRIMARY KEY (token)
)