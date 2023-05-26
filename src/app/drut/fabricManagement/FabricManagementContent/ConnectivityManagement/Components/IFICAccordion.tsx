import type { SetStateAction } from "react";

import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { Button, styled, Typography } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";

import { COLOURS } from "../../../../../base/constants";
import classes from "../../../fabricManagement.module.scss";

import FICAccordionTable from "./FICAccordionTable";

import type {
  FicManager,
  OpticalSwitch,
  OxcPortOption,
} from "app/drut/fabricManagement/Models/Manager";
import CustomizedTooltip from "app/utils/Tooltip/DrutTooltip";

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
      ? COLOURS.ACCORDIAN_BG_TRUE
      : COLOURS.ACCORDIAN_BG_FALSE,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiTypography-root": {
    fontWeight: "400",
    padding: 0,
    color: COLOURS.ACCORDIAN_TEXT,
    fontSize: 14,
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
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
