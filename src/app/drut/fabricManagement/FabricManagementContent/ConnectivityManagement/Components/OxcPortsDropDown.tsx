import type { SetStateAction } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import type { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import classes from "../../../fabricManagement.module.scss";

import type {
  ConnectedOpticalSwitch,
  ConnectedPcie,
  FicManager,
  OpticalSwitch,
  OxcPort,
  OxcPortOption,
  PcieSwitchPortFields,
} from "app/drut/fabricManagement/Models/Manager";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const OxcPortsDropDown = ({
  fic,
  pcieSwitch,
  pcieSwitchPort,
  oxcPortOptions,
  setOxcResponse,
  setFicResponse,
}: {
  fic: FicManager;
  pcieSwitch: string;
  pcieSwitchPort: string;
  oxcPortOptions: OxcPortOption[];
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  setFicResponse: (response: SetStateAction<FicManager[]>) => void;
}): JSX.Element => {
  const switchPort = fic.switches[pcieSwitch][pcieSwitchPort];
  const defaultPortOption = {
    fqnn: "",
    optionLable: "",
    port: "",
    rx: "",
    tx: "",
    title: "",
  } as OxcPortOption;
  const portOption =
    Object.keys(switchPort.optical_switch).length > 0
      ? ({
          port: `${switchPort.rx}-${switchPort.tx}`,
          optionLable: `(${switchPort.rx}-${
            switchPort.tx
          }) ${switchPort.optical_switch.fqnn.substring(
            switchPort.optical_switch.fqnn.lastIndexOf(".") + 1
          )}`,
          rx: switchPort.rx,
          tx: switchPort.tx,
        } as OxcPortOption)
      : defaultPortOption;

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
      setFicResponse((prev) => {
        const currentFic = prev.find((prevFic) => prevFic.id === fic.id);
        if (currentFic) {
          currentFic.switches[pcieSwitch][pcieSwitchPort] =
            pcieSwitchPortFields;
        }
        return [...prev];
      });
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
        removedOpticalSwitchPort.optical_switch = {} as ConnectedOpticalSwitch;
        removedOpticalSwitchPort.rx = "";
        removedOpticalSwitchPort.tx = "";
        setFicResponse((prev) => {
          const currentFic = prev.find((prevFic) => prevFic.id === fic.id);
          if (currentFic) {
            currentFic.switches[pcieSwitch][pcieSwitchPort] =
              removedOpticalSwitchPort;
          }
          return [...prev];
        });
        return [...prev];
      });
    }
  };

  return (
    <Autocomplete
      id="grouped-oxc-ports"
      onChange={(e, option: OxcPortOption | null) =>
        onOxcPortSelectionChange(option)
      }
      size="small"
      defaultValue={portOption}
      options={oxcPortOptions}
      groupBy={(option) => option.title}
      getOptionLabel={(option) => option.optionLable}
      value={portOption}
      isOptionEqualToValue={(opt) => opt.port === portOption.port}
      renderInput={(params: AutocompleteRenderInputParams) => {
        return (
          <TextField
            className={classes.oxc_port_autocomplete_input}
            {...params}
            label=""
            placeholder="Select Oxc Port"
            variant="standard"
          />
        );
      }}
      renderGroup={(params) => (
        <li>
          <div className={classes.oxc_option}>
            <strong>{params.group}</strong>
          </div>
          <div className={classes.oxc_option}>{params.children}</div>
        </li>
      )}
      renderOption={(props, option: OxcPortOption, { selected }) =>
        option.tx !== "" && (
          <CustomizedTooltip title={option.fqnn} placement="left">
            <li {...props} id={`${option.rx}_${option.tx}_${option.title}`}>
              <span key={`${option.tx}-${option.rx}`}>{option.port}</span>
            </li>
          </CustomizedTooltip>
        )
      }
    />
  );
};

export default OxcPortsDropDown;
