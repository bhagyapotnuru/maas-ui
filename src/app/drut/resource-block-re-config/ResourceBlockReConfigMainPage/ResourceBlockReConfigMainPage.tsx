import { useContext } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import ResoruceBlockReConfigContext from "../Store/resource-block-re-config-context";

import ManageFreePoolResource from "./Components/ManageFreePoolResource";
import ResourceBlockReConfigMainPageContent from "./ResourceBlockReConfigMainPageContent";

import DeleteConfirmationModal from "app/utils/Modals/DeleteConfirmationModal";

const ResourceBlockReConfigMainPage = (): JSX.Element => {
  const context = useContext(ResoruceBlockReConfigContext);
  return (
    <>
      {context.showFreePoolResourcePopup && (
        <ManageFreePoolResource
          onClickBackDrop={context.onBackDropClickFreePoolResource}
          onClickCancel={context.onCancelAttachFreePoolResource}
        />
      )}
      {context.resourceToDelete &&
        Object.keys(context.resourceToDelete).length > 0 && (
          <DeleteConfirmationModal
            title="Delete Confirmation"
            message={`Resource "${context.resourceToDelete.Name}"
            will be removed from "${context.currentRBToAttachOrDetachResource.Name}" 
            and will be moved to free pool. Are you sure ?`}
            onConfirm={context.onConfirmRemoveResourceHandler}
            onClickBackDrop={context.onDeletePopUpBackDropClickHandler}
            onClickCancel={context.onDeletePopUpCancelHandler}
            isActionInProgress={context.isAttachDetachInProgress}
            inProgressMessage={"Removing..."}
            error={context.attachDetachError}
            setError={context.setAttachDetachError}
          />
        )}
      {context.error && context.error.length && (
        <Notification
          key={`notification_${Math.random()}`}
          onDismiss={() => context.setError("")}
          inline
          severity="negative"
        >
          {context.error}
        </Notification>
      )}
      {context.loading && (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text={context.loadingMessage}
            key={`managerListSpinner_${Math.random()}`}
          />
        </Notification>
      )}
      <div>
        <ResourceBlockReConfigMainPageContent />
      </div>
    </>
  );
};
export default ResourceBlockReConfigMainPage;
