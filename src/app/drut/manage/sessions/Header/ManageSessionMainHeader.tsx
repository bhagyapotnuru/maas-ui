// import { ContextualMenu } from "@canonical/react-components";

import SectionHeader from "app/base/components/SectionHeader";

const ManageSessionMainHeader = (): JSX.Element => {
  // const history = createBrowserHistory();

  const getHeaderButtons = () => {
    return []; /*[
      <ContextualMenu
        hasToggleIcon
        className="drut-button"
        links={[
          {
            children: "Delete User",
          },
          {
            children: "Export Data",
          },
        ]}
        position="right"
        toggleLabel="Action"
      />,
    ];*/
  };

  return (
    <SectionHeader
      buttons={getHeaderButtons()}
      key="manageSessionHeader"
      subtitle={"All active sessions."}
      title="Session List"
    />
  );
};

ManageSessionMainHeader.protoTypes = {};

export default ManageSessionMainHeader;
