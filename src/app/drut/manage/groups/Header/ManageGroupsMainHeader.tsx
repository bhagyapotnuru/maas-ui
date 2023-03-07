import SectionHeader from "app/base/components/SectionHeader";

const ManageRBMainHeader = (): JSX.Element => {
  // const history = createBrowserHistory();

  const getHeaderButtons = () => {
    return [];
  };

  /*
  <ContextualMenu
    hasToggleIcon
    className="drut-button"
    links={[
      {
        children: "Add New Group",
        onClick: () => history.push("resources"),
      },
    ]}
    position="right"
    toggleLabel="dFabric"
  />,*/

  return (
    <SectionHeader
      buttons={getHeaderButtons()}
      key="manageRBHeader"
      subtitle={"Manage groups for the resources/users."}
      title="Manage Groups"
    />
  );
};

ManageRBMainHeader.protoTypes = {};

export default ManageRBMainHeader;
