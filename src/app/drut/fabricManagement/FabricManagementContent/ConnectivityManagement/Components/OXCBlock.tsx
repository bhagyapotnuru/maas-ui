import classes from "../../../fabricManagement.module.scss";

import OXCAccordion from "./OxcAccordion";

import type {
  OpticalSwitch,
  OxcPort,
} from "app/drut/fabricManagement/Models/Manager";

const OXCBlock = ({
  oxcData,
  fetchingConnectivityResponse,
  expandedOxcAccordion,
  setOxcAccordion,
  removeOxcConnection,
  onClickClearAllPeerPortConnections,
}: {
  oxcData: OpticalSwitch[];
  fetchingConnectivityResponse: boolean;
  expandedOxcAccordion: string;
  setOxcAccordion: (value: string) => void;
  removeOxcConnection: (oxc: OpticalSwitch, oxcPort: OxcPort) => void;
  onClickClearAllPeerPortConnections: (oxc: OpticalSwitch) => void;
}): JSX.Element => {
  return (
    <div className={classes.block}>
      <div className={classes.connectivity_management_table_header}>
        <span>
          <strong>OXC </strong> &nbsp;
        </span>
      </div>
      {oxcData && oxcData.length > 0 ? (
        <div>
          {oxcData.map((oxc: OpticalSwitch) => (
            <div key={`${oxc.id}`}>
              <OXCAccordion
                oxc={oxc}
                expandedOxcAccordion={expandedOxcAccordion}
                setOxcAccordion={setOxcAccordion}
                removeOxcConnection={removeOxcConnection}
                onClickClearAllPeerPortConnections={
                  onClickClearAllPeerPortConnections
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.no_info_available}>
          <em>{`${
            fetchingConnectivityResponse
              ? "Fetching Data..."
              : `No Optical Switch available.`
          }`}</em>
        </div>
      )}
    </div>
  );
};

export default OXCBlock;
