import type { GenericState } from "app/store/types/state";
export type Group = {
  id: number;
  name: string;
  type: string;
  parentGroupName: string;
  fqgn: string;
  category: string;
  createdDate: string;
  parentGroupId: string;
  inUse?: boolean;
  categoryName: string;
};
export type GroupState = GenericState<Group, string | null> & {
  fetchGroups: boolean;
  searchFilterText: string;
  filter: string;
  renderAddGroupsForm: boolean;
  renderDeleteGroupsForm: boolean;
  renderUpdateGroupsForm: boolean;
  addOrDeleteGroup: Group | null;
  groupsData: Group[];
};

export type AddGroupValues = {
  parentGroupName: string;
  name: string;
  parentGroupId?: number;
  type: string;
  category: string;
  fqgn?: string;
};

export type AddGroupState = GenericState<AddGroupValues, string | null>;

export const DEFAULT_GROUP_NAMES = ["default_rack", "default_zone"];

export type AddorUpdateGroup = {
  groupToAddorUpdate: AddGroupValues;
  id: string;
  isUpdateOperation: boolean;
};
export type deletegroup = {
  id?: number;
  name?: string;
};

export enum GroupMeta {
  MODEL = "Group",
  PK = "id",
}

export enum AddorUpdateMeta {
  Model = "AddorUpdate",
  Pk = "parentGroupId",
}
