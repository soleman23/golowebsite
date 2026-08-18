-- Keep production aligned with the Prisma lead schema. These tables are
-- accessed only by the server through a direct Postgres connection, never by
-- Supabase's REST or GraphQL Data API.

alter table public."ContactMessage"
  add column if not exists "topic" text;

create table if not exists public."NewsletterLead" (
  "id" text not null,
  "email" text not null,
  "source" text not null default 'blog',
  "createdAt" timestamp(3) without time zone not null default current_timestamp,

  constraint "NewsletterLead_pkey" primary key ("id")
);

create unique index if not exists "NewsletterLead_email_key"
  on public."NewsletterLead" ("email");

create index if not exists "NewsletterLead_createdAt_idx"
  on public."NewsletterLead" ("createdAt");

-- Remove Data API access to all private lead data. The application connects
-- as the database owner through Prisma, so none of these API roles is needed.
revoke all privileges on table
  public."PhoneLead",
  public."NewsletterLead",
  public."ContactMessage"
from public, anon, authenticated, service_role;

alter table public."PhoneLead" enable row level security;
alter table public."NewsletterLead" enable row level security;
alter table public."ContactMessage" enable row level security;

create policy "Deny direct Data API access"
on public."NewsletterLead"
for all
to anon, authenticated
using (false)
with check (false);

-- Existing Supabase projects automatically grant new public-schema objects
-- to Data API roles. Make future exposure opt-in for objects created by the
-- project's postgres owner, matching Supabase's current secure default.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables
  from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke usage, select on sequences
  from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke execute on functions
  from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke execute on functions from public;
