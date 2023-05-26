import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { Button, styled, Typography } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import type { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import type { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionSummary from "@mui/material/AccordionSummary";

import { COLOURS } from "../../../../../base/constants";
import classes from "../../../fabricManagement.module.scss";

import OXCAccordionTable from "./OxcAccordionTable";

import type {
  OpticalSwitch,
  OxcPort,
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
