import { useEffect, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import type {
  ComputerSystems,
  Description,
  Member,
  NetworkInterfaceSummary,
  Processors,
  RBTypeResp,
  ResourceBlock,
  StorageSummary,
} from "../Models/ResourceBlock";
import { CompositionState } from "../Models/ResourceBlock";

import ComposeNodeStepper from "./Components/ComposeNodeStepper";

import {
  fetchZoneRacksDataByQuery,
  fetchResourceBlocksByQuery,
} from "app/drut/api";
import type {
  RackByType,
  ZoneObj as Zone,
} from "app/store/drut/managers/types";

const ComposeNodeContent = (): JSX.Element => {
  const [zones, setZones] = useState([] as Zone[]);
  const [racks, setRacks] = useState({} as RackByType);
  const [selectedZoneName, setSelectedZoneName] = useState("");

  const [selectedZone, setSelectedZone] = useState("");
  const [enteredNodeName, setEnteredNodeName] = useState("");
  const [selectedIFICRack, setSelectedIFICRack] = useState("");
  const [selectedTFICRack, setSelectedTFICRack] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchingResourceBlocks, setFetchingResourceBlocks] = useState(false);
  const [resourceBlocksRefreshKey, setResourceBlocksRefreshKey] =
    useState(false);
  const [resourcesRefreshKey, setResourcesRefreshKey] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [error, setError] = useState("");
  const [resources, setResources] = useState([] as any);
  const [fqnn, setFqnn] = useState({
    uniqueFqnn: [{ label: "All", value: "All" }],
    selectedFqnn: "All",
  } as any);

  const [expandedResourceBlockRow, setExpandedResourceBlock] = useState("");
  const [expandedResourceType, setExpandedResourceType] = useState("");

  const [computeResourceBlocks, setComputeResourceBlocks] = useState(
    {} as RBTypeResp
  );
  const [targetResourceBlocks, setTargetResourceBlocks] = useState(
    {} as RBTypeResp
  );
  const [selectedResourceBlocks, setSelectedResourceBlocks] = useState(
    {} as RBTypeResp
  );
  const [isMaxPortCountLimitReached, setIsMaxPortCountLimitReached] =
    useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const abortController = new AbortController();

  useEffect(() => {
    fetchZones();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (typeof +selectedIFICRack === "number" && selectedZone) {
      fetchResourceBlocks("IFIC");
      return () => {
        abortController.abort();
      };
    }
  }, [selectedIFICRack]);

  useEffect(() => {
    if (resourceBlocksRefreshKey) {
      fetchResourceBlocks("IFIC", resourceBlocksRefreshKey);
      return () => {
        abortController.abort();
      };
    }
  }, [resourceBlocksRefreshKey]);

  useEffect(() => {
    let res = resources;
    if (fqnn.selectedFqnn !== "All") {
      res = resources.filter(
        (val: any) => val.Manager.Fqnn === fqnn.selectedFqnn
      );
    }
    const responseByType = getCheckedTargetResourceBlocks(getRespByType(res));
    setTargetResourceBlocks(responseByType);
  }, [fqnn.selectedFqnn]);

  useEffect(() => {
    if (
      activeStep === 2 &&
      selectedResourceBlocks.Compute &&
      selectedResourceBlocks?.Compute[0]?.Id &&
      Object.keys(selectedResourceBlocks).length === 1 &&
      Object.keys(targetResourceBlocks).length === 0
    ) {
      setFetchingResourceBlocks(true);
      fetchResourceBlocksByQuery(
        `?op=get_new_schema&ComputeBlockId=${selectedResourceBlocks.Compute[0].Id}`
      )
        .then((result: any) => {
          setResources(result.Links.Members);
          setTargetResourceBlocks(getRespByType(result.Links.Members));
          const uniqueFqnn = [
            ...new Set(
              result.Links.Members.map((val: any) => val.Manager.Fqnn)
            ),
          ];
          const values = [
            { label: "All", value: "All" },
            ...uniqueFqnn.map((val: any) => ({
              label: val,
              value: val,
            })),
          ];
          setFqnn({ uniqueFqnn: values, selectedFqnn: "All" });
          setFetchingResourceBlocks(false);
          setResourcesRefreshKey(false);
        })
        .catch((error: any) => {
          setFetchingResourceBlocks(false);
          setResourcesRefreshKey(false);
          setError(error);
        });
    }
  }, [activeStep]);

  useEffect(() => {
    if (resourcesRefreshKey) {
      fetchResourceBlocksByQuery(
        `?op=get_new_schema&ComputeBlockId=${selectedResourceBlocks.Compute[0].Id}`
      )
        .then((result: any) => {
          setResources(result.Links.Members);
          const responseByType = getCheckedTargetResourceBlocks(
            getRespByType(result.Links.Members)
          );
          setTargetResourceBlocks(responseByType);
          const uniqueFqnn = [
            ...new Set(
              result.Links.Members.map((val: any) => val.Manager.Fqnn)
            ),
          ];
          const values = [
            { label: "All", value: "All" },
            ...uniqueFqnn.map((val: any) => ({
              label: val,
              value: val,
            })),
          ];
          setFqnn({ uniqueFqnn: values, selectedFqnn: "All" });
          setFetchingResourceBlocks(false);
          setResourcesRefreshKey(false);
        })
        .catch((error: any) => {
          setFetchingResourceBlocks(false);
          setResourcesRefreshKey(false);
          setError(error);
        });
    }
  }, [resourcesRefreshKey]);

  useEffect(() => {
    if (selectedZone) {
      const zone: Zone | undefined = zones.find(
        (zone) => zone.zone_id === +selectedZone
      );
      setSelectedZoneName(zone?.zone_fqgn || "-");
      setRacks(zone?.racks as RackByType);
      if (!!zone?.racks.ific.length) {
        setSelectedIFICRack("0");
      } else {
        setSelectedIFICRack("");
      }
    }
  }, [selectedZone]);

  const getCheckedTargetResourceBlocks = (response: RBTypeResp) => {
    const responseByType = response;
    const selectedIdTypes = Object.keys(selectedResourceBlocks).filter(
      (type: string) => type !== "Compute"
    );
    if (selectedIdTypes.length) {
      selectedIdTypes.forEach((type: string) => {
        const selectedIds: string[] = selectedResourceBlocks[type].map(
          (rb: Member) => rb.Id
        );
        const selectedForTypeMembers = responseByType[type].map(
          (rb: Member) => {
            return {
              ...rb,
              checked: selectedIds.includes(rb.Id),
            };
          }
        );
        responseByType[type] = selectedForTypeMembers;
      });
    }
    return responseByType;
  };

  const fetchZones = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Loading...");
      const response: Zone[] = await fetchZoneRacksDataByQuery(
        "op=get_zones_and_racks_by_rack_type",
        abortController.signal
      );
      const notDefaultZone = (zone: Zone) =>
        zone.zone_name.toLowerCase() !== "default_zone";
      setZones(response.filter(notDefaultZone));
    } catch (e: any) {
      const defaultError = "Error fetching Zones.";
      setError(e ? e : defaultError);
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceBlocks = async (
    managerType: string,
    isRefreshAction?: boolean
  ) => {
    try {
      if (!isRefreshAction) setFetchingResourceBlocks(true);
      let params = {
        op: "get_new_schema",
        ZoneId: selectedZone,
        ManagerType: managerType,
      };
      if (activeStep === 1 && +selectedIFICRack !== 0) {
        params = { ...{ ...params, RackId: +selectedIFICRack } };
      } else if (activeStep === 2 && +selectedTFICRack !== 0) {
        params = { ...{ ...params, RackId: +selectedTFICRack } };
      }
      let queryParam: string = Object.keys(params)
        .map((key: string) => key + "=" + params[key as keyof typeof params])
        .join("&");
      if (managerType == "TFIC") {
        queryParam += `&ManagerType=PRU`;
      }
      const response: ResourceBlock = await fetchResourceBlocksByQuery(
        `?${queryParam}`,
        abortController.signal
      );
      if (managerType === "IFIC") {
        if (isRefreshAction) {
          const responseByType = getRespByType(response.Links.Members);
          if (selectedResourceBlocks["Compute"].length) {
            const selectedId = selectedResourceBlocks["Compute"][0]?.Id;
            const computeTypeResources = responseByType?.Compute;
            const check = computeTypeResources.find(
              (rb: Member) => rb.Id === selectedId
            );
            if (check) {
              check.checked = true;
            }
            responseByType["Compute"] = computeTypeResources;
          }
          setComputeResourceBlocks(responseByType);
        } else {
          setComputeResourceBlocks(getRespByType(response.Links.Members));
          setSelectedResourceBlocks((resourceBlocks: RBTypeResp) => {
            delete resourceBlocks["Compute"];
            return { ...resourceBlocks };
          });
        }
      } else if (managerType === "TFIC") {
        setTargetResourceBlocks(getRespByType(response.Links.Members));
        setSelectedResourceBlocks((resourceBlocks: RBTypeResp) => {
          Object.keys(resourceBlocks)
            .filter((key: string) => key !== "Compute")
            .forEach((key: string) => delete resourceBlocks[key]);
          return { ...resourceBlocks };
        });
      }
    } catch (e: any) {
      const defaultError = "Error fetching Resource Blocks.";
      setError(e ? e : defaultError);
    } finally {
      setFetchingResourceBlocks(false);
      setResourceBlocksRefreshKey(false);
    }
  };

  const getRBType = (resourceBlockType = "") => {
    switch (resourceBlockType) {
      case "Processor" || "Processors":
        return "Offload";
      case "ComputerSystem" || "ComputerSystems":
        return "DPU";
      default:
        return resourceBlockType;
    }
  };

  const getRespByType = (rbMembers: Member[]): RBTypeResp => {
    return prepCapacityAndDesp(rbMembers).reduce(
      (prev: RBTypeResp, curr: Member) => {
        const rbType: string = getRBType(curr.ResourceBlockType[0]);
        return {
          ...prev,
          [rbType]: [...(prev[rbType] || []), curr],
        };
      },
      {}
    );
  };

  const prepCapacityAndDesp = (rbMembers: Member[]) => {
    const isUnused = (v: Member) =>
      v.CompositionStatus.CompositionState === CompositionState.UNUSED;
    const unusedResourceBlocks: Member[] = rbMembers.filter(isUnused);
    unusedResourceBlocks.forEach((member: Member) => {
      member.capacity = [];
      member.info = [];
      member.Description.forEach((d: Description) => {
        member.info.push(
          `(${getRBType(d.ResourceBlockType).charAt(0).toUpperCase()})-[${
            d?.Manufacturer || "-"
          }] [${d?.Model || "-"}]`
        );
        if (
          member?.Summary?.Processors &&
          d.ResourceBlockType === "Processor"
        ) {
          const o: Processors = member.Summary.Processors;
          member.capacity.push(`${o.Count} of ${o.TotalCores} CORE(O)`);
          member.capacity.push(`${o.MaxSpeedMHz}MHZ(O)`);
        }
        if (
          member?.Summary?.NetworkInterfaces &&
          d.ResourceBlockType === "Network"
        ) {
          const n: NetworkInterfaceSummary = member.Summary.NetworkInterfaces;
          member.capacity.push(`${n.MaxSpeedGbps}Mbps(N)`);
        }
        if (member?.Summary?.Storage && d.ResourceBlockType === "Storage") {
          const s: StorageSummary = member.Summary.Storage;
          member.capacity.push(`${s.CapacityGigaBytes}GB(S)`);
        }
        if (
          member?.Summary?.ComputerSystems &&
          d.ResourceBlockType.includes("Compute")
        ) {
          const c: ComputerSystems = member.Summary.ComputerSystems;
          const key: string = member.ResourceBlockType.includes("Compute")
            ? "C"
            : "D";
          member.capacity.push(
            `${c.Processor.Count} of ${c.Processor.TotalCores}(${key})`
          );
          member.capacity.push(`${c.Memory.TotalSystemMemoryGiB}GB(M)`);
        }
      });
    });
    return unusedResourceBlocks;
  };

  const errorValue = error?.toString();

  return (
    <>
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification onDismiss={() => setError("")} inline severity="negative">
          {errorValue}
        </Notification>
      )}
      {loading ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text={loadingMessage}
            key={`managerListSpinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <div>
          <ComposeNodeStepper
            zones={zones}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            racks={racks}
            selectedIFICRack={selectedIFICRack}
            selectedTFICRack={selectedTFICRack}
            setSelectedIFICRack={setSelectedIFICRack}
            setSelectedTFICRack={setSelectedTFICRack}
            computeResourceBlocks={computeResourceBlocks}
            targetResourceBlocks={targetResourceBlocks}
            expandedResourceBlockRow={expandedResourceBlockRow}
            setExpandedResourceBlock={setExpandedResourceBlock}
            expandedResourceType={expandedResourceType}
            setExpandedResourceType={setExpandedResourceType}
            enteredNodeName={enteredNodeName}
            setEnteredNodeName={setEnteredNodeName}
            selectedResourceBlocks={selectedResourceBlocks}
            setSelectedResourceBlocks={setSelectedResourceBlocks}
            isMaxPortCountLimitReached={isMaxPortCountLimitReached}
            setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
            setTargetResourceBlocks={setTargetResourceBlocks}
            selectedZoneName={selectedZoneName}
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            fetchingResourceBlocks={fetchingResourceBlocks}
            fqnn={fqnn}
            setFqnn={setFqnn}
            resourceBlocksRefreshKey={resourceBlocksRefreshKey}
            setResourceBlocksRefreshKey={setResourceBlocksRefreshKey}
            resourcesRefreshKey={resourcesRefreshKey}
            setResourcesRefreshKey={setResourcesRefreshKey}
          />
        </div>
      )}
    </>
  );
};
export default ComposeNodeContent;
