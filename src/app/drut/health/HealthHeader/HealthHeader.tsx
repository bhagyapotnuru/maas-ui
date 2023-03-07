import { Button } from "@canonical/react-components";
// import { createBrowserHistory } from "history";
import SectionHeader from "app/base/components/SectionHeader";
import { Link } from "react-router-dom";

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
      <Button key="refresh" onClick={() => refreshData()}>
        Refresh
      </Button>,
    ];
  };

  return (
    <SectionHeader
      buttons={getHeaderButtons()}
      key="healthHeades"
      subtitle={"Details of all Fabric Manager services."}
      title="Fabric Manager"
    />
  );
};

HealthHeader.protoTypes = {};

export default HealthHeader;
