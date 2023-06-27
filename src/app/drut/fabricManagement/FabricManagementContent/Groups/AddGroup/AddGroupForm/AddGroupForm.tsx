import { Spinner, Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddGroupFormFields from "../AddGroupFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import { addOrUpdateData } from "app/store/drut/groups/slice";
import type { AddGroupValues } from "app/store/drut/groups/types";
import type { RootState } from "app/store/root/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

const AddGroupSchema = Yup.object().shape({
  parentGroupName: Yup.string().required(),
  name: Yup.string().required(),
  type: Yup.string().required(),
  category: Yup.string().required(),
  fqgn: Yup.string().required(),
});

export const AddGroupForm = ({ clearHeaderContent }: Props): JSX.Element => {
  const { loading, addOrDeleteGroup, items } = useSelector(
    (state: RootState) => state.Group
  );
  const dispatch = useDispatch();
  const createUpdateGroup = (
    groupToAddorUpdate: AddGroupValues,
    id: string,
    isUpdateOperation: boolean
  ) => {
    delete groupToAddorUpdate["fqgn"];
    const parentGroup = items.find(
      (group) => group.fqgn === groupToAddorUpdate.parentGroupName
    );
    groupToAddorUpdate.parentGroupId = parentGroup?.id;
    groupToAddorUpdate.type = "Physical";
    dispatch(addOrUpdateData({ groupToAddorUpdate, id, isUpdateOperation }));
    clearHeaderContent();
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
            text={`${
              addOrDeleteGroup?.id ? "Updating Group..." : "Adding Group..."
            }`}
            key={`Add_groups_spinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <FormikForm<AddGroupValues>
          initialValues={{
            parentGroupName: addOrDeleteGroup?.parentGroupName || "",
            name: addOrDeleteGroup?.name || "",
            type: addOrDeleteGroup?.type || "Physical",
            category:
              addOrDeleteGroup?.category
                .charAt(0)
                .toUpperCase()
                .concat(addOrDeleteGroup?.category.slice(1).toLowerCase()) ||
              "",
            fqgn: addOrDeleteGroup?.fqgn || "",
          }}
          onCancel={clearHeaderContent}
          onSaveAnalytics={{
            action: "Save",
            category: "Groups",
            label: "Add Group Form",
          }}
          onSubmit={(values: AddGroupValues) => {
            if (addOrDeleteGroup) {
              createUpdateGroup(values, `${addOrDeleteGroup?.id}/`, true);
            } else {
              createUpdateGroup(values, "", false);
            }
          }}
          onSuccess={() => {
            clearHeaderContent();
          }}
          resetOnSave
          submitLabel="Save"
          validationSchema={AddGroupSchema}
        >
          <AddGroupFormFields
            parentGroups={items.filter(
              (group) =>
                group.category.toLowerCase() === "zone" &&
                group.id !== addOrDeleteGroup?.id
            )}
          />
        </FormikForm>
      )}
    </>
  );
};

export default AddGroupForm;
