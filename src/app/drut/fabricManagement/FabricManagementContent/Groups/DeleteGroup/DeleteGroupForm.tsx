import { Col, Row, Spinner, Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "app/base/components/FormikForm";
import type { EmptyObject } from "app/base/types";
import { actions, deleteGroup } from "app/store/drut/groups/slice";
import type { RootState } from "app/store/root/types";
import tagsURLs from "app/tags/urls";

export const DeleteGroupForm = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const { loading, addOrDeleteGroup } = useSelector(
    (state: RootState) => state.Group
  );

  return (
    <>
      {loading ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text="Deleting Group..."
            key={`deleteGroupSpinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <FormikForm<EmptyObject>
          aria-label="Delete group"
          buttonsAlign="right"
          buttonsBordered={true}
          initialValues={{}}
          onCancel={() => dispatch(actions.setRenderDeleteGroupsForm(false))}
          onSaveAnalytics={{
            action: "Delete",
            category: "Delete group form",
            label: "Delete group",
          }}
          onSubmit={() => {
            dispatch(deleteGroup(addOrDeleteGroup));
          }}
          onSuccess={() => {
            dispatch(actions.setRenderDeleteGroupsForm(false));
          }}
          savedRedirect={tagsURLs.tags.index}
          submitAppearance="negative"
          submitLabel="Delete"
        >
          <Row>
            <Col size={6}>
              <h4 className="u-nudge-down--small">
                {`${addOrDeleteGroup?.fqgn} will be deleted. Are you sure?`}
              </h4>
            </Col>
          </Row>
        </FormikForm>
      )}
    </>
  );
};

export default DeleteGroupForm;
