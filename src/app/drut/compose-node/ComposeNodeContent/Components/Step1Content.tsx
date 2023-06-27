import classes from "../../composedNode.module.scss";

import NodeNameInputField from "./NodeNameInputField";
import PageInformation from "./PageInformation";
import ZoneSelect from "./ZoneSelect";

import type { ZoneObj as Zone } from "app/store/drut/managers/types";

const Step1Content = ({
  zones,
  selectedZone,
  setSelectedZone,
  enteredNodeName,
  setEnteredNodeName,
}: {
  zones: Zone[];
  selectedZone: string;
  setSelectedZone: (value: string) => void;
  enteredNodeName: string;
  setEnteredNodeName: (value: string) => void;
}): JSX.Element => {
  return (
    <>
      <div className={classes.page_info}>
        <PageInformation />
        <div className={classes.page1_data}>
          <div className={classes.header_selections}>
            <div>
              <strong>
                Zone<span style={{ color: "red" }}>*</span> &#58;
              </strong>
            </div>
            <div>
              <ZoneSelect
                zones={zones}
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
              />
            </div>
          </div>

          <div className={classes.header_selections}>
            <div>
              <strong>
                Node Name<span style={{ color: "red" }}>*</span> &#58;
              </strong>
            </div>
            <div>
              <NodeNameInputField
                enteredNodeName={enteredNodeName}
                setEnteredNodeName={setEnteredNodeName}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1Content;
