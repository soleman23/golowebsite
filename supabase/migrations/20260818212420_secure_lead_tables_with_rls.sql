-- These tables contain private lead/contact data and are only accessed by
-- server-side Prisma through the Postgres connection. They must not be
-- reachable through Supabase's public Data API roles.

revoke all privileges on table
  public."PhoneLead",
  public."ContactMessage"
from public, anon, authenticated;

alter table public."PhoneLead" enable row level security;
alter table public."ContactMessage" enable row level security;

create policy "Deny direct Data API access"
on public."PhoneLead"
for all
to anon, authenticated
using (false)
with check (false);

create policy "Deny direct Data API access"
on public."ContactMessage"
for all
to anon, authenticated
using (false)
with check (false);
