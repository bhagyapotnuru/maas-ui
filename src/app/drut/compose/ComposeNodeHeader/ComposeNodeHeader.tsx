import { Button } from "@canonical/react-components";
// import { createBrowserHistory } from "history";
import SectionHeader from "app/base/components/SectionHeader";
import { Link } from "react-router-dom";

const ComposeNodeHeader = (): JSX.Element => {
  // const history = createBrowserHistory();

  const getHeaderButtons = () => {
    return [
      <Button element={Link} key="list-node" to="/drut-cdi">
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
      buttons={getHeaderButtons()}
      subtitle="Create a machine"
      title="Compose Node"
    />
  );
};

ComposeNodeHeader.protoTypes = {};

export default ComposeNodeHeader;
