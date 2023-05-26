import classes from "../../../fabricManagement.module.scss";
import type {
  IFicPoolSelectionProps,
  ZoneSelectionProps,
  TFicPoolSelectionProps,
} from "../types";

import IFicPoolSelect from "./IFicPoolSelect";
import TFicPoolSelect from "./TFICPoolSelect";
import ZoneSelect from "./ZoneSelect";

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
    <div className={classes.oxc_management_header_parent}>
      <div className={classes.oxc_management_header_selections}>
        <div>
          <strong>Zone &#58;</strong>
        </div>
        <ZoneSelect
          zones={zones}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
        />
      </div>
      <div className={classes.oxc_management_header_selections}>
        <div>
          <strong>IFIC Pool &#58;</strong>
        </div>
        <IFicPoolSelect
          iFicPools={iFicPools}
          selectedIFicPool={selectedIFicPool}
          setSelectedIFicPool={setSelectedIFicPool}
          selectedZone={selectedZone}
        />
      </div>
      <div className={classes.oxc_management_header_selections}>
        <div>
          <strong>TFIC Pool &#58;</strong>
        </div>
        <TFicPoolSelect
          tFicPools={tFicPools}
          selectedTFicPool={selectedTFicPool}
          setSelectedTFicPool={setSelectedTFicPool}
          selectedZone={selectedZone}
        />
      </div>
    </div>
  );
};

export default HeaderSelections;
