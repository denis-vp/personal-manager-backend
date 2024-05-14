CREATE TABLE IF NOT EXISTS public."verificationCodes"
(
    code text NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    "expirationDate" date NOT NULL,
    CONSTRAINT "verificationCodes_pkey" PRIMARY KEY (code)
)