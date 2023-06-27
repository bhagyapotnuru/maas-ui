import type { SetStateAction } from "react";

import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { Button, Typography } from "@mui/material";

import classes from "../../../fabricManagement.module.scss";

import FICAccordionTable from "./FICAccordionTable";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary1 as AccordionSummary,
} from "app/drut/components/accordion";
import type {
  FicManager,
  OpticalSwitch,
  OxcPortOption,
} from "app/drut/fabricManagement/Models/Manager";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

const TFICAccordion = ({
  tFic,
  oxcPortOptions,
  setOxcResponse,
  expandedTficAccordion,
  setTficAccordion,
  setTFicResponse,
  removeFicPeerPort,
  clearAllFicPeerConnections,
}: {
  tFic: FicManager;
  oxcPortOptions: OxcPortOption[];
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedTficAccordion: string;
  setTficAccordion: (value: string) => void;
  setTFicResponse: (response: SetStateAction<FicManager[]>) => void;
  removeFicPeerPort: (
    fic: FicManager,
    pcieSwitchKey: string,
    pcieSwitchPortKey: string
  ) => void;
  clearAllFicPeerConnections: (fic: FicManager) => void;
}): JSX.Element => {
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
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
            <div>
              <div>
                <span>{`${tFic?.name || "- (Node Name Not available)"}`}</span>
              </div>
              <div>
                <span className={classes.port_count}>
                  Ports: (Total: {tFic.totalPorts}, Free: {tFic.freePorts})
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
          disabled={Object.keys(tFic.switches).every((switchKey) =>
            Object.keys(tFic.switches[switchKey]).every(
              (portKey) =>
                !tFic.switches[switchKey][portKey].optical_switch?.name
            )
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            clearAllFicPeerConnections(tFic);
          }}
        >
          Clear All
        </Button>
      </AccordionSummary>
      <AccordionDetails>
        <FICAccordionTable
          fic={tFic}
          oxcPortOptions={oxcPortOptions}
          setOxcResponse={setOxcResponse}
          setFicResponse={setTFicResponse}
          removeFicPeerPort={removeFicPeerPort}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default TFICAccordion;
