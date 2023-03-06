import { useState } from "react";

import { Spinner, Notification } from "@canonical/react-components";
import * as Yup from "yup";

import { postData } from "../../../../../config";
import type { Group } from "../../type";
import AddGroupFormFields from "../AddGroupFormFields";
import type { AddGroupValues } from "../type";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  groupToUpdate?: Group | null;
  setFetchGroups: (value: boolean) => void;
  groupList: Group[];
  setError: (error: string) => void;
};

const AddGroupSchema = Yup.object().shape({
  parentGroupName: Yup.string().required(),
  name: Yup.string().required(),
  type: Yup.string().required(),
  category: Yup.string().required(),
  fqgn: Yup.string().required(),
});

export const AddGroupForm = ({
  clearHeaderContent,
  groupToUpdate,
  setFetchGroups,
  groupList,
  setError,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);

  const createUpdateGroup = (
    groupToAddorUpdate: AddGroupValues,
    url: string,
    isUpdateOperation: boolean
  ) => {
    delete groupToAddorUpdate["fqgn"];
    const parentGroup = groupList.find(
      (group) => group.name === groupToAddorUpdate.parentGroupName
    );
    groupToAddorUpdate.parentGroupId = parentGroup?.id;
    setLoading(true);
    postData(url, groupToAddorUpdate, isUpdateOperation)
      .then((response: any) => {
        if (response.status === 200) {
          setLoading(false);
          setFetchGroups(true);
          return response.json();
        } else {
          response.text().then((text: string) => {
            setLoading(true);
            const isConstraintViolation: boolean = text.includes(
              "ConstraintViolationException"
            );
            const errorMsg = isUpdateOperation
              ? "Group name already exists. Cannot be update with a duplicate name."
              : "Group name already exists. Cannot be created with a duplicate name.";
            setError(isConstraintViolation ? errorMsg : text);
          });
        }
      })
      .finally(() => clearHeaderContent());
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
              groupToUpdate?.id ? "Updating Group..." : "Adding Group..."
            }`}
            key={`Add_groups_spinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <FormikForm<AddGroupValues>
          initialValues={{
            parentGroupName: groupToUpdate?.parentGroupName || "",
            name: groupToUpdate?.name || "",
            type: groupToUpdate?.type || "Physical",
            category:
              groupToUpdate?.category
                .charAt(0)
                .toUpperCase()
                .concat(groupToUpdate?.category.slice(1).toLowerCase()) || "",
            fqgn: groupToUpdate?.fqgn || "",
          }}
          onCancel={clearHeaderContent}
          onSaveAnalytics={{
            action: "Save",
            category: "Groups",
            label: "Add Group Form",
          }}
          onSubmit={(values: AddGroupValues) => {
            if (groupToUpdate) {
              createUpdateGroup(
                values,
                `dfab/nodegroups/${groupToUpdate?.id}/`,
                true
              );
            } else {
              createUpdateGroup(values, `dfab/nodegroups/`, false);
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
            parentGroups={groupList.filter(
              (group) =>
                group.category.toLowerCase() === "zone" &&
                group.id !== groupToUpdate?.id
            )}
          />
        </FormikForm>
      )}
    </>
  );
};

export default AddGroupForm;
