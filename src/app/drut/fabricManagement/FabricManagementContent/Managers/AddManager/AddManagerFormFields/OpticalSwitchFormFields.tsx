import { Col, Row, Select } from "@canonical/react-components";
import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { useFormikContext } from "formik";

import { OPTICAL_SWITCH_PROTOCOLS, VENDORS } from "../constants";
import type { Manager } from "../type";

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
                disabled={!!managerToUpdate}
                label="Vendor"
                name="manufacturer"
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(evt);
                  setFieldValue("manufacturer", evt.target.value);
                }}
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
                required
                style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
              />
            </Col>
            <Col size={3}>
              <FormikField
                disabled={!!managerToUpdate}
                label="IP Address"
                name="ip_address"
                placeholder="IP Address"
                required={true}
                style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
                type="text"
              />
            </Col>
            <Col size={2}>
              <FormikField
                component={Select}
                disabled={!!managerToUpdate}
                label="Protocol"
                name="protocol"
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(evt);
                  setFieldValue("protocol", evt.target.value);
                }}
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
                required
                style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
              />
            </Col>
            <Col size={2}>
              <FormikField
                disabled={!!managerToUpdate}
                label={`${values.protocol} Port`}
                name="port"
                placeholder={`${values.protocol} Port`}
                required={true}
                style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
                type="text"
              />
            </Col>
          </Row>
        </>
      }
    </>
  );
};

export default OpticalSwitchFormFields;
