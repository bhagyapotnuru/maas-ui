//20-01-23 Delete manager funnctionality yet to decide.
import { useState } from "react";

import { Col, Row, Spinner, Notification } from "@canonical/react-components";

// import { deleteData } from "../../../../config";

import FormikForm from "app/base/components/FormikForm";
import type { EmptyObject } from "app/base/types";
import tagsURLs from "app/tags/urls";

type Props = {
  onClose: () => void;
  managerData: any;
  setFetchManagers: (value: boolean) => void;
  setError: (error: string) => void;
};

export const DeleteManagerForm = ({
  onClose,
  setFetchManagers,
  managerData,
  setError,
}: Props): JSX.Element | null => {
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    onClose();
  };

  const deleteManager = (manager: any) => {
    setLoading(true);
    // deleteData(`dfab/managers/${manager?.id}/`)
    //   .then(
    //     (response) => {
    //       if (response.status === 200) {
    //         setLoading(false);
    //         setFetchManagers(true);
    //       } else {
    //         response.text().then((text: string) => {
    //           setError(
    //             text.includes("ConstraintViolationException")
    //               ? "Manager cannot be delete."
    //               : text
    //           );
    //         });
    //       }
    //     },
    //     (error: any) => {
    //       setError(error);
    //     }
    //   )
    //   .finally(() => onClose());
    setLoading(false);
    setError("");
  };
  return (
    <>
      {loading ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text="Deleting Manager..."
            key={`deleteManagerSpinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <FormikForm<EmptyObject>
          aria-label="Delete Manager"
          buttonsAlign="right"
          buttonsBordered={true}
          initialValues={{}}
          onCancel={onCancel}
          onSaveAnalytics={{
            action: "Delete",
            category: "Delete Manager form",
            label: "Delete Manager",
          }}
          onSubmit={() => {
            deleteManager(managerData);
          }}
          onSuccess={() => {
            onClose();
          }}
          savedRedirect={tagsURLs.tags.index}
          submitAppearance="negative"
          submitLabel="Delete"
        >
          <Row>
            <Col size={6}>
              <h4 className="u-nudge-down--small">
                {`${managerData?.name} will be deleted. Are you sure?`}
              </h4>
            </Col>
          </Row>
        </FormikForm>
      )}
    </>
  );
};

export default DeleteManagerForm;
