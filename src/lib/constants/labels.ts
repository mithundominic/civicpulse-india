// Display-label maps for database enum values — the ONLY acceptable
// "hardcoded" domain-shaped data per AGENTS.md Rule 19: these map a value
// that still originates from the database to how it reads on screen, they
// are never a stand-in for real records.
import type { Enums } from "@/lib/database/types";

export const RECOGNITION_LABELS: Record<Enums<"recognition_type">, string> = {
  NATIONAL: "National Party",
  STATE: "State Party",
  REGISTERED_UNRECOGNISED: "Registered Unrecognised Party",
};

export const VERIFICATION_LABELS: Record<Enums<"verification_status">, string> = {
  UNVERIFIED: "Unverified",
  PENDING_REVIEW: "Pending Review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  STALE: "Needs Re-verification",
};

export const CANDIDATE_RESULT_LABELS: Record<Enums<"candidate_result_status">, string> = {
  ELECTED: "Elected",
  RUNNER_UP: "Runner-up",
  LOST: "Lost",
  WITHDRAWN: "Withdrawn",
  DISQUALIFIED: "Disqualified",
};

export const HOUSE_TYPE_LABELS: Record<Enums<"house_type">, string> = {
  LOK_SABHA: "Lok Sabha",
  RAJYA_SABHA: "Rajya Sabha",
  STATE_LEGISLATIVE_ASSEMBLY: "Legislative Assembly",
  STATE_LEGISLATIVE_COUNCIL: "Legislative Council",
};

export const ELECTION_STATUS_LABELS: Record<Enums<"election_status">, string> = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const PARTY_STATUS_LABELS: Record<Enums<"party_status">, string> = {
  ACTIVE: "Active",
  DISSOLVED: "Dissolved",
  MERGED: "Merged",
  INACTIVE: "Inactive",
};

// Source-authority vocabulary referenced in AGENTS.md Rule 18 — fixed,
// never a free-text editorial judgment.
export const SOURCE_TYPE_LABELS: Record<Enums<"source_type">, string> = {
  ECI: "Election Commission of India",
  PARLIAMENT: "Parliament of India",
  CENTRAL_GOVERNMENT: "Government Source",
  STATE_GOVERNMENT: "Government Source",
  UT_GOVERNMENT: "Government Source",
  POLITICAL_PARTY: "Official Party Source",
  LEGISLATIVE_BODY: "Legislative Body",
  OFFICIAL_PERSONAL: "Official Source",
  SECONDARY: "Secondary Source",
  USER_SUBMITTED: "User Submitted",
  OTHER: "Other Source",
};
