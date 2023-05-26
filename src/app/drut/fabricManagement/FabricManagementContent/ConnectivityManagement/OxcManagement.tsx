import * as React from "react";
import { useEffect, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import type {
  Manager,
  OpticalSwitch,
  FicManager,
  OxcPort,
  OxcPortOption,
  UpdateConnectivity,
  connectivityPorts,
  ConnectedOpticalSwitch,
  PcieSwitchPortFields,
} from "../../Models/Manager";
import classess from "../../fabricManagement.module.scss";
import type { Rack, RackByType, Zone } from "../Managers/AddManager/type";

import ConnectivityManagementTable from "./Components/ConnectivityManagementTable";
import HeaderSelections from "./Components/HeaderSelections";
import ImportExportCsvBtns from "./Components/ImportExportCsvBtns";
import Save from "./Components/Save";

import { fetchData, postData, uploadFile } from "app/drut/config";
import DeleteConfirmationModal from "app/utils/Modals/DeleteConfirmationModal";

const OxcManagement = (): JSX.Element => {
  const [zones, setZones] = useState([] as Zone[]);
  const [iFicPools, setIFicPools] = useState([] as Rack[]);
  const [tFicPools, setTFicPools] = useState([] as Rack[]);

  const [selectedZone, setSelectedZone] = useState("");
  const [selectedIFicPool, setSelectedIFicPool] = useState("");
  const [selectedTFicPool, setSelectedTFicPool] = useState("");

  const [iFicResponse, setIFicResponse] = useState([] as FicManager[]);
  const [oxcResponse, setOxcResponse] = useState([] as OpticalSwitch[]);
  const [tFicResponse, setTFicResponse] = useState([] as FicManager[]);

  const [oxcPortOptions, setOxcPortOptions] = useState([] as OxcPortOption[]);

  const [expandedIficAccordion, setIficAccordion] = useState("");
  const [expandedOxcAccordion, setOxcAccordion] = useState("");
  const [expandedTficAccordion, setTficAccordion] = useState("");

  const [error, setError] = useState("");
  const [clearAllConnectionsError, setClearAllConnectionsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [
    clearingAllConnectionsInProgress,
    SetClearingAllConnectionsInProgress,
  ] = useState(false);
  const [fetchingConnectivityResponse, setFetchingConnectivityResponse] =
    useState(false);
  const [uploadingInProgress, setUploadingInProgress] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const abortController = new AbortController();

  const [oxcToClearAll, setOxcToClearAll] = useState({} as OpticalSwitch);
  const [ficToClearAll, setFicToClearAll] = useState({} as FicManager);

  const [fileToImportPeerConnections, setFileToImportPeerConnections] =
    useState({} as FileList | null);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    const zone: Zone | undefined = zones.find(
      (zone: Zone) => zone.zone_id === +selectedZone
    );
    if (zone) {
      setSelectedIFicPool("");
      setSelectedTFicPool("");
      setIFicResponse([]);
      setTFicResponse([]);
      setIFicPools((zone.racks as RackByType).ific);
      setTFicPools((zone.racks as RackByType).tfic);
    }
    fetchConnectivityInformation({ zone_id: selectedZone });
    return () => abortController.abort();
  }, [selectedZone]);

  useEffect(() => {
    if (selectedIFicPool) {
      fetchConnectivityInformation({ ific_rack_id: selectedIFicPool });
    }
  }, [selectedIFicPool]);

  useEffect(() => {
    if (selectedTFicPool) {
      fetchConnectivityInformation({ tfic_rack_id: selectedTFicPool });
    }
  }, [selectedTFicPool]);

  useEffect(() => {
    const defaultPortOption = {
      fqnn: "",
      optionLable: "",
      port: "",
      rx: "",
      tx: "",
      title: "",
    } as OxcPortOption;
    const oxcPortOptions: OxcPortOption[] = oxcResponse.flatMap(
      (oxc: OpticalSwitch) => {
        const freePorts = oxc.ports.filter(
          (oxcPort: OxcPort) => !oxcPort.connectedPcie
        );
        oxc.freePorts = freePorts.length;
        return freePorts.map((oxcPort: OxcPort) => {
          return {
            title: `${oxc.rack_name}.${oxc.name}`,
            tx: oxcPort.tx,
            rx: oxcPort.rx,
            port: `${oxcPort.rx}-${oxcPort.tx}`,
            optionLable: `(${oxcPort.rx}-${oxcPort.tx}) ${oxc.name}`,
            fqnn: oxc.fqnn,
          };
        });
      }
    );
    setOxcPortOptions([...oxcPortOptions, defaultPortOption]);
  }, [oxcResponse]);

  const setFreePortsCount = (ficResponse: FicManager[]) => {
    const filterFreeSwitchPorts = (pcieSwitchPort: PcieSwitchPortFields) =>
      !pcieSwitchPort.optical_switch || !pcieSwitchPort.optical_switch.fqnn;
    ficResponse.forEach((fic) => {
      const pcieSwichPortKeys = Object.keys(fic.switches);
      fic.totalPorts = pcieSwichPortKeys.reduce(
        (acc: number, pcieSwitchKey: string) =>
          Object.keys(fic.switches[pcieSwitchKey]).length + acc,
        0
      );
      fic.freePorts = pcieSwichPortKeys.reduce(
        (acc: number, pcieSwitchKey: string) =>
          Object.keys(fic.switches[pcieSwitchKey]).filter((pcieSwithPortKey) =>
            filterFreeSwitchPorts(fic.switches[pcieSwitchKey][pcieSwithPortKey])
          ).length + acc,
        0
      );
    });
  };

  useEffect(() => {
    if (iFicResponse && iFicResponse.length) {
      setFreePortsCount(iFicResponse);
    }
  }, [iFicResponse]);

  useEffect(() => {
    if (tFicResponse && tFicResponse.length) {
      setFreePortsCount(tFicResponse);
    }
  }, [tFicResponse]);

  useEffect(() => {
    if (tFicResponse && tFicResponse.length) {
      setFreePortsCount(tFicResponse);
    }
  }, [tFicResponse]);

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

  const onClickSave = () => {
    window.scrollTo(0, 0);
    const modifiedOpticalSwitches: UpdateConnectivity[] = oxcResponse
      .filter((oxc: OpticalSwitch) =>
        oxc.ports.some(
          (oxcPort: OxcPort) => oxcPort.connectedPcie?.isNewlyAdded
        )
      )
      .map((oxc: OpticalSwitch) => {
        return {
          oxcId: oxc.fqnn,
          ports: oxc.ports
            .filter((oxcPort: OxcPort) => oxcPort.connectedPcie?.isNewlyAdded)
            .map((oxcPort: OxcPort) => {
              return {
                tx: oxcPort.tx,
                rx: oxcPort.rx,
                switchId: `${oxcPort.connectedPcie?.manager_fqnn}.${oxcPort.connectedPcie?.pcie_switch}`,
                switchPort: oxcPort.connectedPcie?.pcie_switch_port,
              };
            }),
        };
      });

    updateConnectivity(modifiedOpticalSwitches);
  };

  const updateConnectivity = async (payLoad: UpdateConnectivity[]) => {
    try {
      setLoading(true);
      setLoadingMessage("Updating Connectivity Information");
      const promise = await postData("/dfab/connectivity/", payLoad);
      if (promise.status === 200) {
        await fetchConnectivityInformation();
      } else {
        const apiError: string = promise.text();
        setError(
          apiError
            ? apiError
            : "Failed to Update Opitcal Switch Connections. Please try again."
        );
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const removeOxcConnectionHandler = (oxc: OpticalSwitch, oxcPort: OxcPort) => {
    setOxcResponse((prev: OpticalSwitch[]) => {
      prev.find((p) => p.fqnn === oxc.fqnn);
      return [...prev];
    });

    if (oxcPort.connectedPcie) {
      const payLoad: UpdateConnectivity[] = [
        { oxcId: oxc.fqnn, ports: [getConnectedOxcPort(oxcPort)] },
      ];
      oxcPort.connectedPcie.isNewlyAdded
        ? updateFicResponses(payLoad)
        : removeOxcConnection(payLoad);
    }
  };

  const setPortsToRemoveInProgress = (payLoad: UpdateConnectivity[]) => {
    payLoad.forEach((value) => {
      const connTxPorts = value.ports.map((p) => p.tx);
      setOxcResponse((oxcResponse) => {
        const oxc = oxcResponse.find((o) => o.fqnn === value.oxcId);
        if (oxc) {
          oxc.ports
            .filter((oxcPort) => connTxPorts.includes(oxcPort.tx))
            .forEach((oxcPort) => {
              oxcPort.isRemoving = true;
              if (oxcPort.connectedPcie?.manager_type === "IFIC") {
                setIFicResponse((ificResponse) => [
                  ...getFicResponseWithInProgressPorts(ificResponse, oxcPort),
                ]);
              } else {
                setTFicResponse((ificResponse) => [
                  ...getFicResponseWithInProgressPorts(ificResponse, oxcPort),
                ]);
              }
            });
        }
        return [...oxcResponse];
      });
    });
  };

  const getConnectedOxcPort = (oxcPort: OxcPort): connectivityPorts => {
    return {
      tx: oxcPort.tx,
      rx: oxcPort.rx,
      switchId: `${oxcPort.connectedPcie?.manager_fqnn}.${oxcPort.connectedPcie?.pcie_switch}`,
      switchPort: oxcPort.connectedPcie?.pcie_switch_port,
    };
  };

  const onClickClearAllPeerPortConnectionsHandler = (oxc: OpticalSwitch) => {
    setOxcToClearAll(oxc);
  };

  const clearAllPeerConnections = () => {
    if (Object.keys(oxcToClearAll).length > 0) {
      clearOxcPeerConnections();
    } else if (Object.keys(ficToClearAll).length) {
      clearAllFicPeerConnections();
    }
  };

  const clearOxcPeerConnections = () => {
    const connectedOxcPorts: connectivityPorts[] = oxcToClearAll.ports
      .filter((port) => port.connectedPcie && !port.connectedPcie.isNewlyAdded)
      .map(getConnectedOxcPort);

    if (connectedOxcPorts && connectedOxcPorts.length > 0) {
      const payLoad: UpdateConnectivity[] = [
        { oxcId: oxcToClearAll.fqnn, ports: connectedOxcPorts },
      ];
      removeOxcConnection(payLoad);
    }
  };

  const removeOxcConnection = async (payLoad: UpdateConnectivity[]) => {
    try {
      setPortsToRemoveInProgress(payLoad);
      SetClearingAllConnectionsInProgress(true);
      const promise = await postData(
        "dfab/connectivity/?op=delete_peer_connections",
        payLoad
      );

      if (promise.status === 200) {
        /**
         * Commenting temporarily till BE throws an error for in use oxc port
         * updateFicResponses(payLoad);
         */
        fetchConnectivityInformation();
      } else {
        setError(promise.text());
        const apiError = await promise.text();
        const defaultError = "Failed to remove peer connections";
        setClearAllConnectionsError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setClearAllConnectionsError(e);
    } finally {
      SetClearingAllConnectionsInProgress(false);
      resetSelectedPopupValue();
    }
  };

  const updateFicResponses = (payLoad: UpdateConnectivity[]) => {
    payLoad.forEach((value) => {
      const connTxPorts = value.ports.map((p) => p.tx);
      setOxcResponse((oxcResponse) => {
        const oxc = oxcResponse.find((o) => o.fqnn === value.oxcId);
        if (oxc) {
          oxc.ports
            .filter((oxcPort) => connTxPorts.includes(oxcPort.tx))
            .forEach((oxcPort) => {
              if (oxcPort.connectedPcie?.manager_type === "IFIC") {
                setIFicResponse((ificResponse) => [
                  ...getUpdatedFicResponse(ificResponse, oxcPort),
                ]);
              } else {
                setTFicResponse((ificResponse) => [
                  ...getUpdatedFicResponse(ificResponse, oxcPort),
                ]);
              }
            });
        }
        return [...oxcResponse];
      });
    });
  };

  const getUpdatedFicResponse = (
    ficResponse: FicManager[],
    oxcPort: OxcPort
  ) => {
    const ficManager = ficResponse.find(
      (ific) => ific.fqnn === oxcPort.connectedPcie?.manager_fqnn
    );
    if (ficManager) {
      const portFields =
        ficManager.switches[oxcPort.connectedPcie?.pcie_switch || ""][
          oxcPort.connectedPcie?.pcie_switch_port || ""
        ];
      portFields.optical_switch = {} as ConnectedOpticalSwitch;
      portFields.tx = "";
      portFields.rx = "";
    }
    oxcPort.connectedPcie = null;
    return ficResponse;
  };

  const getFicResponseWithInProgressPorts = (
    ficResponse: FicManager[],
    oxcPort: OxcPort
  ) => {
    const ficManager = ficResponse.find(
      (ific) => ific.fqnn === oxcPort.connectedPcie?.manager_fqnn
    );
    if (ficManager) {
      const portFields =
        ficManager.switches[oxcPort.connectedPcie?.pcie_switch || ""][
          oxcPort.connectedPcie?.pcie_switch_port || ""
        ];
      portFields.isRemoving = true;
    }
    return ficResponse;
  };

  const fetchConnectivityInformation = async (
    queryType?:
      | {
          [key: string]: string;
        }
      | undefined
  ) => {
    try {
      setFetchingConnectivityResponse(true);
      const url = "dfab/connectivity/?";
      const params = queryType
        ? queryType
        : {
            ific_rack_id: selectedIFicPool,
            tfic_rack_id: selectedTFicPool,
            zone_id: selectedZone,
          };
      const queryParam: string = Object.keys(params)
        .filter((key) => !!params[key as keyof typeof params])
        .map((key: string) => key + "=" + params[key as keyof typeof params])
        .join(queryType ? "" : "&");
      const promise = await fetchData(url.concat(queryParam));
      if (promise.status === 200) {
        const response: Manager = await promise.json();
        if (queryType) {
          const key: string = Object.keys(queryType)[0];
          if (key.includes("ific")) {
            setIFicResponse(response["IFIC"]);
          } else if (key.includes("tfic")) {
            setTFicResponse(response["TFIC"]);
          } else {
            setOxcResponse(response["OXC"]);
          }
        } else {
          setIFicResponse(response["IFIC"]);
          setOxcResponse(response["OXC"]);
          setTFicResponse(response["TFIC"]);
        }
      } else {
        setError(promise.text());
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setFetchingConnectivityResponse(false);
    }
  };

  const resetSelectedPopupValue = () => {
    setOxcToClearAll({} as OpticalSwitch);
    setFicToClearAll({} as FicManager);
  };

  const removeFicPeerPort = (
    fic: FicManager,
    pcieSwitchKey: string,
    pcieSwitchPortKey: string
  ) => {
    const pcieSwitchPortFields = fic.switches[pcieSwitchKey][pcieSwitchPortKey];
    const payLoad: UpdateConnectivity[] = [
      {
        oxcId: pcieSwitchPortFields.optical_switch.fqnn,
        ports: [
          getConnectedOxcPortForFic(
            fic,
            pcieSwitchKey,
            pcieSwitchPortKey,
            pcieSwitchPortFields
          ),
        ],
      },
    ];
    removeOxcConnection(payLoad);
  };

  const getConnectedOxcPortForFic = (
    fic: FicManager,
    pcieSwitchKey: string,
    pcieSwitchPortKey: string,
    pcieSwitchPortFields: PcieSwitchPortFields
  ) => {
    return {
      tx: pcieSwitchPortFields.tx,
      rx: pcieSwitchPortFields.rx,
      switchId: `${fic.fqnn}.${pcieSwitchKey}`,
      switchPort: pcieSwitchPortKey,
    };
  };

  const clearAllFicPeerConnectionsHandler = (fic: FicManager) => {
    setFicToClearAll(fic);
  };

  const clearAllFicPeerConnections = () => {
    const filterConnectedPorts = (pciePortField: PcieSwitchPortFields) =>
      pciePortField.optical_switch?.name;

    const payLoad: UpdateConnectivity[] = Object.keys(
      ficToClearAll.switches
    ).flatMap((pcieSwitchKey) => {
      return Object.keys(ficToClearAll.switches[pcieSwitchKey])
        .filter((pcieSwitchPortKey) =>
          filterConnectedPorts(
            ficToClearAll.switches[pcieSwitchKey][pcieSwitchPortKey]
          )
        )
        .map((pcieSwitchPortKey) => {
          const portFieldValues: PcieSwitchPortFields =
            ficToClearAll.switches[pcieSwitchKey][pcieSwitchPortKey];
          return {
            oxcId: portFieldValues.optical_switch.fqnn,
            ports: [
              getConnectedOxcPortForFic(
                ficToClearAll,
                pcieSwitchKey,
                pcieSwitchPortKey,
                portFieldValues
              ),
            ],
          };
        });
    });
    removeOxcConnection(payLoad);
  };

  const onImportFile = (files: FileList | null) => {
    setFileToImportPeerConnections(files);
  };

  const onClickCsvUpload = () => {
    uploadPeerConnsCsv();
  };

  const uploadPeerConnsCsv = async () => {
    if (fileToImportPeerConnections) {
      const file = fileToImportPeerConnections[0];
      try {
        const formData = new FormData();
        formData.append(`file`, file);
        setUploadingInProgress(true);
        const promise: Response = await uploadFile(
          "dfab/connectivity/?op=import_csv",
          formData
        );
        if (promise.ok) {
          setFileToImportPeerConnections(null);
          if (selectedIFicPool || selectedTFicPool || selectedZone) {
            fetchConnectivityInformation();
          }
        } else {
          const apiError: string = await promise.text();
          const defaultError = `Failed to upload ${file.name}`;
          setError(apiError ? apiError : defaultError);
        }
      } catch (e: any) {
        const defaultError = `Failed to upload ${file.name}`;
        setError(e ? e : defaultError);
      } finally {
        setUploadingInProgress(false);
      }
    }
  };

  return (
    <>
      {error && error.length && (
        <Notification
          key={`notification_${Math.random()}`}
          onDismiss={() => setError("")}
          inline
          severity="negative"
        >
          {error}
        </Notification>
      )}
      {loading && (
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
      )}
      <div
        className={`${classess.oxc_management_content} ${
          loading ? classess.loading : ""
        }`}
      >
        <div className={classess.oxc_management_header_content}>
          <HeaderSelections
            zones={zones}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            iFicPools={iFicPools}
            selectedIFicPool={selectedIFicPool}
            setSelectedIFicPool={setSelectedIFicPool}
            tFicPools={tFicPools}
            selectedTFicPool={selectedTFicPool}
            setSelectedTFicPool={setSelectedTFicPool}
          />
          <ImportExportCsvBtns
            onImportFile={onImportFile}
            fileToImportPeerConnections={fileToImportPeerConnections}
            onClickCsvUpload={onClickCsvUpload}
            uploadingInProgress={uploadingInProgress}
          />
        </div>
        {selectedZone ? (
          <div className={classess.connectivity_management_table}>
            {fetchingConnectivityResponse && (
              <Notification
                key={`notification_${Math.random()}`}
                inline
                severity="information"
              >
                <Spinner
                  text="Fetching connectivity Information..."
                  key={`managerListSpinner_${Math.random()}`}
                />
              </Notification>
            )}
            {(Object.keys(oxcToClearAll).length > 0 ||
              Object.keys(ficToClearAll).length > 0) && (
              <DeleteConfirmationModal
                title="Delete Confirmation"
                message={`All the peer connections from "${
                  "fqnn" in oxcToClearAll
                    ? oxcToClearAll.fqnn
                    : ficToClearAll.fqnn
                }" will be removed. Are you sure ?`}
                onConfirm={clearAllPeerConnections}
                onClickBackDrop={resetSelectedPopupValue}
                onClickCancel={resetSelectedPopupValue}
                isActionInProgress={clearingAllConnectionsInProgress}
                inProgressMessage={"Removing..."}
                error={clearAllConnectionsError}
                setError={setClearAllConnectionsError}
              />
            )}
            <ConnectivityManagementTable
              iFicData={iFicResponse}
              oxcData={oxcResponse}
              tFicData={tFicResponse}
              oxcPortOptions={oxcPortOptions}
              fetchingConnectivityResponse={fetchingConnectivityResponse}
              setOxcResponse={setOxcResponse}
              expandedIficAccordion={expandedIficAccordion}
              setIficAccordion={setIficAccordion}
              expandedOxcAccordion={expandedOxcAccordion}
              setOxcAccordion={setOxcAccordion}
              expandedTficAccordion={expandedTficAccordion}
              setTficAccordion={setTficAccordion}
              zones={zones}
              selectedZone={selectedZone}
              selectedIFicPool={selectedIFicPool}
              selectedTFicPool={selectedTFicPool}
              removeOxcConnection={removeOxcConnectionHandler}
              onClickClearAllPeerPortConnections={
                onClickClearAllPeerPortConnectionsHandler
              }
              setIFicResponse={setIFicResponse}
              setTFicResponse={setTFicResponse}
              removeFicPeerPort={removeFicPeerPort}
              clearAllFicPeerConnections={clearAllFicPeerConnectionsHandler}
            />
          </div>
        ) : (
          <div className={classess.no_selection}>
            Please select Zone and Pools to manage the oxc connectivity.
          </div>
        )}
      </div>
      <Save oxcData={oxcResponse} onClickSave={onClickSave} loading={loading} />
    </>
  );
};

export default OxcManagement;
