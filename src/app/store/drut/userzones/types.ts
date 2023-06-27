import type { GenericState } from "app/store/types/state";

export type UserZone = {
  is_superuser: boolean;
  user_id: number;
  username: string;
  zones: Zone[];
};

export type Zone = {
  zone_id: number;
  zone_fqgn: string;
  is_active: boolean;
};

export type Data = {
  is_superuser: boolean;
  user_id: number;
  username: string;
  zones: Zone[];
  zonesValue: string;
  active_zone: string;
};

export type RemoveZone = {
  user_id: number;
  zone_ids: string[];
};

export type UserZoneState = GenericState<UserZone, string | null>;

export enum UserZoneMeta {
  MODEL = "UserZone",
  PK = "user_id",
}

export type AddZoneState = GenericState<Zone, string | null>;

export enum AddZoneMeta {
  MODEL = "AddZone",
  PK = "zone_id",
}

// export type UserZoneState = {
//   canBeAddedZones: Omit<Zone, "is_active">;
// } & GenericState<UserZone, string | null>;
