import { useState } from "react";

import { Col, Row, Spinner, Notification } from "@canonical/react-components";
import FormikForm from "app/base/components/FormikForm";
import type { EmptyObject } from "app/base/types";
import tagsURLs from "app/tags/urls";

import { deleteData } from "../../../../config";
import type { Group } from "../type";

type Props = {
  onClose: () => void;
  groupData: Group | null;
  setFetchGroups: (value: boolean) => void;
  setError: (error: string) => void;
};

export const DeleteGroupForm = ({
  onClose,
  setFetchGroups,
  groupData,
  setError,
}: Props): JSX.Element | null => {
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    onClose();
  };

  const groupDeleteErrorMessage = (group: Group | null) => {
    const errorMessage =
      group?.category.toUpperCase() === "ZONE"
        ? `Before deleting ${group?.fqgn}, Please move or delete the Zones or Racks under it.`
        : `Before deleting ${group?.fqgn}, Please move the managers in it to another Rack.`;
    return errorMessage;
  };
  const deleteGroup = (group: Group | null) => {
    setLoading(true);
    deleteData(`dfab/nodegroups/${group?.id}/?name=${group?.name}`)
      .then(
        (response) => {
          if (response.status === 200) {
            setLoading(false);
            setFetchGroups(true);
          } else {
            response.text().then((text: string) => {
              setError(
                text.includes("ConstraintViolationException")
                  ? groupDeleteErrorMessage(group)
                  : text
              );
            });
          }
        },
        (error: any) => {
          setError(error);
        }
      )
      .finally(() => onClose());
  };
  return (
    <>
      {loading ? (
        <Notification
          inline
          key={`notification_${Math.random()}`}
          severity="information"
        >
          <Spinner
            key={`deleteGroupSpinner_${Math.random()}`}
            text="Deleting Group..."
          />
        </Notification>
      ) : (
        <FormikForm<EmptyObject>
          aria-label="Delete group"
          buttonsAlign="right"
          buttonsBordered={true}
          initialValues={{}}
          onCancel={onCancel}
          onSaveAnalytics={{
            action: "Delete",
            category: "Delete group form",
            label: "Delete group",
          }}
          onSubmit={() => {
            deleteGroup(groupData);
          }}
          onSuccess={() => {
            onClose();
          }}
          savedRedirect={tagsURLs.index}
          submitAppearance="negative"
          submitLabel="Delete"
        >
          <Row>
            <Col size={6}>
              <h4 className="u-nudge-down--small">
                {`${groupData?.fqgn} will be deleted. Are you sure?`}
              </h4>
            </Col>
          </Row>
        </FormikForm>
      )}
    </>
  );
};

export default DeleteGroupForm;
