import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { Group } from "../../type";

import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";

export const AddGroupFormFields = <V extends AnyObject>({
  parentGroups = [],
}: {
  parentGroups: Group[];
}): JSX.Element => {
  const groupCategories = [
    { label: "Zone", value: "Zone" },
    { label: "Pool", value: "Rack" },
  ];

  const { handleChange, setFieldValue, values } = useFormikContext<V>();

  return (
    <>
      <Row>
        <Col size={3}>
          <FormikField
            component={Select}
            label="Parent group"
            name="parentGroupName"
            options={[
              { label: "Select Group", value: "", disabled: true },
              ...parentGroups
                .filter(
                  (parentGroup: Group) =>
                    parentGroup.name.toLowerCase() !== "default_zone"
                )
                .map((parentGroup: Group) => ({
                  key: `parentGroupName-${parentGroup.name}`,
                  label: parentGroup.fqgn,
                  value: parentGroup.fqgn,
                })),
            ]}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(event);
              const parentGroup = parentGroups.find(
                (parentGroup) => parentGroup.fqgn === event.target.value
              );
              setFieldValue("parentGroupName", event.target.value);
              setFieldValue("fqgn", `${parentGroup?.fqgn}.${values.name}`);
              setFieldValue("category", "");
            }}
            required
          />
        </Col>
        <Col size={3}>
          <FormikField
            label="Group name"
            name="name"
            required={true}
            onChange={(event: any) => {
              setFieldValue("name", event.target.value);
              setFieldValue(
                "fqgn",
                `${values.parentGroupName}.${event.target.value}`
              );
            }}
            placeholder="Enter valid group name"
            type="text"
          />
        </Col>
        <Col size={3}>
          <FormikField
            component={Select}
            label="Group Category"
            name="category"
            disabled={values.parentGroupName === ""}
            options={[
              { label: "Select Category", value: "", disabled: true },
              ...groupCategories.map((groupCategory) => ({
                key: `category-${groupCategory}`,
                label: groupCategory.label,
                value: groupCategory.value,
                disabled:
                  (values.parentGroupName as string).toLowerCase() === "drut" &&
                  groupCategory.label === "Pool",
              })),
            ]}
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("category", evt.target.value);
            }}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          <div>
            Fully qualified group name
            <br />
            <strong>{`${values?.fqgn}`}</strong>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AddGroupFormFields;
