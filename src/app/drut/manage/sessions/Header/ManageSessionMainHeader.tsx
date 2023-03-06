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
      key="manageSessionHeader"
      buttons={getHeaderButtons()}
      title="Session List"
      subtitle={"All active sessions."}
    />
  );
};

ManageSessionMainHeader.protoTypes = {};

export default ManageSessionMainHeader;
