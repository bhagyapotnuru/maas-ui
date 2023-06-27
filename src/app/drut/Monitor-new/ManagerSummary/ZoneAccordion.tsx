import { useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import RackManagersData from "./RackManagersData";

import type { Manager, Zone, Rack } from "app/store/drut/managers/types";
import { groupAsMap } from "app/utils";

type Props = {
  managerData: Manager[];
  zone: Zone;
};

const ZoneAccordion = ({ zone, managerData }: Props): JSX.Element => {
  const [rackManagers, setRackManagers] = useState(
    {} as { [key: string]: Manager[] }
  );
  const [managerRackData, setManagerRackData] = useState([] as any);

  useEffect(() => {
    if (managerData) {
      const groupMap = groupAsMap(
        managerData,
        (manager: Manager) => manager?.rack_name
      );
      const groupData = Array.from(groupMap).map(([label, configs]) => ({
        label: label?.toString() || "No Pool",
        configs: configs,
      }));
      setManagerRackData(groupData);
    }
  }, [managerData, zone]);

  useEffect(() => {
    if (managerRackData) {
      const data: { [key: string]: Manager[] } = {};
      managerRackData.forEach(
        (element: { label: string; configs: Manager[] }) => {
          data[element.label] = element.configs;
        }
      );
      setRackManagers(data);
    }
  }, [managerRackData]);
  return (
    <div id={`${zone.zone_id}`}>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-content_${zone.zone_id}`}
          id={`${zone.zone_id}`}
        >
          <Typography>
            <span className="app-name">
              <NavLink to={"/drut-cdi/managers"}>
                {zone.zone_name}&nbsp;›
              </NavLink>
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <RackManagersData
              rackManagers={rackManagers}
              rackNames={zone?.racks.map((rack: Rack) => rack.rack_name)}
            />
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ZoneAccordion;
