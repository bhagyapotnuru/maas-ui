import { Button } from "@canonical/react-components";
import SectionHeader from "app/base/components/SectionHeader";
import { Link } from "react-router-dom";

const ComposeNodeHeader = (): JSX.Element => {
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
      subtitle="Create a machine"
      title="Compose Node"
    />
  );
};

ComposeNodeHeader.protoTypes = {};

export default ComposeNodeHeader;
