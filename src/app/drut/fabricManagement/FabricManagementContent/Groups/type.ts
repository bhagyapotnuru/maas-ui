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
};

export const DEFAULT_GROUP_NAMES = ["drut", "default_rack", "default_zone"];
