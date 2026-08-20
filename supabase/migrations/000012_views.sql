-- Read-optimized views. Every view is WITH (security_invoker = true) so it
-- enforces the querying role's own RLS on the underlying tables rather than
-- the view owner's — a view is a convenience for the read shape, never a way
-- to bypass row security (AGENTS.md Rule 14). None of these are materialized:
-- this data changes daily at most and directory/detail pages are already
-- server-rendered per request, so a plain view can never drift out of sync
-- with its source tables — see DB spec on materialized views for when that
-- guidance changes (genuinely expensive cross-election analytics, not this).

create view current_position_holders
with (security_invoker = true) as
select
  pp.id as politician_position_id,
  pol.id as politician_id,
  per.full_name,
  per.slug as person_slug,
  per.photo_url,
  pos.id as position_id,
  coalesce(pp.title_override, pos.title) as position_title,
  pos.category as position_category,
  pos.level as position_level,
  pp.state_id,
  pp.union_territory_id,
  pp.constituency_id,
  pp.house_id,
  pp.effective_from
from politician_positions pp
join politicians pol on pol.id = pp.politician_id
join persons per on per.id = pol.person_id
join political_positions pos on pos.id = pp.position_id
where pp.effective_to is null or pp.effective_to >= current_date;

create view current_ministers
with (security_invoker = true) as
select
  ma.id as minister_assignment_id,
  pol.id as politician_id,
  per.full_name,
  per.slug as person_slug,
  per.photo_url,
  ma.government_id,
  m.id as ministry_id,
  m.name as ministry_name,
  pf.id as portfolio_id,
  pf.name as portfolio_name,
  ma.rank,
  ma.is_primary,
  ma.effective_from
from minister_assignments ma
join politicians pol on pol.id = ma.politician_id
join persons per on per.id = pol.person_id
left join ministries m on m.id = ma.ministry_id
left join portfolios pf on pf.id = ma.portfolio_id
where ma.effective_to is null or ma.effective_to >= current_date;

create view current_house_members
with (security_invoker = true) as
select
  hm.id as house_membership_id,
  pol.id as politician_id,
  per.full_name,
  per.slug as person_slug,
  per.photo_url,
  hm.house_id,
  h.name as house_name,
  h.house_type,
  hm.constituency_id,
  c.name as constituency_name,
  c.slug as constituency_slug,
  hm.party_id,
  pa.name as party_name,
  pa.abbreviation as party_abbreviation,
  hm.state_id,
  hm.membership_type,
  hm.start_date
from politician_house_memberships hm
join politicians pol on pol.id = hm.politician_id
join persons per on per.id = pol.person_id
join houses h on h.id = hm.house_id
left join constituencies c on c.id = hm.constituency_id
left join political_parties pa on pa.id = hm.party_id
where hm.end_date is null;

create view current_party_memberships
with (security_invoker = true) as
select
  pm.id as party_membership_id,
  pm.politician_id,
  pm.party_id,
  pa.name as party_name,
  pa.abbreviation as party_abbreviation,
  pm.membership_type,
  pm.office_title,
  pm.effective_from
from party_memberships pm
join political_parties pa on pa.id = pm.party_id
where pm.effective_to is null or pm.effective_to >= current_date;

-- Derived aggregation, not a second source of truth (DB spec: party election
-- results should never be stored independently of election_candidates/results).
create view party_election_results
with (security_invoker = true) as
select
  ec.election_id,
  el.name as election_name,
  ec.party_id,
  pa.name as party_name,
  pa.abbreviation as party_abbreviation,
  count(*) filter (where er.is_winner) as seats_won,
  count(*) as candidates_contested,
  coalesce(sum(er.votes_received), 0) as total_votes
from election_candidates ec
join elections el on el.id = ec.election_id
left join election_results er on er.election_candidate_id = ec.id
left join political_parties pa on pa.id = ec.party_id
group by ec.election_id, el.name, ec.party_id, pa.name, pa.abbreviation;

-- Directory-listing shape: one row per politician with current party/position/
-- seat already joined in, so a directory page never needs N+1 queries.
create view public_politician_overview
with (security_invoker = true) as
select
  pol.id as politician_id,
  per.id as person_id,
  per.full_name,
  per.slug,
  per.photo_url,
  pol.status,
  cpm.party_id as current_party_id,
  cpm.party_name as current_party_name,
  cpm.party_abbreviation as current_party_abbreviation,
  cph.position_title as current_position_title,
  chm.house_name as current_house_name,
  chm.house_type as current_house_type,
  chm.constituency_name as current_constituency_name,
  chm.constituency_slug as current_constituency_slug
from politicians pol
join persons per on per.id = pol.person_id
left join current_party_memberships cpm on cpm.politician_id = pol.id
left join lateral (
  select * from current_position_holders where politician_id = pol.id
  order by effective_from desc limit 1
) cph on true
left join lateral (
  select * from current_house_members where politician_id = pol.id
  order by start_date desc limit 1
) chm on true;

create view public_party_overview
with (security_invoker = true) as
select
  pa.id as party_id,
  pa.name,
  pa.abbreviation,
  pa.slug,
  pa.status,
  pa.founded_date,
  pa.logo_url,
  prh.recognition_type as current_recognition_type,
  pres.full_name as current_president_name
from political_parties pa
left join lateral (
  select * from party_recognition_history
  where party_id = pa.id and state_id is null
    and (effective_to is null or effective_to >= current_date)
  order by effective_from desc limit 1
) prh on true
left join lateral (
  select per.full_name
  from party_memberships pm
  join politicians pol on pol.id = pm.politician_id
  join persons per on per.id = pol.person_id
  where pm.party_id = pa.id
    and pm.membership_type in ('OFFICE_BEARER', 'LEADER')
    and pm.office_title ilike 'president'
    and (pm.effective_to is null or pm.effective_to >= current_date)
  order by pm.effective_from desc limit 1
) pres on true;
