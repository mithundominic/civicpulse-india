-- Business-logic query functions. These are read helpers that centralize
-- "current state is a query, not a column" logic (AGENTS.md Rule 17) so
-- features/*/queries.ts call one function instead of five apps reimplementing
-- the same date-range join slightly differently. All SECURITY INVOKER
-- (the default) — they only ever touch public-readable tables, so they should
-- run with the caller's own RLS, not bypass it.

create type search_result as (
  entity_type text,
  entity_id uuid,
  title text,
  subtitle text,
  slug text,
  rank real
);

create function search_entities(search_query text, result_limit integer default 20)
returns setof search_result
language sql
stable
security invoker
set search_path = public
as $$
  select * from (
    select
      'politician'::text as entity_type,
      p.id as entity_id,
      per.full_name as title,
      coalesce(pos.title, 'Politician') as subtitle,
      per.slug as slug,
      similarity(per.full_name, search_query) as rank
    from politicians p
    join persons per on per.id = p.person_id
    left join lateral (
      select pol.title
      from politician_positions pp
      join political_positions pol on pol.id = pp.position_id
      where pp.politician_id = p.id
        and (pp.effective_to is null or pp.effective_to >= current_date)
      order by pp.effective_from desc
      limit 1
    ) pos on true
    where per.full_name % search_query

    union all
    select 'party', pa.id, pa.name, coalesce(pa.abbreviation, 'Political Party'), pa.slug,
           similarity(pa.name, search_query)
    from political_parties pa
    where pa.name % search_query or pa.abbreviation ilike '%' || search_query || '%'

    union all
    select 'constituency', c.id, c.name,
           coalesce(s.name, ut.name, '') || ' — ' || c.constituency_type::text,
           c.slug, similarity(c.name, search_query)
    from constituencies c
    left join states s on s.id = c.state_id
    left join union_territories ut on ut.id = c.union_territory_id
    where c.name % search_query

    union all
    select 'state', s.id, s.name, 'State', s.slug, similarity(s.name, search_query)
    from states s
    where s.name % search_query
  ) results
  where rank > 0.1
  order by rank desc
  limit result_limit;
$$;

comment on function search_entities(text, integer) is
  'Unified fuzzy search across politicians, parties, constituencies and states using pg_trgm similarity. Backs /search and the header search box.';

create function get_current_party(p_politician_id uuid)
returns table (party_id uuid, party_name text, party_abbreviation text, effective_from date)
language sql stable security invoker set search_path = public
as $$
  select pm.party_id, pp.name, pp.abbreviation, pm.effective_from
  from party_memberships pm
  join political_parties pp on pp.id = pm.party_id
  where pm.politician_id = p_politician_id
    and (pm.effective_to is null or pm.effective_to >= current_date)
  order by pm.effective_from desc
  limit 1;
$$;

create function get_current_positions(p_politician_id uuid)
returns table (
  position_id uuid, title text, category text, level text,
  state_id uuid, constituency_id uuid, house_id uuid, effective_from date
)
language sql stable security invoker set search_path = public
as $$
  select pos.id, coalesce(pp.title_override, pos.title), pos.category, pos.level,
         pp.state_id, pp.constituency_id, pp.house_id, pp.effective_from
  from politician_positions pp
  join political_positions pos on pos.id = pp.position_id
  where pp.politician_id = p_politician_id
    and (pp.effective_to is null or pp.effective_to >= current_date)
  order by pp.effective_from desc;
$$;

create function get_current_government(p_state_id uuid default null)
returns table (government_id uuid, level government_level, formed_date date, term_number integer)
language sql stable security invoker set search_path = public
as $$
  select g.id, g.level, g.formed_date, g.term_number
  from governments g
  where g.status = 'CURRENT'
    and (
      (p_state_id is null and g.level = 'UNION') or
      (p_state_id is not null and g.state_id = p_state_id)
    )
  order by g.formed_date desc
  limit 1;
$$;

comment on function get_current_government(uuid) is
  'Pass NULL for the Union government, or a states.id for that state''s current government.';
