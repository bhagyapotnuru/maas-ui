import * as React from "react";
import { useState } from "react";
import type { SetStateAction } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Autocomplete from "@mui/material/Autocomplete";
import type { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { fetchData, postData } from "app/drut/config";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

import type {
  Manager,
  OpticalSwitch,
  FicManager,
  OxcPort,
  OxcPortOption,
  ConnectedPcie,
  PcieSwitchPortFields,
  ConnectedOpticalSwitch,
  UpdateConnectivity,
} from "../../Models/Manager";
import classess from "../../fabricManagement.module.css";
import type { Rack, Zone } from "../Managers/AddManager/type";

type ZoneSelectionProps = {
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (selectedZone: string) => void;
};

type IFicPoolSelectionProps = {
  iFicPools: Rack[];
  selectedIFicPool: string;
  selectedZone: string;
  setSelectedIFicPool: (selectedIFicPool: string) => void;
};

type TFicPoolSelectionProps = {
  tFicPools: Rack[];
  selectedTFicPool: string;
  selectedZone: string;
  setSelectedTFicPool: (selectedTFicPool: string) => void;
};

const ZoneSelect = ({
  zones = [],
  selectedZone,
  setSelectedZone,
}: ZoneSelectionProps): JSX.Element => {
  return (
    <FormControl
      size="small"
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      variant="standard"
    >
      <InputLabel id="zone-select">Zone</InputLabel>
      <Select
        className={classess.select_value}
        id="zone-select"
        label=""
        labelId="zone-select"
        onChange={(e: SelectChangeEvent<string>) => {
          setSelectedZone(e.target.value);
        }}
        value={`${selectedZone}`}
        variant="standard"
      >
        {zones.length === 0 && (
          <MenuItem>
            <em>No Zones available</em>
          </MenuItem>
        )}
        {zones.map((zone: Zone) => (
          <MenuItem
            className={classess.header_selection_menu_item}
            key={zone.zone_id}
            value={zone.zone_id}
          >
            {zone.zone_fqgn}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const IFicPoolSelect = ({
  iFicPools = [],
  selectedIFicPool,
  selectedZone,
  setSelectedIFicPool,
}: IFicPoolSelectionProps): JSX.Element => {
  return (
    <FormControl
      size="small"
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      variant="standard"
    >
      <InputLabel id="ific-pool-select">Rack</InputLabel>
      <Select
        autoFocus={false}
        className={classess.select_value}
        id="ific-pool-select"
        label={`IFIC Pool`}
        labelId="ific-pool-select"
        onChange={(e: SelectChangeEvent<string>) =>
          setSelectedIFicPool(e.target.value)
        }
        value={`${selectedIFicPool}`}
        variant="standard"
      >
        {iFicPools.length === 0 && selectedZone && (
          <MenuItem value="">
            <em>No Racks available for the selected zone</em>
          </MenuItem>
        )}
        {iFicPools.map((ificPool: Rack) => (
          <MenuItem
            className={classess.header_selection_menu_item}
            key={`${ificPool.rack_id}`}
            value={ificPool.rack_id}
          >
            {ificPool.rack_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const TFicPoolSelect = ({
  tFicPools = [],
  selectedTFicPool,
  setSelectedTFicPool,
  selectedZone,
}: TFicPoolSelectionProps): JSX.Element => {
  return (
    <FormControl
      size="small"
      sx={{ m: 0, minWidth: 120, maxWidth: 150 }}
      variant="standard"
    >
      <InputLabel id="tfic-pool-select">Rack</InputLabel>
      <Select
        className={classess.select_value}
        id="tfic-pool-select"
        label={`TFIC Pool`}
        labelId="tfic-pool-select"
        onChange={(e: SelectChangeEvent<string>) =>
          setSelectedTFicPool(e.target.value)
        }
        value={`${selectedTFicPool}`}
        variant="standard"
      >
        {tFicPools.length === 0 && selectedZone && (
          <MenuItem value="">
            <em>No Racks available for the selected zone</em>
          </MenuItem>
        )}
        {tFicPools.map((tficPool: Rack) => (
          <MenuItem
            className={classess.header_selection_menu_item}
            key={`${tficPool.rack_id}`}
            value={tficPool.rack_id}
          >
            {tficPool.rack_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const HeaderSelections = ({
  zones,
  selectedZone,
  setSelectedZone,
  iFicPools,
  selectedIFicPool,
  setSelectedIFicPool,
  tFicPools,
  selectedTFicPool,
  setSelectedTFicPool,
}: ZoneSelectionProps &
  IFicPoolSelectionProps &
  TFicPoolSelectionProps): JSX.Element => {
  return (
    <div className={classess.oxc_management_header_parent}>
      <div className={classess.oxc_management_header_selections}>
        <div>
          <strong>Zone &#58;</strong>
        </div>
        <ZoneSelect
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          zones={zones}
        />
      </div>
      <div className={classess.oxc_management_header_selections}>
        <div>
          <strong>IFIC Pool &#58;</strong>
        </div>
        <IFicPoolSelect
          iFicPools={iFicPools}
          selectedIFicPool={selectedIFicPool}
          selectedZone={selectedZone}
          setSelectedIFicPool={setSelectedIFicPool}
        />
      </div>
      <div className={classess.oxc_management_header_selections}>
        <div>
          <strong>TFIC Pool &#58;</strong>
        </div>
        <TFicPoolSelect
          selectedTFicPool={selectedTFicPool}
          selectedZone={selectedZone}
          setSelectedTFicPool={setSelectedTFicPool}
          tFicPools={tFicPools}
        />
      </div>
    </div>
  );
};

const ImportExportCsvBtns = (): JSX.Element => {
  return (
    <CustomizedTooltip title={`Feature implementation in progress.`}>
      <div className={classess.import_export_csv_buttons}>
        <div>
          <Button disabled variant="outlined">
            Import CSV
          </Button>
        </div>
        <div>
          <Button disabled variant="outlined">
            Export CSV
          </Button>
        </div>
      </div>
    </CustomizedTooltip>
  );
};

const Save = ({
  oxcData,
  loading,
  onClickSave,
}: {
  oxcData: OpticalSwitch[];
  loading: boolean;
  onClickSave: () => void;
}) => {
  const hasNewlyAddedConnections = (oxc: OpticalSwitch) =>
    oxc.ports.some((oxcPort) => oxcPort.connectedPcie?.isNewlyAdded);
  const hasChanges: boolean = oxcData.some(hasNewlyAddedConnections);
  return (
    <div className={classess.save_button}>
      <div>
        <Button
          disabled={!hasChanges || loading}
          onClick={onClickSave}
          variant="contained"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

const ConnectivityManagementTable = ({
  iFicData,
  oxcData,
  tFicData,
  oxcPortOptions,
  fetchingConnectivityResponse,
  setOxcResponse,
  expandedIficAccordion,
  setIficAccordion,
  expandedOxcAccordion,
  setOxcAccordion,
  expandedTficAccordion,
  setTficAccordion,
  zones,
  selectedZone,
  selectedIFicPool,
  selectedTFicPool,
}: {
  iFicData: FicManager[];
  oxcData: OpticalSwitch[];
  tFicData: FicManager[];
  oxcPortOptions: OxcPortOption[];
  fetchingConnectivityResponse: boolean;
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedIficAccordion: string;
  setIficAccordion: (value: string) => void;
  expandedOxcAccordion: string;
  setOxcAccordion: (value: string) => void;
  expandedTficAccordion: string;
  setTficAccordion: (value: string) => void;
  zones: Zone[];
  selectedZone: string;
  selectedIFicPool: string;
  selectedTFicPool: string;
}): JSX.Element => {
  return (
    <div className={classess.connectivity_management_table_blocks}>
      <IFICBlock
        expandedIficAccordion={expandedIficAccordion}
        fetchingConnectivityResponse={fetchingConnectivityResponse}
        iFicData={iFicData}
        oxcPortOptions={oxcPortOptions}
        selectedIFicPool={selectedIFicPool}
        selectedZone={selectedZone}
        setIficAccordion={setIficAccordion}
        setOxcResponse={setOxcResponse}
        zones={zones}
      />
      <OXCBlock
        expandedOxcAccordion={expandedOxcAccordion}
        fetchingConnectivityResponse={fetchingConnectivityResponse}
        oxcData={oxcData}
        selectedZone={selectedZone}
        setOxcAccordion={setOxcAccordion}
        zones={zones}
      />
      <TFICBlock
        expandedTficAccordion={expandedTficAccordion}
        fetchingConnectivityResponse={fetchingConnectivityResponse}
        oxcPortOptions={oxcPortOptions}
        selectedTFicPool={selectedTFicPool}
        selectedZone={selectedZone}
        setOxcResponse={setOxcResponse}
        setTficAccordion={setTficAccordion}
        tFicData={tFicData}
        zones={zones}
      />
    </div>
  );
};

const IFICBlock = ({
  iFicData,
  fetchingConnectivityResponse,
  oxcPortOptions,
  setOxcResponse,
  expandedIficAccordion,
  setIficAccordion,
  zones,
  selectedZone,
  selectedIFicPool,
}: {
  iFicData: FicManager[];
  oxcPortOptions: OxcPortOption[];
  fetchingConnectivityResponse: boolean;
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedIficAccordion: string;
  setIficAccordion: (value: string) => void;
  zones: Zone[];
  selectedZone: string;
  selectedIFicPool: string;
}): JSX.Element => {
  const ificRack = zones
    .find((zone: Zone) => zone.zone_id === +selectedZone)
    ?.racks.find((rack: Rack) => rack.rack_id === +selectedIFicPool);
  return (
    <div className={classess.block}>
      <div className={classess.connectivity_management_table_header}>
        <span>
          <strong>IFIC</strong>&nbsp;
          {ificRack?.rack_fqgn ? `(${ificRack?.rack_fqgn})` : ""}
        </span>
      </div>
      {iFicData && iFicData.length > 0 ? (
        <div>
          {iFicData.map((iFic: FicManager) => {
            return (
              <div key={`${iFic.id}`}>
                <IFICAccordion
                  expandedIficAccordion={expandedIficAccordion}
                  iFic={iFic}
                  oxcPortOptions={oxcPortOptions}
                  setIficAccordion={setIficAccordion}
                  setOxcResponse={setOxcResponse}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={classess.no_info_available}>
          <em>{`${
            fetchingConnectivityResponse
              ? "Fetching Data..."
              : `No IFICs available on the selected Rack.`
          }`}</em>
        </div>
      )}
    </div>
  );
};

const OXCBlock = ({
  oxcData,
  fetchingConnectivityResponse,
  expandedOxcAccordion,
  setOxcAccordion,
  selectedZone,
  zones,
}: {
  oxcData: OpticalSwitch[];
  fetchingConnectivityResponse: boolean;
  expandedOxcAccordion: string;
  setOxcAccordion: (value: string) => void;
  selectedZone: string;
  zones: Zone[];
}): JSX.Element => {
  const zoneFqgn: string | undefined = zones.find(
    (zone) => zone.zone_id === +selectedZone
  )?.zone_fqgn;
  return (
    <div className={classess.block}>
      <div className={classess.connectivity_management_table_header}>
        <span>
          <strong>OXC </strong> &nbsp; {zoneFqgn ? `(${zoneFqgn})` : ""}
        </span>
      </div>
      {oxcData && oxcData.length > 0 ? (
        <div>
          {oxcData.map((oxc: OpticalSwitch) => (
            <div key={`${oxc.id}`}>
              <OXCAccordion
                expandedOxcAccordion={expandedOxcAccordion}
                oxc={oxc}
                setOxcAccordion={setOxcAccordion}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={classess.no_info_available}>
          <em>{`${
            fetchingConnectivityResponse
              ? "Fetching Data..."
              : `No Optical Switch available on the selected Zone.`
          }`}</em>
        </div>
      )}
    </div>
  );
};

const TFICBlock = ({
  tFicData,
  oxcPortOptions,
  fetchingConnectivityResponse,
  setOxcResponse,
  expandedTficAccordion,
  setTficAccordion,
  zones,
  selectedZone,
  selectedTFicPool,
}: {
  tFicData: FicManager[];
  oxcPortOptions: OxcPortOption[];
  fetchingConnectivityResponse: boolean;
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedTficAccordion: string;
  setTficAccordion: (value: string) => void;
  zones: Zone[];
  selectedZone: string;
  selectedTFicPool: string;
}): JSX.Element => {
  const tficRack = zones
    .find((zone: Zone) => zone.zone_id === +selectedZone)
    ?.racks.find((rack: Rack) => rack.rack_id === +selectedTFicPool);
  return (
    <div className={classess.block}>
      <div className={classess.connectivity_management_table_header}>
        <span>
          <strong>TFIC</strong>&nbsp;
          {tficRack?.rack_fqgn ? `(${tficRack?.rack_fqgn})` : ""}
        </span>
      </div>
      {tFicData && tFicData.length > 0 ? (
        <div>
          {tFicData.map((tFic: FicManager) => {
            return (
              <div key={`${tFic.id}`}>
                <TFICAccordion
                  expandedTficAccordion={expandedTficAccordion}
                  oxcPortOptions={oxcPortOptions}
                  setOxcResponse={setOxcResponse}
                  setTficAccordion={setTficAccordion}
                  tFic={tFic}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={classess.no_info_available}>
          <em>{`${
            fetchingConnectivityResponse
              ? "Fetching Data..."
              : `No TFICs available on the selected Rack.`
          }`}</em>
        </div>
      )}
    </div>
  );
};

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiTypography-root": {
    fontWeight: "400",
    padding: 0,
    color: "#707070",
    fontSize: 14,
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const IFICAccordion = ({
  iFic,
  oxcPortOptions,
  setOxcResponse,
  expandedIficAccordion,
  setIficAccordion,
}: {
  iFic: FicManager;
  oxcPortOptions: OxcPortOption[];
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedIficAccordion: string;
  setIficAccordion: (value: string) => void;
}): JSX.Element => {
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      console.log(event);
      setIficAccordion(newExpanded ? panel : "");
    };
  return (
    <Accordion
      expanded={expandedIficAccordion === iFic.fqnn}
      onChange={handleChange(iFic.fqnn)}
    >
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography>
          <CustomizedTooltip title={iFic.fqnn}>
            <span>{`${iFic?.name || "- (Node Name Not available)"}`}</span>
          </CustomizedTooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FICAccordionTable
          fic={iFic}
          oxcPortOptions={oxcPortOptions}
          setOxcResponse={setOxcResponse}
        />
      </AccordionDetails>
    </Accordion>
  );
};

const FICAccordionTable = ({
  fic,
  oxcPortOptions,
  setOxcResponse,
}: {
  fic: FicManager;
  oxcPortOptions: OxcPortOption[];
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
}): JSX.Element => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table aria-label="FIC table" stickyHeader>
        <TableHead>
          <TableRow className={classess.tableHeader}>
            <TableCell align="center">PCIE Switch Port</TableCell>
            <TableCell align="center">Peer Port</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fic.switches && Object.keys(fic.switches).length > 0 ? (
            Object.keys(fic.switches).map((pcieSwitchKey: string) =>
              Object.keys(fic.switches[pcieSwitchKey])
                .map((pcieSwitchPortKey: string) => (
                  <TableRow
                    key={`${fic.fqnn}_${pcieSwitchPortKey}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {`${pcieSwitchKey}`}&#8228;{`${pcieSwitchPortKey}`}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      {!fic.switches[pcieSwitchKey][pcieSwitchPortKey]
                        .optical_switch ||
                      !fic.switches[pcieSwitchKey][pcieSwitchPortKey]
                        .optical_switch.name ? (
                        <OxcPortsDropDown
                          fic={fic}
                          oxcPortOptions={oxcPortOptions}
                          pcieSwitch={pcieSwitchKey}
                          pcieSwitchPort={pcieSwitchPortKey}
                          setOxcResponse={setOxcResponse}
                        />
                      ) : (
                        <CustomizedTooltip
                          className={classess.text_ellipsis}
                          title={`${fic.switches[pcieSwitchKey][pcieSwitchPortKey].optical_switch.fqnn}`}
                        >
                          <span>
                            {`(${fic.switches[pcieSwitchKey][pcieSwitchPortKey].rx} - ${fic.switches[pcieSwitchKey][pcieSwitchPortKey].tx}) 
                         ${fic.switches[pcieSwitchKey][pcieSwitchPortKey].optical_switch.rack_name}.${fic.switches[pcieSwitchKey][pcieSwitchPortKey].optical_switch.name}`}
                          </span>
                        </CustomizedTooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
                .reduce(
                  (acc: JSX.Element[], val: JSX.Element) => acc.concat(val),
                  []
                )
            )
          ) : (
            <div className={classess.no_data}>
              <span>No PCIE Switches available.</span>
            </div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const OXCAccordionTable = ({ oxc }: { oxc: OpticalSwitch }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table aria-label="oxc table" stickyHeader>
        <TableHead>
          <TableRow className={classess.tableHeader}>
            <TableCell align="center" style={{ width: 70 }}>
              IN
            </TableCell>
            <TableCell align="center" style={{ width: 70 }}>
              OUT
            </TableCell>
            <TableCell align="center">Connected FIC Port</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {oxc.ports && oxc.ports.length > 0 ? (
            oxc.ports.map((oxcPort: OxcPort) => (
              <TableRow
                key={`${oxcPort.rx}-${oxcPort.tx}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  {oxcPort?.rx}
                </TableCell>
                <TableCell align="center">{oxcPort?.tx}</TableCell>
                <TableCell align="center">
                  {oxcPort?.connectedPcie ? (
                    <CustomizedTooltip
                      title={`(${oxcPort.connectedPcie.manager_type}) ${oxcPort.connectedPcie.manager_fqnn}`}
                    >
                      <span>
                        {`(${oxcPort.connectedPcie.manager_type}) ${oxcPort.connectedPcie.rack_name}
                    .${oxcPort.connectedPcie.manager_name}
                    .${oxcPort.connectedPcie.pcie_switch}
                    .${oxcPort.connectedPcie.pcie_switch_port}`}
                      </span>
                    </CustomizedTooltip>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div className={classess.no_data}>
              <span>No Ports available.</span>
            </div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const OXCAccordion = ({
  oxc,
  expandedOxcAccordion,
  setOxcAccordion,
}: {
  oxc: OpticalSwitch;
  expandedOxcAccordion: string;
  setOxcAccordion: (value: string) => void;
}): JSX.Element => {
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      console.log(event);
      setOxcAccordion(newExpanded ? panel : "");
    };
  return (
    <Accordion
      expanded={expandedOxcAccordion === oxc.fqnn}
      onChange={handleChange(oxc.fqnn)}
    >
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography>
          <CustomizedTooltip title={oxc.fqnn}>
            <span>
              {`${oxc.rack_name}.${oxc.name}`} &nbsp; ({oxc.ports.length * 2}{" "}
              Ports)
            </span>
          </CustomizedTooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <OXCAccordionTable oxc={oxc} />
      </AccordionDetails>
    </Accordion>
  );
};

const TFICAccordion = ({
  tFic,
  oxcPortOptions,
  setOxcResponse,
  expandedTficAccordion,
  setTficAccordion,
}: {
  tFic: FicManager;
  oxcPortOptions: OxcPortOption[];
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedTficAccordion: string;
  setTficAccordion: (value: string) => void;
}): JSX.Element => {
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      console.log(event);
      setTficAccordion(newExpanded ? panel : "");
    };
  return (
    <Accordion
      expanded={expandedTficAccordion === tFic.fqnn}
      onChange={handleChange(tFic.fqnn)}
    >
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography>
          <CustomizedTooltip title={tFic.fqnn}>
            <span>{`${tFic?.name || "- (Node Name Not available)"}`}</span>
          </CustomizedTooltip>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FICAccordionTable
          fic={tFic}
          oxcPortOptions={oxcPortOptions}
          setOxcResponse={setOxcResponse}
        />
      </AccordionDetails>
    </Accordion>
  );
};

const OxcPortsDropDown = ({
  fic,
  pcieSwitch,
  pcieSwitchPort,
  oxcPortOptions,
  setOxcResponse,
}: {
  fic: FicManager;
  pcieSwitch: string;
  pcieSwitchPort: string;
  oxcPortOptions: OxcPortOption[];
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
}): JSX.Element => {
  const onOxcPortSelectionChange = (selectedOxcPort: OxcPortOption | null) => {
    if (selectedOxcPort) {
      setOxcResponse((prev: OpticalSwitch[]) => {
        const selectedOpticalSwitch: OpticalSwitch | undefined = prev.find(
          (oxc: OpticalSwitch) => oxc.fqnn === selectedOxcPort.fqnn
        );
        if (selectedOpticalSwitch) {
          const existingOxcConnection: OxcPort | undefined =
            selectedOpticalSwitch.ports.find(
              (oxcPort: OxcPort) =>
                oxcPort.connectedPcie?.manager_name === fic.name &&
                oxcPort.connectedPcie?.pcie_switch === pcieSwitch &&
                oxcPort.connectedPcie?.pcie_switch_port === pcieSwitchPort
            );
          if (existingOxcConnection) {
            existingOxcConnection.connectedPcie = null;
          }

          const oxcPort: OxcPort | undefined = selectedOpticalSwitch.ports.find(
            (oxcPort: OxcPort) => oxcPort.rx === selectedOxcPort.rx
          );
          if (oxcPort) {
            const pcieData: ConnectedPcie = {
              manager_fqnn: fic.fqnn,
              manager_name: fic.name,
              manager_type: fic.manager_type,
              pcie_switch: pcieSwitch,
              pcie_switch_port: pcieSwitchPort,
              rack_name: fic.rack_name,
              zone_name: fic.zone_name,
              isNewlyAdded: true,
            } as ConnectedPcie;
            oxcPort.connectedPcie = pcieData;
          }
        }
        return [...prev];
      });
      const pcieSwitchPortFields: PcieSwitchPortFields = {
        rx: selectedOxcPort?.rx,
        tx: selectedOxcPort?.tx,
        optical_switch: {
          fqnn: selectedOxcPort?.fqnn,
        } as ConnectedOpticalSwitch,
      } as PcieSwitchPortFields;
      fic.switches[pcieSwitch][pcieSwitchPort] = pcieSwitchPortFields;
    } else {
      const removedOpticalSwitchPort: PcieSwitchPortFields =
        fic.switches[pcieSwitch][pcieSwitchPort];

      setOxcResponse((prev: OpticalSwitch[]) => {
        const selectedOpticalSwitch: OpticalSwitch | undefined = prev.find(
          (oxc) => oxc.fqnn === removedOpticalSwitchPort.optical_switch.fqnn
        );
        if (selectedOpticalSwitch) {
          const opticalSwitchPort: OxcPort | undefined =
            selectedOpticalSwitch.ports.find(
              (oxcPort) =>
                oxcPort.rx === removedOpticalSwitchPort.rx &&
                oxcPort.tx === removedOpticalSwitchPort.tx
            );
          if (opticalSwitchPort) {
            opticalSwitchPort.connectedPcie = null;
          }
        }
        return [...prev];
      });
    }
  };

  return (
    <Autocomplete
      getOptionLabel={(option) => option.optionLable}
      groupBy={(option) => option.title}
      id="grouped-oxc-ports"
      onChange={(e, option: OxcPortOption | null) => {
        console.log(e);
        onOxcPortSelectionChange(option);
      }}
      options={oxcPortOptions}
      renderGroup={(params) => (
        <li>
          <div className={classess.oxc_option}>
            <strong>{params.group}</strong>
          </div>
          <div className={classess.oxc_option}>{params.children}</div>
        </li>
      )}
      renderInput={(params: AutocompleteRenderInputParams) => {
        return (
          <TextField
            className={classess.oxc_port_autocomplete_input}
            {...params}
            label=""
            placeholder="Select Oxc Port"
            variant="standard"
          />
        );
      }}
      renderOption={(props, option: OxcPortOption) => (
        <CustomizedTooltip placement="left" title={option.fqnn}>
          <li {...props}>
            <span key={`${option.tx}-${option.rx}`}>{option.port}</span>
          </li>
        </CustomizedTooltip>
      )}
      size="small"
    />
  );
};

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
  const [loading, setLoading] = useState(false);
  const [fetchingConnectivityResponse, setFetchingConnectivityResponse] =
    useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const abortController = new AbortController();

  React.useEffect(() => {
    fetchZones();
  }, []);

  React.useEffect(() => {
    if (selectedIFicPool && selectedTFicPool) {
      fetchConnectivityInformation();
    }
  }, [selectedIFicPool, selectedTFicPool]);

  React.useEffect(() => {
    const oxcPortOptions: OxcPortOption[] = oxcResponse.flatMap(
      (oxc: OpticalSwitch) =>
        oxc.ports
          .filter((oxcPort: OxcPort) => !oxcPort.connectedPcie)
          .map((oxcPort: OxcPort) => {
            return {
              title: `${oxc.rack_name}.${oxc.name}`,
              tx: oxcPort.tx,
              rx: oxcPort.rx,
              port: `${oxcPort.rx}-${oxcPort.tx}`,
              optionLable: `(${oxcPort.rx}-${oxcPort.tx}) ${oxc.name}`,
              fqnn: oxc.fqnn,
            };
          })
    );
    setOxcPortOptions(oxcPortOptions);
  }, [oxcResponse]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Loading...");
      const promise = await fetchData(
        "dfab/nodegroups/?op=get_zones",
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        const response: Zone[] = await promise.json();
        const notDefaultZone = (zone: Zone) =>
          zone.zone_name.toLowerCase() !== "default_zone";
        setZones(response.filter(notDefaultZone));
      } else {
        const apiError: string = promise.text();
        const defaultError = "Error fetching Zones.";
        setError(apiError ? apiError : defaultError);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const zone: Zone | undefined = zones.find(
      (zone: Zone) => zone.zone_id === +selectedZone
    );
    if (zone) {
      setSelectedIFicPool("");
      setSelectedTFicPool("");
      setIFicPools(zone.racks);
      setTFicPools(zone.racks);
    }
    return () => abortController.abort();
  }, [selectedZone]);

  const onClickSave = () => {
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

  const fetchConnectivityInformation = async () => {
    try {
      setFetchingConnectivityResponse(true);
      const url = "dfab/connectivity/?";
      const params = {
        ific_rack_id: selectedIFicPool,
        tfic_rack_id: selectedTFicPool,
        zone_id: selectedZone,
      };
      const queryParam: string = Object.keys(params)
        .map((key: string) => key + "=" + params[key as keyof typeof params])
        .join("&");
      const promise = await fetchData(url.concat(queryParam));
      if (promise.status === 200) {
        const response: Manager = await promise.json();
        setIFicResponse(response["IFIC"]);
        setOxcResponse(response["OXC"]);
        setTFicResponse(response["TFIC"]);
      } else {
        setError(promise.text());
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setFetchingConnectivityResponse(false);
    }
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
      {loading && (
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
      )}
      <div
        className={`${classess.oxc_management_content} ${
          loading ? classess.loading : ""
        }`}
      >
        <div className={classess.oxc_management_header_content}>
          <HeaderSelections
            iFicPools={iFicPools}
            selectedIFicPool={selectedIFicPool}
            selectedTFicPool={selectedTFicPool}
            selectedZone={selectedZone}
            setSelectedIFicPool={setSelectedIFicPool}
            setSelectedTFicPool={setSelectedTFicPool}
            setSelectedZone={setSelectedZone}
            tFicPools={tFicPools}
            zones={zones}
          />
          <ImportExportCsvBtns />
        </div>
        {selectedZone && selectedIFicPool && selectedTFicPool ? (
          <div className={classess.connectivity_management_table}>
            {fetchingConnectivityResponse && (
              <Notification
                inline
                key={`notification_${Math.random()}`}
                severity="information"
              >
                <Spinner
                  key={`managerListSpinner_${Math.random()}`}
                  text="Fetching connectivity Information..."
                />
              </Notification>
            )}
            <ConnectivityManagementTable
              expandedIficAccordion={expandedIficAccordion}
              expandedOxcAccordion={expandedOxcAccordion}
              expandedTficAccordion={expandedTficAccordion}
              fetchingConnectivityResponse={fetchingConnectivityResponse}
              iFicData={iFicResponse}
              oxcData={oxcResponse}
              oxcPortOptions={oxcPortOptions}
              selectedIFicPool={selectedIFicPool}
              selectedTFicPool={selectedTFicPool}
              selectedZone={selectedZone}
              setIficAccordion={setIficAccordion}
              setOxcAccordion={setOxcAccordion}
              setOxcResponse={setOxcResponse}
              setTficAccordion={setTficAccordion}
              tFicData={tFicResponse}
              zones={zones}
            />
          </div>
        ) : (
          <div className={classess.no_selection}>
            Please select Zone and Racks to manage the oxc connectivity.
          </div>
        )}
      </div>
      <Save loading={loading} onClickSave={onClickSave} oxcData={oxcResponse} />
    </>
  );
};

export default OxcManagement;
