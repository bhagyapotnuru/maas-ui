import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { Button, Typography } from "@mui/material";

import classes from "../../../fabricManagement.module.scss";

import OXCAccordionTable from "./OxcAccordionTable";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary1 as AccordionSummary,
} from "app/drut/components/accordion";
import type {
  OpticalSwitch,
  OxcPort,
} from "app/drut/fabricManagement/Models/Manager";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const OXCAccordion = ({
  oxc,
  expandedOxcAccordion,
  setOxcAccordion,
  removeOxcConnection,
  onClickClearAllPeerPortConnections,
}: {
  oxc: OpticalSwitch;
  expandedOxcAccordion: string;
  setOxcAccordion: (value: string) => void;
  removeOxcConnection: (oxc: OpticalSwitch, oxcPort: OxcPort) => void;
  onClickClearAllPeerPortConnections: (oxc: OpticalSwitch) => void;
}): JSX.Element => {
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
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
            <div>
              <div>{`${oxc.rack_name}.${oxc.name}`}</div>
              <div>
                <span className={classes.port_count}>
                  Ports: (Total: {oxc.ports.length * 2}, Free:{" "}
                  {oxc.freePorts * 2})
                </span>
              </div>
            </div>
          </CustomizedTooltip>
        </Typography>
        <Button
          sx={{ p: 0, textTransform: "capitalize" }}
          size="small"
          variant="text"
          endIcon={<PlaylistRemoveIcon fontSize="small" />}
          disabled={
            oxc.ports.some((oxcPort) => oxcPort.isRemoving) ||
            oxc.ports.every((oxcport) => !oxcport.connectedPcie) ||
            oxc.ports
              .filter((oxcport) => oxcport.connectedPcie)
              .every((oxcport) => oxcport.connectedPcie?.isNewlyAdded)
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClickClearAllPeerPortConnections(oxc);
          }}
        >
          Clear All
        </Button>
      </AccordionSummary>
      <AccordionDetails>
        <OXCAccordionTable
          oxc={oxc}
          removeOxcConnection={removeOxcConnection}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default OXCAccordion;
