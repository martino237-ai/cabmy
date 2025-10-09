-- Create a public bucket for publications if it doesn't exist
insert into storage.buckets (id, name, public)
values ('publications', 'publications', true)
on conflict (id) do nothing;

-- Policies: allow public read, and allow insert/update/delete for this bucket
-- Note: This is permissive to support uploads without auth. Consider tightening later.
create policy if not exists "Public read access to publications"
  on storage.objects for select
  using (bucket_id = 'publications');

create policy if not exists "Anyone can upload to publications"
  on storage.objects for insert
  with check (bucket_id = 'publications');

create policy if not exists "Anyone can update publications"
  on storage.objects for update
  using (bucket_id = 'publications');

create policy if not exists "Anyone can delete publications"
  on storage.objects for delete
  using (bucket_id = 'publications');