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

const IFICAccordion = ({
  iFic,
  oxcPortOptions,
  setOxcResponse,
  expandedIficAccordion,
  setIficAccordion,
  setIFicResponse,
  removeFicPeerPort,
  clearAllFicPeerConnections,
}: {
  iFic: FicManager;
  oxcPortOptions: OxcPortOption[];
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedIficAccordion: string;
  setIficAccordion: (value: string) => void;
  setIFicResponse: (response: SetStateAction<FicManager[]>) => void;
  removeFicPeerPort: (
    fic: FicManager,
    pcieSwitchKey: string,
    pcieSwitchPortKey: string
  ) => void;
  clearAllFicPeerConnections: (fic: FicManager) => void;
}): JSX.Element => {
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
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
            <div>
              <div>
                <span>{`${iFic?.name || "- (Node Name Not available)"}`}</span>
              </div>
              <div>
                <span className={classes.port_count}>
                  Ports: (Total: {iFic.totalPorts}, Free: {iFic.freePorts})
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
          disabled={Object.keys(iFic.switches).every((switchKey) =>
            Object.keys(iFic.switches[switchKey]).every(
              (portKey) =>
                !iFic.switches[switchKey][portKey].optical_switch?.name
            )
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            clearAllFicPeerConnections(iFic);
          }}
        >
          Clear All
        </Button>
      </AccordionSummary>
      <AccordionDetails>
        <FICAccordionTable
          fic={iFic}
          oxcPortOptions={oxcPortOptions}
          setOxcResponse={setOxcResponse}
          setFicResponse={setIFicResponse}
          removeFicPeerPort={removeFicPeerPort}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default IFICAccordion;
