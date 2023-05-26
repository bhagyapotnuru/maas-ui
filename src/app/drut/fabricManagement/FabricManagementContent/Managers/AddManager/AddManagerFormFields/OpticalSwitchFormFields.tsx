import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import { OPTICAL_SWITCH_PROTOCOLS, VENDORS } from "../constants";
import type { Manager } from "../type";

import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";

type Props = {
  managerToUpdate?: Manager;
};

export const OpticalSwitchFormFields = <V extends AnyObject>({
  managerToUpdate,
}: Props): JSX.Element => {
  const { handleChange, setFieldValue, values } = useFormikContext<V>();

  return (
    <>
      {
        <>
          <Row>
            <Col size={3}>
              <FormikField
                component={Select}
                label="Vendor"
                disabled={!!managerToUpdate}
                style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
                name="manufacturer"
                options={[
                  {
                    label: "Select Vendor",
                    value: "",
                    disabled: true,
                  },
                  ...VENDORS.map((vendor) => ({
                    key: `manufacturer-${vendor}`,
                    label: vendor,
                    value: vendor,
                  })),
                ]}
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(evt);
                  setFieldValue("manufacturer", evt.target.value);
                }}
                required
              />
            </Col>
            <Col size={3}>
              <FormikField
                label="IP Address"
                disabled={!!managerToUpdate}
                style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
                name="ip_address"
                required={true}
                placeholder="IP Address"
                type="text"
                autoComplete="off"
              />
            </Col>
            <Col size={2}>
              <FormikField
                component={Select}
                label="Protocol"
                name="protocol"
                disabled={!!managerToUpdate}
                style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
                options={[
                  {
                    label: "Select Protocol",
                    value: "",
                    disabled: true,
                  },
                  ...OPTICAL_SWITCH_PROTOCOLS.map((protocol) => ({
                    key: `protocol-${protocol}`,
                    label: protocol,
                    value: protocol,
                  })),
                ]}
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(evt);
                  setFieldValue("protocol", evt.target.value);
                }}
                required
              />
            </Col>
            <Col size={2}>
              <FormikField
                disabled={!!managerToUpdate}
                style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
                name="port"
                required={true}
                placeholder={`${values.protocol} Port`}
                label={`${values.protocol} Port`}
                type="number"
              />
            </Col>
          </Row>
        </>
      }
    </>
  );
};

export default OpticalSwitchFormFields;
