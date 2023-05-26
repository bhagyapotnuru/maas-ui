import { Button } from "@canonical/react-components";
import { Link } from "react-router-dom";

import SectionHeader from "app/base/components/SectionHeader";

const ResourceBlockReConfigHeader = (): JSX.Element => {
  const getHeaderButtons = () => {
    return [
      <Button element={Link} key="resources" to="/drut-cdi/resources">
        Resources
      </Button>,
      <Button element={Link} key="compose-node" to="/drut-cdi/compose-node">
        Compose
      </Button>,
    ];
  };
  return (
    <SectionHeader
      buttons={getHeaderButtons()}
      title="Reconfigure Resource Block"
      subtitle=""
    />
  );
};

export default ResourceBlockReConfigHeader;
