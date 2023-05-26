import SectionHeader from "app/base/components/SectionHeader";

const ManageRBMainHeader = (): JSX.Element => {
  // const history = createBrowserHistory();

  const getHeaderButtons = () => {
    return [];
  };

  return (
    <SectionHeader
      key="manageRBHeader"
      buttons={getHeaderButtons()}
      title="Manage Groups"
      subtitle={"Manage groups for the resources/users."}
    />
  );
};

ManageRBMainHeader.protoTypes = {};

export default ManageRBMainHeader;
