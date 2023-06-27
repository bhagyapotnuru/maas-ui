import { useState } from "react";

import { useDispatch } from "react-redux";

import classes from "../../../fabricManagement.module.scss";

import FormikForm from "app/base/components/FormikForm";
import type { EmptyObject } from "app/base/types";
import { deleteManagerData } from "app/drut/api";
import { actions } from "app/store/drut/managers/slice";
import type { Manager } from "app/store/drut/managers/types";

type Props = {
  onClose: () => void;
  managerToDelete: Manager | undefined;
};

export const DeleteManagerForm = ({
  onClose,
  managerToDelete,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();

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
      const promise: Response = await deleteManagerData(
        manager?.id,
        submitLabel === FORCE_DELETE
      );
      if (promise.ok) {
        dispatch(actions.setFetchManagers(true));
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
        submitDisabled={["composition", "crossconnects", "composednode"].some(
          (s) => deleteMessage.toLowerCase().includes(s)
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
