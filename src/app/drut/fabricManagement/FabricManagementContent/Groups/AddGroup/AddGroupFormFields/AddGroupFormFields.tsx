import { Col, Row, Select } from "@canonical/react-components";
import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { useFormikContext } from "formik";

import type { Group } from "../../type";

export const AddGroupFormFields = <V extends AnyObject>({
  parentGroups = [],
}: {
  parentGroups: Group[];
}): JSX.Element => {
  const groupTypes = ["Physical"];
  const groupCategories = ["Zone", "Rack"];

  const { handleChange, setFieldValue, values } = useFormikContext<V>();

  return (
    <>
      <Row>
        <Col size={3}>
          <FormikField
            component={Select}
            label="Parent group"
            name="parentGroupName"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(event);
              const parentGroup = parentGroups.find(
                (parentGroup) => parentGroup.name === event.target.value
              );
              setFieldValue("parentGroupName", event.target.value);
              setFieldValue("fqgn", `${parentGroup?.fqgn}.${values.name}`);
            }}
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
                  value: parentGroup.name,
                })),
            ]}
            required
          />
        </Col>
        <Col size={3}>
          <FormikField
            label="Group name"
            name="name"
            onChange={(event: any) => {
              const parentGroup = parentGroups.find(
                (parentGroup) => parentGroup.name === values.parentGroupName
              );
              setFieldValue("name", event.target.value);
              setFieldValue(
                "fqgn",
                `${parentGroup?.fqgn}.${event.target.value}`
              );
            }}
            placeholder="Enter valid group name"
            required={true}
            type="text"
          />
        </Col>
      </Row>
      <Row>
        <Col size={3}>
          <FormikField
            component={Select}
            label="Group Type"
            name="type"
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("type", evt.target.value);
            }}
            options={[
              { label: "Select Group Type", value: "", disabled: true },
              ...groupTypes.map((groupType) => ({
                key: `group-type-${groupType}`,
                label: groupType,
                value: groupType,
              })),
            ]}
            required
          />
        </Col>
        <Col size={3}>
          <FormikField
            component={Select}
            label="Group Category"
            name="category"
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("category", evt.target.value);
            }}
            options={[
              { label: "Select Category", value: "", disabled: true },
              ...groupCategories.map((groupCategory) => ({
                key: `category-${groupCategory}`,
                label: groupCategory,
                value: groupCategory,
                disabled:
                  (values.parentGroupName as string).toLowerCase() === "drut" &&
                  groupCategory === "Rack",
              })),
            ]}
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
