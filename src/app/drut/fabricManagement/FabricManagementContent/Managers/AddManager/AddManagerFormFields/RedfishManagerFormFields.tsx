import { Col, Row, Select } from "@canonical/react-components";
import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { useFormikContext } from "formik";

import classess from "../AddManager.module.css";
import { REDIFISH_MANAGER_PROTOCOLS } from "../constants";
import type { Manager } from "../type";

type Props = {
  managerToUpdate?: Manager;
};

export const RedfishManagerFormFields = <V extends AnyObject>({
  managerToUpdate,
}: Props): JSX.Element => {
  const { handleChange, setFieldValue, values } = useFormikContext<V>();

  return (
    <>
      {
        <>
          <Row className={classess.redfish_url_block}>
            {!managerToUpdate && (
              <Row className={classess.manager_url_block}>
                <Col size={2}>
                  <FormikField
                    component={Select}
                    disabled={managerToUpdate ? true : false}
                    label="Protocol"
                    name="protocol"
                    onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                      handleChange(evt);
                      setFieldValue("protocol", evt.target.value);
                      setFieldValue(
                        "remote_redfish_uri",
                        `${evt.target.value}://${values.ip_address}${
                          values.port ? `:${values.port}` : ""
                        }/redfish/v1`
                      );
                    }}
                    options={[
                      {
                        label: "Select Protocol",
                        value: "",
                        disabled: true,
                      },
                      ...REDIFISH_MANAGER_PROTOCOLS.map((protocol) => ({
                        key: `protocol-${protocol}`,
                        label: protocol,
                        value: protocol,
                      })),
                    ]}
                    required
                  />
                </Col>
                <Col className={classess.colon_text} size={1}>
                  <span>
                    <strong>&#58;&#47;&#47;</strong>
                  </span>
                </Col>
                <Col size={3}>
                  <FormikField
                    disabled={managerToUpdate ? true : false}
                    label="IP Address"
                    name="ip_address"
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("ip_address", evt.target.value);
                      setFieldValue(
                        "remote_redfish_uri",
                        `${values.protocol}://${evt.target.value}${
                          values.port ? `:${values.port}` : ""
                        }/redfish/v1`
                      );
                    }}
                    placeholder="IP Address"
                    required={true}
                    type="text"
                  />
                </Col>
                <Col className={classess.colon_text} size={1}>
                  <span>
                    <strong>&#58;</strong>
                  </span>
                </Col>
                <Col size={1}>
                  <FormikField
                    disabled={managerToUpdate ? true : false}
                    label="Port"
                    name="port"
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("port", evt.target.value);
                      setFieldValue(
                        "remote_redfish_uri",
                        `${values.protocol}://${values.ip_address}${
                          evt.target.value ? `:${evt.target.value}` : ""
                        }/redfish/v1`
                      );
                    }}
                    placeholder="Port"
                    required={
                      values.manager_type !== "BMC" &&
                      values.protocol !== "https"
                    }
                    type="text"
                  />
                </Col>
                <Col className={classess.colon_text} size={1}>
                  <span>
                    <strong>/redfish/v1</strong>
                  </span>
                </Col>
              </Row>
            )}
            <Row className={classess.static_url_field}>
              {!managerToUpdate && (
                <div className={classess.static_url_field_border}></div>
              )}
              <Col size={6}>
                <div className={classess.update_manager_static_label}>
                  Remote Redfish URL
                </div>
                <div className={classess.update_manager_static_content}>
                  <strong>
                    {values?.remote_redfish_uri
                      ? `${values.remote_redfish_uri}`
                      : "http://IP_Address:Port/redfish/v1"}
                  </strong>
                </div>
              </Col>
            </Row>
          </Row>
        </>
      }
    </>
  );
};

export default RedfishManagerFormFields;
