-- Schema gap found while writing seed data: party_recognition_history could only
-- reference states(id), so a party recognized at state level in a Union Territory
-- with a legislature (Delhi, Puducherry, J&K) had nowhere valid to point — the
-- FK only accepts a row from `states`. Adds the missing union_territory_id
-- column, mirroring the state_id/union_territory_id pattern already used by
-- districts, constituencies, houses, governments, etc.

alter table party_recognition_history
  add column union_territory_id uuid references union_territories(id) on delete restrict;

alter table party_recognition_history
  add constraint party_recognition_history_state_scope check (
    (recognition_type = 'STATE' and (
      (state_id is not null and union_territory_id is null) or
      (state_id is null and union_territory_id is not null)
    )) or
    (recognition_type <> 'STATE' and state_id is null and union_territory_id is null)
  );

create index idx_party_recognition_history_ut on party_recognition_history(union_territory_id);
