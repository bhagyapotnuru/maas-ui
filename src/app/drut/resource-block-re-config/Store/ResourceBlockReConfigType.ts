import type { KeyValuePair } from "../Models/KeyValuePair";
import type { Endpoint, Member, ResourceBlock } from "../Models/ResourceBlock";
import type { ResourceBlockOption } from "../Models/ResourceBlockOptions";

import type { Rack, RackManager, Zone } from "app/store/drut/managers/types";

export type ReConfigType = {
  zones: Zone[];
  setZones: (zones: Zone[]) => void;
  selectedZone: string;
  setSelectedZone: (value: string) => void;
  loading: boolean;
  loadingMessage: string;
  error: string;
  setError: (value: string) => void;
  racks: Rack[];
  selectedRack: string;
  setSelectedRack: (selectedRack: string) => void;
  managers: RackManager[];
  selectedManager: string;
  setSelectedManager: (selectedManager: string) => void;
  resourceBlocksResponse: ResourceBlock;
  resourceBlocksByType: KeyValuePair;
  resourceBlockOptions: ResourceBlockOption[];
  selectedResourceBlock: ResourceBlockOption | null;
  setSelectedResourceBlock: (
    selectedResourceBlock: ResourceBlockOption | null
  ) => void;
  freePoolBlocks: Member[];
  availableFreePools: Member[];
  expandedResourceBlockType: string;
  setExpandedResourceBlockType: (expandedResourceType: string) => void;
  expandedResource: string;
  setExpandedResource: (expandedResourceType: string) => void;
  resourceToDelete: Endpoint;
  setResourceToDelete: (resourceToDelete: Endpoint) => void;
  onConfirmRemoveResourceHandler: () => void;
  onDeletePopUpBackDropClickHandler: () => void;
  onDeletePopUpCancelHandler: () => void;
  showFreePoolResourcePopup: boolean;
  setShowFreePoolResourcePopUp: (showFreePoolResourcePopup: boolean) => void;
  onCancelAttachFreePoolResource: () => void;
  onBackDropClickFreePoolResource: () => void;
  setCurrentRBToAttachOrDetach: (resourceBlock: Member) => void;
  currentRBToAttachOrDetachResource: Member;
  isAttachDetachInProgress: boolean;
  attachDetachError: string;
  setAttachDetachError: (value: string) => void;
  resourceToAttach: Endpoint;
  setResourceToAttach: (resourceToAttach: Endpoint) => void;
  resourceToAttachFreePoolBlock: Member;
  setResourceToAttachFreePoolBlock: (freePoolBlock: Member) => void;
  refresh: () => void;
  refreshing: boolean;
  expandedResourceBlock: string;
  setExpandedResourceBlock: (value: string) => void;
  isAnyActionInProgress: boolean;
};
