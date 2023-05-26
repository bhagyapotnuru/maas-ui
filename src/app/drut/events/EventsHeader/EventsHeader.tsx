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
