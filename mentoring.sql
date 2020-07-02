drop schema public cascade;
create schema public;

create table participants (
  -- numeric ID for this participant; note that a person can appear
  -- multiple times in this table (e.g., as mentor and learner)
  id serial primary key,

  -- date that this information expires. this can be extended (such as
  -- when a pairing is made) and expiration is contingent on not being
  -- in a current pair
  expires timestamptz not null,

  -- basic information about the participant
  email text not null,
  role enum('mentor', 'learner') not null, 
  full name text not null,
  namager_email text not null,

  -- null means "not yet"
  approved boolean,

  -- data about the participant
  time_availability bit(24) not null,
  info jsonb not null
);

create table participant_notes (
  participant_id integer
    references participants (id)
    on delete cascade,
  noted timestamptz not null,
  note text not null
);

create table pairs (
  -- the pair_id is an hmac of `<learner email>|<mentor email>` using a key not known to the DB.
  -- this is used to prevent accidentally re-pairing people, without keeping the identities of
  -- those people.
  pair_id text primary key,

  learner_id integer
    references participants (id)
    on delete restrict,
  mentor_id integer
    references participants (id)
    on delete restrict,

  -- date this pairing started
  start_date timestamptz not null,
);
