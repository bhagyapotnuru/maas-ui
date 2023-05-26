import type { Manager } from "../../fabricManagement/FabricManagementContent/Managers/AddManager/type";
import classes from "../monitor.module.scss";

import RackManagersDataCard from "./RackManagersDataCard";

type Props = {
  rackManagers: { [key: string]: Manager[] };
  rackNames: string[];
};

const RackManagersData = ({ rackManagers, rackNames }: Props): JSX.Element => {
  return (
    <div className={classes.maximized_monitor_blocks}>
      {rackNames?.map((rackName: string, index: number) => {
        return (
          <RackManagersDataCard
            managerData={rackManagers[rackName] ? rackManagers[rackName] : []}
            rackName={rackName}
          />
        );
      })}
    </div>
  );
};

export default RackManagersData;
