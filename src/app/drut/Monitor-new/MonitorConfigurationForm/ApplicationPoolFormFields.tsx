import type { ChangeEvent } from "react";

import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import type { RootState } from "app/store/root/types";

type SetApplicationPool = {
  poolSelection?: string;
  name: string;
  description?: string;
};

export const ApplicationPoolFormFields = (): JSX.Element => {
  const { applicationPools } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );
  const { handleChange, values, setFieldValue, setFieldTouched } =
    useFormikContext<SetApplicationPool>();

  const handleRadioChange = (evt: ChangeEvent<HTMLInputElement>) => {
    handleChange(evt);
    setFieldValue("name", "");
    setFieldTouched("name", false, false);
  };

  return (
    <Row>
      <Col size={6}>
        <ul className="p-inline-list u-equal-height u-no-margin--bottom">
          <li className="p-inline-list__item">
            <FormikField
              data-testid="select-pool"
              label="Select pool"
              name="poolSelection"
              onChange={handleRadioChange}
              type="radio"
              value="select"
            />
          </li>
          <li className="p-inline-list__item">
            <FormikField
              data-testid="create-pool"
              label="Create pool"
              name="poolSelection"
              onChange={handleRadioChange}
              type="radio"
              value="create"
            />
          </li>
        </ul>
        {values.poolSelection === "select" ? (
          <Col size={3}>
            <FormikField
              component={Select}
              label="Application Pool"
              name="name"
              value={values.name}
              options={[
                { label: "Select Application Pool", value: "", disabled: true },
                ...applicationPools?.map((pool: any) => ({
                  key: `pool-${pool}`,
                  label: pool.name,
                  value: pool.name,
                })),
              ]}
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                handleChange(evt);
                setFieldValue("name", evt.target.value);
              }}
              required
            />
          </Col>
        ) : (
          <>
            <FormikField label="Name" name="name" required type="text" />
            <FormikField label="Description" name="description" type="text" />
          </>
        )}
      </Col>
    </Row>
  );
};

export default ApplicationPoolFormFields;
