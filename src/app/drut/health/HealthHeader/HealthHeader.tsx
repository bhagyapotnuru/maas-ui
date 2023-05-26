import { Button } from "@canonical/react-components";
// import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";

interface Props {
  onRefresh: any;
}

const HealthHeader = ({ onRefresh }: Props): JSX.Element => {
  // const history = createBrowserHistory();

  const getHeaderButtons = () => {
    const refreshData = (): void => {
      onRefresh();
    };

    return [
      <Button element={Link} key="dashboard" to="/drut-cdi">
        Dashboard
      </Button>,
      <Button key="refresh" onClick={() => refreshData()}>
        Refresh
      </Button>,
    ];
  };

  return (
    <SectionHeader
      key="healthHeades"
      buttons={getHeaderButtons()}
      title="Fabric Manager"
      subtitle={"Details of all Fabric Manager services."}
    />
  );
};

HealthHeader.protoTypes = {};

export default HealthHeader;
