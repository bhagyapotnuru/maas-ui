import { Col, Row, Select, Tooltip } from "@canonical/react-components";
import { position } from "@canonical/react-components/dist/components/Tooltip";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import classess from "../AddManager.module.css";
import { REDIFISH_MANAGER_PROTOCOLS } from "../constants";

import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { actions } from "app/store/drut/managers/slice";
import type { Manager } from "app/store/drut/managers/types";
import type { RootState } from "app/store/root/types";

type Props = {
  managerToUpdate?: Manager;
};

export const RedfishManagerFormFields = <V extends AnyObject>({
  managerToUpdate,
}: Props): JSX.Element => {
  const { handleChange, setFieldValue, values } = useFormikContext<V>();
  const { redfishurlEdit } = useSelector((state: RootState) => state.Managers);

  const dispatch = useDispatch();

  return (
    <Row className={classess.redfish_url_block}>
      {(!managerToUpdate || redfishurlEdit) && (
        <Row className={classess.manager_url_block}>
          <Col size={2}>
            <FormikField
              component={Select}
              label="Protocol"
              name="protocol"
              disabled={!managerToUpdate || redfishurlEdit ? false : true}
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
              required
            />
          </Col>
          <Col size={1} className={classess.colon_text}>
            <span>
              <strong>&#58;&#47;&#47;</strong>
            </span>
          </Col>
          <Col size={3}>
            <FormikField
              label="IP Address"
              name="ip_address"
              required={true}
              disabled={!managerToUpdate || redfishurlEdit ? false : true}
              placeholder="IP Address"
              type="text"
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue("ip_address", evt.target.value);
                setFieldValue(
                  "remote_redfish_uri",
                  `${values.protocol}://${evt.target.value}${
                    values.port ? `:${values.port}` : ""
                  }/redfish/v1`
                );
              }}
              autoComplete="off"
            />
          </Col>
          <Col size={1} className={classess.colon_text}>
            <span>
              <strong>&#58;</strong>
            </span>
          </Col>
          <Col size={1}>
            <FormikField
              label="Port"
              name="port"
              required={
                values.manager_type !== "BMC" && values.protocol !== "https"
              }
              disabled={!managerToUpdate || redfishurlEdit ? false : true}
              placeholder="Port"
              type="number"
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue("port", evt.target.value);
                setFieldValue(
                  "remote_redfish_uri",
                  `${values.protocol}://${values.ip_address}${
                    evt.target.value ? `:${evt.target.value}` : ""
                  }/redfish/v1`
                );
              }}
            />
          </Col>
          <Col size={1} className={classess.colon_text}>
            <span>
              <strong>/redfish/v1</strong>
            </span>
          </Col>
        </Row>
      )}
      <Row className={classess.static_url_field}>
        {(!managerToUpdate || redfishurlEdit) && (
          <div className={classess.static_url_field_border}></div>
        )}
        <Col size={6}>
          <div className={classess.update_manager_static_label}>
            Remote Redfish URL{" "}
            {!redfishurlEdit && (
              <Tooltip message="Edit" position={position.right}>
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(actions.setRedfishurlEdit(true));
                  }}
                >
                  <Edit style={{ height: 18, width: 18 }} />
                </IconButton>
              </Tooltip>
            )}
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
  );
};

export default RedfishManagerFormFields;
