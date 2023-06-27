import { useContext } from "react";

import { Notification, Spinner } from "@canonical/react-components";

import ResoruceBlockReConfigContext from "../Store/resource-block-re-config-context";
import { loadingMsg } from "../Store/resource-block-re-config-provider";

import ManageFreePoolResource from "./Components/ManageFreePoolResource";
import ResourceBlockReConfigMainPageContent from "./ResourceBlockReConfigMainPageContent";

import DeleteConfirmationModal from "app/utils/Modals/DeleteConfirmationModal";

const ResourceBlockReConfigMainPage = (): JSX.Element => {
  const context = useContext(ResoruceBlockReConfigContext);
  const errorValue = context.error?.toString();
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
      {errorValue && !errorValue?.includes("AbortError") && (
        <Notification
          onDismiss={() => context.setError("")}
          inline
          severity="negative"
        >
          {errorValue}
        </Notification>
      )}
      {context.loading && context.loadingMessage === loadingMsg ? (
        <Notification inline severity="information">
          <Spinner text={context.loadingMessage} />
        </Notification>
      ) : (
        <ResourceBlockReConfigMainPageContent />
      )}
    </>
  );
};
export default ResourceBlockReConfigMainPage;
