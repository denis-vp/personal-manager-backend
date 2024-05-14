CREATE TABLE IF NOT EXISTS public.notes
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    category text COLLATE pg_catalog."default" NOT NULL,
    content text COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    "associatedTaskId" uuid,
    CONSTRAINT notes_pkey PRIMARY KEY (id)
)