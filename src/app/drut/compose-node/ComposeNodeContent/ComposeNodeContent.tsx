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

import { fetchData, fetchResources } from "app/drut/config";
import type {
  RackByType,
  Zone,
} from "app/drut/fabricManagement/FabricManagementContent/Managers/AddManager/type";

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
    let res = resources;
    if (fqnn.selectedFqnn !== "All") {
      res = resources.filter(
        (val: any) => val.Manager.Fqnn === fqnn.selectedFqnn
      );
    }
    setTargetResourceBlocks(getRespByType(res));
  }, [fqnn.selectedFqnn]);

  useEffect(() => {
    if (
      activeStep === 2 &&
      selectedResourceBlocks.Compute &&
      selectedResourceBlocks?.Compute[0]?.Id
    ) {
      setFetchingResourceBlocks(true);
      fetchResources(null, selectedResourceBlocks.Compute[0].Id)
        .then((response: any) => response.json())
        .then(
          (result: any) => {
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
          },
          (error: any) => {
            setFetchingResourceBlocks(false);
            setError(error);
          }
        );
    }
  }, [activeStep]);

  useEffect(() => {
    if (selectedZone) {
      const zone: Zone | undefined = zones.find(
        (zone) => zone.zone_id === +selectedZone
      );
      setSelectedZoneName(zone?.zone_fqgn || "-");
      setRacks(zone?.racks as RackByType);
      if (!!(zone?.racks as RackByType).ific.length) {
        setSelectedIFICRack("0");
      } else {
        setSelectedIFICRack("");
      }
    }
  }, [selectedZone]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Loading...");
      const promise = await fetchData(
        "dfab/nodegroups/?op=get_zones_and_racks_by_rack_type",
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        const response: Zone[] = await promise.json();
        const notDefaultZone = (zone: Zone) =>
          zone.zone_name.toLowerCase() !== "default_zone";
        setZones(response.filter(notDefaultZone));
      } else {
        const apiError: string = await promise.text();
        const defaultError = "Error fetching Zones.";
        setError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceBlocks = async (managerType: string) => {
    try {
      setFetchingResourceBlocks(true);
      const url = "dfab/resourceblocks/?";
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
      const promise = await fetchData(
        url.concat(queryParam),
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        const response: ResourceBlock = await promise.json();
        if (managerType === "IFIC") {
          setComputeResourceBlocks(getRespByType(response.Links.Members));
          setSelectedResourceBlocks((resourceBlocks: RBTypeResp) => {
            delete resourceBlocks["Compute"];
            return { ...resourceBlocks };
          });
        } else if (managerType === "TFIC") {
          setTargetResourceBlocks(getRespByType(response.Links.Members));
          setSelectedResourceBlocks((resourceBlocks: RBTypeResp) => {
            Object.keys(resourceBlocks)
              .filter((key: string) => key !== "Compute")
              .forEach((key: string) => delete resourceBlocks[key]);
            return { ...resourceBlocks };
          });
        }
      } else {
        const apiError: string = await promise.text();
        const defaultError = "Error fetching Resource Blocks.";
        setError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setFetchingResourceBlocks(false);
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

  return (
    <>
      {error && error.length && (
        <Notification
          inline
          key={`notification_${Math.random()}`}
          onDismiss={() => setError("")}
          severity="negative"
        >
          {error}
        </Notification>
      )}
      {loading ? (
        <Notification
          inline
          key={`notification_${Math.random()}`}
          severity="information"
        >
          <Spinner
            key={`managerListSpinner_${Math.random()}`}
            text={loadingMessage}
          />
        </Notification>
      ) : (
        <div>
          <ComposeNodeStepper
            activeStep={activeStep}
            computeResourceBlocks={computeResourceBlocks}
            enteredNodeName={enteredNodeName}
            expandedResourceBlockRow={expandedResourceBlockRow}
            expandedResourceType={expandedResourceType}
            fetchingResourceBlocks={fetchingResourceBlocks}
            fqnn={fqnn}
            isMaxPortCountLimitReached={isMaxPortCountLimitReached}
            racks={racks}
            selectedIFICRack={selectedIFICRack}
            selectedResourceBlocks={selectedResourceBlocks}
            selectedTFICRack={selectedTFICRack}
            selectedZone={selectedZone}
            selectedZoneName={selectedZoneName}
            setActiveStep={setActiveStep}
            setEnteredNodeName={setEnteredNodeName}
            setExpandedResourceBlock={setExpandedResourceBlock}
            setExpandedResourceType={setExpandedResourceType}
            setFqnn={setFqnn}
            setIsMaxPortCountLimitReached={setIsMaxPortCountLimitReached}
            setSelectedIFICRack={setSelectedIFICRack}
            setSelectedResourceBlocks={setSelectedResourceBlocks}
            setSelectedTFICRack={setSelectedTFICRack}
            setSelectedZone={setSelectedZone}
            targetResourceBlocks={targetResourceBlocks}
            zones={zones}
          />
        </div>
      )}
    </>
  );
};
export default ComposeNodeContent;
