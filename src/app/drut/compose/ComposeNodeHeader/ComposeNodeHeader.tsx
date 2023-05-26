import { Button } from "@canonical/react-components";
// import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";

const ComposeNodeHeader = (): JSX.Element => {
  // const history = createBrowserHistory();

  const getHeaderButtons = () => {
    return [
      <Button element={Link} key="list-node" to="/drut-cdi">
        Dashboard
      </Button>,
    ];
  };

  return (
    <SectionHeader
      buttons={getHeaderButtons()}
      title="Compose Node"
      subtitle="Create a machine"
    />
  );
};

ComposeNodeHeader.protoTypes = {};

export default ComposeNodeHeader;
