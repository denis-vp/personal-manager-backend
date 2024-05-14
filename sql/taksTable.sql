CREATE TABLE IF NOT EXISTS public.tasks
(
    id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    category text COLLATE pg_catalog."default" NOT NULL,
    content text COLLATE pg_catalog."default" NOT NULL,
    "isFinished" boolean NOT NULL,
    "dueDate" date,
    priority text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tasks_pkey PRIMARY KEY (id)
)