import { useEffect, useState } from "react";

import { INPROGRESS, IN_PROGRESS } from "../Constants/re-config.constants";
import type { KeyValuePair } from "../Models/KeyValuePair";
import { CompositionState } from "../Models/ResourceBlock";
import type { Endpoint, Member, ResourceBlock } from "../Models/ResourceBlock";
import type { ResourceBlockOption } from "../Models/ResourceBlockOptions";

import ResoruceBlockReConfigContext from "./resource-block-re-config-context";

import {
  fetchResourceBlocksByQuery,
  fetchZoneRacksDataByQuery,
  crawlManagerBydata,
  attachDetachResourceBlockById,
} from "app/drut/api";
import type { Rack, RackManager, Zone } from "app/store/drut/managers/types";

export const loadingMsg = "Loading...";
export const rbLoadingMsg = "Fetching Resource Blocks...";

const ResourceBlockReConfigContextProvider = ({
  children,
}: {
  children: any;
}): JSX.Element => {
  const [zones, setZones] = useState([] as Zone[]);
  const [selectedZone, setSelectedZone] = useState("");

  const [racks, setRacks] = useState([] as Rack[]);
  const [selectedRack, setSelectedRack] = useState("");

  const [managers, setManagers] = useState([] as RackManager[]);
  const [selectedManager, setSelectedManager] = useState("");

  const [resourceBlocksResponse, setResourceBlocksResponse] = useState(
    {} as ResourceBlock
  );
  const [resourceBlockOptions, setResourceBlockOptions] = useState(
    [] as ResourceBlockOption[]
  );
  const [selectedResourceBlock, setSelectedResourceBlock] = useState({
    name: "",
    resourceBlockType: "",
    uuid: "",
  } as ResourceBlockOption | null);
  const [freePoolBlocks, setFreePoolBlocks] = useState([] as Member[]);
  const [availableFreePools, setAvailableFreePools] = useState([] as Member[]);
  const [resourceBlocksByType, setResourceBlocksByType] = useState(
    {} as KeyValuePair
  );

  const [expandedResourceBlockType, setExpandedResourceBlockType] =
    useState("");
  const [expandedResourceBlock, setExpandedResourceBlock] = useState("");
  const [expandedResource, setExpandedResource] = useState("");
  const [currentRBToAttachOrDetachResource, setCurrentRBToAttachOrDetach] =
    useState({} as Member);
  const [resourceToDelete, setResourceToDelete] = useState({} as Endpoint);
  const [resourceToAttach, setResourceToAttach] = useState({} as Endpoint);
  const [showFreePoolResourcePopup, setShowFreePoolResourcePopUp] =
    useState(false);
  const [resourceToAttachFreePoolBlock, setResourceToAttachFreePoolBlock] =
    useState({} as Member);

  const [isAnyActionInProgress, setIsAnyActionInProgress] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMsg);
  const [isAttachDetachInProgress, setIsAttachDetachInProgress] =
    useState(false);

  const [error, setError] = useState("");
  const [attachDetachError, setAttachDetachError] = useState("");

  const TIME_OUT = 3000;

  const abortController = new AbortController();

  useEffect(() => {
    setLoading(true);
    fetchZones();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (selectedManager) {
      setLoading(true);
      setIsAnyActionInProgress(false);
      fetchResourceBlocks();
      return () => {
        abortController.abort();
      };
    }
  }, [selectedManager]);

  useEffect(() => {
    const interval = setInterval(() => {
      const rbMembers = resourceBlocksResponse?.Links?.Members || [];
      const isMemberInProgress = (m: Member) =>
        [IN_PROGRESS, INPROGRESS].includes(
          (m.EndpointActionStatus || "").toLowerCase()
        );
      const isEndpointActionInProgress = (m: Member) =>
        [
          ...(m.Processors || []),
          ...(m.Storage || []),
          ...(m.NetworkInterfaces || []),
        ].some((r) =>
          [IN_PROGRESS, INPROGRESS].includes(
            (r.Endpoint.RecentActionStatus || "").toLowerCase()
          )
        );

      const isActionInProgress = rbMembers.some(
        isMemberInProgress || isEndpointActionInProgress
      );
      setIsAnyActionInProgress(isActionInProgress);
      if (isActionInProgress) {
        fetchResourceBlocks();
      }
    }, TIME_OUT);
    return () => {
      clearInterval(interval);
    };
  }, [resourceBlocksResponse]);

  useEffect(() => {
    const zone: Zone | undefined = zones.find(
      (zone) => zone.zone_id === +selectedZone
    );
    if (zone) {
      const racks: Rack[] = zone.racks;
      setRacks(racks);
      setSelectedRack(racks[0] ? `${racks[0].rack_id}` : "");
      setSelectedManager("");
      setSelectedResourceBlock({ name: "", resourceBlockType: "", uuid: "" });
    }
  }, [selectedZone]);

  useEffect(() => {
    let allManagers: RackManager[] = [];
    if (+selectedRack === 0) {
      allManagers = zones
        .flatMap((zone) => zone.racks)
        .flatMap((rack) => rack.managers || []);
    } else {
      const rack: Rack | undefined = racks.find(
        (rack) => rack.rack_id === +selectedRack
      );
      allManagers = rack?.managers || [];
    }
    setSelectedManager("");
    setSelectedResourceBlock({ name: "", resourceBlockType: "", uuid: "" });
    setManagers(allManagers);
  }, [selectedRack, zones]);

  useEffect(() => {
    if (
      resourceToAttach &&
      resourceToAttach.Id &&
      resourceToAttachFreePoolBlock &&
      resourceToAttachFreePoolBlock.Id
    ) {
      attachDetachResource();
    }
  }, [resourceToAttach, resourceToAttachFreePoolBlock]);

  const fetchZones = async () => {
    try {
      setLoadingMessage(loadingMsg);
      const params = { op: "get_zones_and_racks", ManagerType: ["PRU"] };
      const query: string = Object.keys(params)
        .flatMap((key: string) => {
          const param = params[key as keyof typeof params];
          return Array.isArray(param)
            ? (param as []).map((value: string) => key + "=" + value)
            : key + "=" + param;
        })
        .join("&");
      const response: Zone[] = await fetchZoneRacksDataByQuery(
        query,
        abortController.signal
      );
      const zones = response.filter(
        (zone: Zone) =>
          !["drut", "default_zone"].includes(zone.zone_name.toLowerCase())
      );
      setZones(zones);
      setSelectedZone(`${zones[0]?.zone_id}` || "");
    } catch (e: any) {
      const defaultError = "Error fetching Zones.";
      setError(e ? e : defaultError);
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceBlocks = async () => {
    try {
      if (selectedManager) {
        setLoadingMessage(rbLoadingMsg);
        const params: {
          ManagerUuid: string;
        } = { ManagerUuid: selectedManager };
        const query: string = Object.keys(params)
          .map((key: string) => key + "=" + params[key as keyof typeof params])
          .join("&");
        const response: ResourceBlock = await fetchResourceBlocksByQuery(
          `?${query}`,
          abortController.signal
        );
        setSelectedResourceBlock({
          name: "All",
          resourceBlockType: "All",
          uuid: "All",
        });
        setResourceBlocksResponse(response);
        setResourceBlockOptions(getResourceBlockOptions(response));
        setResourceBlocksByType(
          getResourceBlocksByKey(response?.Links?.Members)
        );
      }
    } catch (e: any) {
      const defaultError = "Error fetching Resource Block(s).";
      setError(e ? e : defaultError);
    } finally {
      setLoading(false);
    }
  };

  const getResourceBlockType = (resourceBlockTypes: string[]) => {
    const resourceBlockType: string = resourceBlockTypes[0] || "Other (Empty)";
    switch (resourceBlockType) {
      case "Processor" || "Processors":
        return "Offload";
      case "ComputerSystem" || "ComputerSystems":
        return "DPU";
      default:
        return resourceBlockType;
    }
  };

  const getResourceBlockOptions = (
    resourceBlock: ResourceBlock
  ): ResourceBlockOption[] =>
    filterValidBlocks(resourceBlock.Links.Members).map((member) => {
      return {
        name: member.Name,
        uuid: member.Id,
        resourceBlockType: getResourceBlockType(member.ResourceBlockType),
      };
    });

  const getResourceBlocksByKey = (rbMembers: Member[]): KeyValuePair => {
    return prepareCapacityAndDescription(rbMembers).reduce(
      (prev: KeyValuePair, curr: Member) => {
        const key: string = getResourceBlockType(curr.ResourceBlockType);
        return {
          ...prev,
          [key]: [...(prev[key] || []), curr],
        };
      },
      {}
    );
  };

  const filterValidBlocks = (members: Member[]): Member[] => {
    const isUnused = (m: Member) =>
      m.CompositionStatus.CompositionState === CompositionState.UNUSED;
    const isFreePool = (m: Member) => m.RBInstance === "Free";

    const freePoolBlocks = members.filter(isFreePool);
    const freePools: Member[] = (freePoolBlocks || []).filter(
      (freePool: Member) => freePool.ResourceBlockType.length > 0
    );

    setFreePoolBlocks(freePoolBlocks);
    setAvailableFreePools(freePools);

    return members.filter((m) => isUnused(m) && !isFreePool(m));
  };

  const prepareCapacityAndDescription = (members: Member[]) => {
    const filteredBlocks: Member[] = filterValidBlocks(members);
    filteredBlocks.forEach((member: Member) => {
      member.capacity = [];
      member.info = [];
      member.ResourceBlockType.forEach((resourceBlockType: string) => {
        if (resourceBlockType === "Processor" && member.Processors) {
          const descriptions = member.Processors?.map(
            (p) =>
              `(${getResourceBlockType([resourceBlockType])
                .charAt(0)
                .toUpperCase()})-[${p.Manufacturer || "-"}] [${
                p?.Model || "-"
              }]`
          );
          member.info.push(...descriptions);
          member.capacity.push(
            `${member.Summary.Processors?.Count || 0} of ${
              member.Summary.Processors?.TotalCores || 0
            } CORE(O)`,
            `${member.Summary?.Processors?.MaxSpeedMHz || 0}MHZ(O)`
          );
        }
        if (resourceBlockType === "Network" && member.NetworkInterfaces) {
          const descriptions = member.NetworkInterfaces.map(
            (n) =>
              `(${getResourceBlockType([resourceBlockType])
                .charAt(0)
                .toUpperCase()})-[${n.Manufacturer || "-"}] [${n.Model || "-"}]`
          );
          member.info.push(...descriptions);
          const capacities: string[] = member.NetworkInterfaces.flatMap((n) =>
            n.NetworkDeviceFunctions.map(
              (ndf) => `${ndf.Port.MaxSpeedGbps}Mbps(N)`
            )
          );
          member.capacity.push(...capacities);
        }
        if (resourceBlockType === "ComputerSystem" && member.ComputerSystems) {
          const descriptions = member.ComputerSystems?.map(
            (c) =>
              `(${getResourceBlockType([resourceBlockType])
                .charAt(0)
                .toUpperCase()})-[${c.Manufacturer || "-"}] [${
                c?.Model || "-"
              }]`
          );
          member.info.push(...descriptions);

          member.capacity.push(
            `${member.Summary.ComputerSystems?.Processor.Count || 0} of ${
              member.Summary.ComputerSystems?.Processor.TotalCores || 0
            }(D)`
          );
          member.capacity.push(
            `${member.Summary.ComputerSystems?.Memory.TotalSystemMemoryGiB}GB(M)`
          );
        }
        if (resourceBlockType === "Storage" && member.Storage) {
          const descriptions = member.Storage?.flatMap((s) =>
            s.StorageControllers.map(
              (sc) =>
                `(${getResourceBlockType([resourceBlockType])
                  .charAt(0)
                  .toUpperCase()})-[${sc.Manufacturer || "-"}] [${
                  sc?.Model || "-"
                }]`
            )
          );
          member.info.push(...descriptions);
          member.capacity.push(
            `${member.Summary.Storage?.CapacityGigaBytes || 0}GB(S)`
          );
        }
      });
    });
    return filteredBlocks;
  };

  const onConfirmRemoveResourceHandler = () => {
    attachDetachResource();
  };

  const onDeletePopUpBackDropClickHandler = () => {
    if (isAttachDetachInProgress) {
      return;
    }
    setAttachDetachError("");
    setResourceToDelete({} as Endpoint);
  };

  const onDeletePopUpCancelHandler = () => {
    if (isAttachDetachInProgress) {
      return;
    }
    setAttachDetachError("");
    setResourceToDelete({} as Endpoint);
  };

  const onCancelAttachFreePoolResource = () => {
    if (isAttachDetachInProgress) {
      return;
    }
    setShowFreePoolResourcePopUp(false);
    setResourceToAttach({} as Endpoint);
    setResourceToAttachFreePoolBlock({} as Member);
    setAttachDetachError("");
  };

  const onBackDropClickFreePoolResource = () => {
    if (isAttachDetachInProgress) {
      return;
    }
    setShowFreePoolResourcePopUp(false);
    setResourceToAttach({} as Endpoint);
    setResourceToAttachFreePoolBlock({} as Member);
    setAttachDetachError("");
  };

  const refresh = async () => {
    try {
      setRefreshing(true);
      await fetchZones();
      crawlManager();
    } finally {
      setRefreshing(false);
    }
  };

  const crawlManager = () => {
    if (selectedManager) {
      crawlManagerBydata(selectedManager)
        .then(async () => {
          await fetchResourceBlocks();
        })
        .catch((error) => console.log(error));
    }
  };

  const attachDetachResource = async () => {
    const isDeleteAction = !!(resourceToDelete && resourceToDelete.Id);
    try {
      setIsAttachDetachInProgress(true);
      const payLoad = {
        Action: isDeleteAction ? "DeleteResource" : "AddResource",
        EndPointId: isDeleteAction ? resourceToDelete.Id : resourceToAttach.Id,
        FreePoolId: !isDeleteAction ? resourceToAttachFreePoolBlock.Id : "",
      };
      await attachDetachResourceBlockById(
        currentRBToAttachOrDetachResource.Id,
        payLoad
      );
      setIsAnyActionInProgress(true);
      await fetchResourceBlocks();
      setResourceToDelete({} as Endpoint);
      setShowFreePoolResourcePopUp(false);
    } catch (e: any) {
      const defaultError = `Error ${
        isDeleteAction ? "Detaching" : "Attaching"
      }  resource ${
        isDeleteAction ? resourceToDelete.Name : resourceToAttach.Name
      }.`;
      setAttachDetachError(e ? e : defaultError);
    } finally {
      setIsAttachDetachInProgress(false);
      setResourceToAttach({} as Endpoint);
      setResourceToAttachFreePoolBlock({} as Member);
    }
  };

  return (
    <ResoruceBlockReConfigContext.Provider
      value={{
        zones,
        setZones,
        selectedZone,
        setSelectedZone,
        loading,
        loadingMessage,
        error,
        setError,
        racks,
        selectedRack,
        setSelectedRack,
        managers,
        selectedManager,
        setSelectedManager,
        resourceBlocksResponse,
        resourceBlocksByType,
        resourceBlockOptions,
        selectedResourceBlock,
        setSelectedResourceBlock,
        freePoolBlocks,
        availableFreePools,
        expandedResourceBlockType,
        setExpandedResourceBlockType,
        expandedResource,
        setExpandedResource,
        resourceToDelete,
        setResourceToDelete,
        onConfirmRemoveResourceHandler,
        onDeletePopUpBackDropClickHandler,
        onDeletePopUpCancelHandler,
        showFreePoolResourcePopup,
        setShowFreePoolResourcePopUp,
        onCancelAttachFreePoolResource,
        onBackDropClickFreePoolResource,
        setCurrentRBToAttachOrDetach,
        currentRBToAttachOrDetachResource,
        isAttachDetachInProgress,
        attachDetachError,
        setAttachDetachError,
        resourceToAttach,
        setResourceToAttach,
        resourceToAttachFreePoolBlock,
        setResourceToAttachFreePoolBlock,
        refresh,
        refreshing,
        expandedResourceBlock,
        setExpandedResourceBlock,
        isAnyActionInProgress,
      }}
    >
      {children}
    </ResoruceBlockReConfigContext.Provider>
  );
};

export default ResourceBlockReConfigContextProvider;
