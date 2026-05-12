-- Dignidade 360 Enterprise - schema inicial
-- Modelo base para futuro desenvolvimento. Ajustar conforme stack e requisitos finais.

create table organizations (
  id uuid primary key,
  name text not null,
  type text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table units (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  name text not null,
  type text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  organization_id uuid references organizations(id),
  unit_id uuid references units(id),
  name text not null,
  email text not null unique,
  role text not null check (role in ('patient','caregiver','professional','coordinator','manager','admin')),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table care_lines (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  name text not null,
  entry_criteria text,
  high_risk_sla_minutes integer not null default 120,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table patients (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  unit_id uuid references units(id),
  care_line_id uuid references care_lines(id),
  primary_professional_id uuid references users(id),
  name text not null,
  birth_date date,
  primary_condition text not null,
  current_priority text not null default 'low' check (current_priority in ('low','moderate','high','critical')),
  status text not null default 'active',
  care_goal text,
  created_at timestamptz not null default now()
);

create table patient_caregivers (
  id uuid primary key,
  patient_id uuid not null references patients(id),
  caregiver_user_id uuid not null references users(id),
  relationship text,
  permissions jsonb not null default '{}',
  status text not null default 'active',
  authorized_at timestamptz not null default now()
);

create table checkins (
  id uuid primary key,
  patient_id uuid not null references patients(id),
  respondent_user_id uuid not null references users(id),
  pain integer not null check (pain between 0 and 10),
  breathlessness integer not null check (breathlessness between 0 and 10),
  anxiety integer not null check (anxiety between 0 and 10),
  fatigue integer not null check (fatigue between 0 and 10),
  appetite integer check (appetite between 0 and 10),
  sleep text,
  mobility text,
  crisis boolean not null default false,
  note text,
  calculated_priority text not null check (calculated_priority in ('low','moderate','high','critical')),
  rule_version text,
  created_at timestamptz not null default now()
);

create table alerts (
  id uuid primary key,
  patient_id uuid not null references patients(id),
  source_type text not null,
  source_id uuid,
  severity text not null check (severity in ('low','moderate','high','critical')),
  title text not null,
  description text,
  status text not null default 'new' check (status in ('new','triage','in_progress','waiting_patient','escalated','resolved','cancelled')),
  responsible_user_id uuid references users(id),
  sla_minutes integer not null,
  first_response_at timestamptz,
  resolved_at timestamptz,
  outcome text,
  created_at timestamptz not null default now()
);

create table clinical_actions (
  id uuid primary key,
  patient_id uuid not null references patients(id),
  alert_id uuid references alerts(id),
  professional_user_id uuid not null references users(id),
  type text not null,
  description text not null,
  next_action text,
  outcome text,
  created_at timestamptz not null default now()
);

create table care_plans (
  id uuid primary key,
  patient_id uuid not null references patients(id),
  version integer not null,
  goals text not null,
  priority_symptoms text,
  interventions text,
  status text not null default 'active',
  reviewed_at timestamptz,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table crisis_plans (
  id uuid primary key,
  patient_id uuid not null references patients(id),
  version integer not null,
  warning_signs text not null,
  what_to_do text not null,
  who_to_call text,
  emergency_instructions text,
  preferences text,
  status text not null default 'active',
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table timeline_events (
  id uuid primary key,
  patient_id uuid not null references patients(id),
  event_type text not null,
  title text not null,
  description text,
  related_type text,
  related_id uuid,
  visibility text not null default 'team',
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table consents (
  id uuid primary key,
  patient_id uuid not null references patients(id),
  type text not null,
  purpose text not null,
  authorized boolean not null,
  terms_version text not null,
  channel text,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key,
  user_id uuid references users(id),
  action text not null,
  entity text not null,
  record_id uuid,
  reason text,
  ip_address text,
  created_at timestamptz not null default now()
);

create index idx_patients_org on patients(organization_id);
create index idx_alerts_patient on alerts(patient_id);
create index idx_alerts_status on alerts(status);
create index idx_checkins_patient_created on checkins(patient_id, created_at desc);
create index idx_timeline_patient_created on timeline_events(patient_id, created_at desc);
