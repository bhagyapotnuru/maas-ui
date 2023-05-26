import { useState } from "react";

import classes from "../../../fabricManagement.module.scss";
import type { Manager } from "../AddManager/type";

import FormikForm from "app/base/components/FormikForm";
import type { EmptyObject } from "app/base/types";
import { deleteData } from "app/drut/config";

type Props = {
  onClose: () => void;
  managerToDelete: Manager | undefined;
  setFetchManagers: (value: boolean) => void;
};

export const DeleteManagerForm = ({
  onClose,
  setFetchManagers,
  managerToDelete,
}: Props): JSX.Element | null => {
  const DELETE = "Delete";
  const FORCE_DELETE = "Force Delete";

  const [loading, setLoading] = useState(false);
  const [submitLabel, setSubmitLabel] = useState(DELETE);

  const [deleteMessage, setDeleteMessage] = useState(
    `${managerToDelete?.name} - ${
      managerToDelete?.manager_type === "OXC"
        ? `https://${managerToDelete.ip_address}:${managerToDelete.port}`
        : managerToDelete?.remote_redfish_uri
    }  will be deleted. Are you sure ?`
  );

  const [error, setError] = useState("");

  const onCancel = () => {
    onClose();
  };

  const deleteManager = async (manager: Manager) => {
    try {
      setLoading(true);
      const promise: Response = await deleteData(
        `dfab/managers/${manager?.id}/?ForceDelete=${
          submitLabel === FORCE_DELETE
        }`
      );
      if (promise.ok) {
        setFetchManagers(true);
        onClose();
      } else if (promise.status === 412) {
        const message = await promise.text();
        setDeleteMessage(message);
        setSubmitLabel(FORCE_DELETE);
      } else {
        const error = await promise.text();
        setError(error);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <FormikForm<EmptyObject>
        aria-label="Delete Manager"
        buttonsAlign="right"
        buttonsBordered={false}
        initialValues={{}}
        onCancel={onCancel}
        onSubmit={() => {
          if (managerToDelete) {
            deleteManager(managerToDelete);
          }
        }}
        onSuccess={() => {
          onClose();
        }}
        submitAppearance="negative"
        submitLabel={submitLabel}
        loading={loading}
        saving={loading}
        errors={error}
        submitDisabled={["composition", "crossconnects"].some((s) =>
          deleteMessage.toLowerCase().includes(s)
        )}
        buttonsClassName={
          submitLabel === FORCE_DELETE ? classes["force-delete-button"] : ""
        }
      >
        {deleteMessage}
      </FormikForm>
    </>
  );
};

export default DeleteManagerForm;
