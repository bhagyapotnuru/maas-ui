import { Button } from "@canonical/react-components";
// import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";

const DashboardHeader = (): JSX.Element => {
  // const history = createBrowserHistory();

  const getHeaderButtons = () => {
    return [
      <Button element={Link} key="dashboard" to="/drut-cdi">
        Dashboard
      </Button>,
      // <ContextualMenu
      //   hasToggleIcon
      //   className="drut-button"
      //   links={[
      //     {
      //       children: "Resources",
      //       onClick: () => history.push("resources"),
      //     },
      //     {
      //       children: "Nodes",
      //       onClick: () => history.push("nodes"),
      //     },
      //     {
      //       children: "Events",
      //       onClick: () => history.push("dfab-events"),
      //     },
      //   ]}
      //   position="right"
      //   toggleLabel="dFabric"
      // />,
    ];
  };

  return (
    <SectionHeader
      key="dashboardHeades"
      buttons={getHeaderButtons()}
      title="Event Logs"
      subtitle={"All events logs from Fabric."}
    />
  );
};

DashboardHeader.protoTypes = {};

export default DashboardHeader;
