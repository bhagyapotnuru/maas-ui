import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import { OTHER_TYPES } from "../ShellInABoxWidget/constants";

import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import type { RootState } from "app/store/root/types";

type Props = {
  selectedClusterType: string;
  setSelectedClusterType: (value: string) => void;
};

export const MonitorConfigurationFormFields = <V extends AnyObject>({
  selectedClusterType,
  setSelectedClusterType,
}: Props): JSX.Element => {
  const { handleChange, setFieldValue, values } = useFormikContext<V>();
  const { clusterTypes, resourcePools } = useSelector(
    (state: RootState) => state.MonitorConfiguration
  );

  return (
    <>
      <Row>
        <Col size={3}>
          <FormikField
            label="Widget Name"
            name="header"
            required={true}
            onChange={(event: any) => {
              setFieldValue("header", event.target.value);
            }}
            placeholder="Enter valid widget name"
            type="text"
          />
        </Col>
        <Col size={3}>
          <FormikField
            component={Select}
            label="Type"
            name="cluster_type"
            options={[
              { label: "Select Type", value: "", disabled: true },
              ...clusterTypes?.map((type: any) => ({
                key: `type-${type}`,
                label: type,
                value: type,
              })),
            ]}
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("cluster_type", evt.target.value);
              setSelectedClusterType(evt.target.value);
            }}
            required
          />
        </Col>
        {selectedClusterType && selectedClusterType !== "KubeOpsView" && (
          <Col size={3}>
            <FormikField
              component={Select}
              label="Resource Pool"
              name="resourcepool"
              options={[
                { label: "Select Resource Pool", value: "", disabled: true },
                ...resourcePools?.map((resourcepool: any) => ({
                  key: `resourcepool-${resourcepool}`,
                  label: resourcepool.name,
                  value: resourcepool.name,
                })),
              ]}
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                handleChange(evt);
                setFieldValue("resourcepool", evt.target.value);
              }}
              required
            />
          </Col>
        )}
      </Row>
      {selectedClusterType && (
        <>
          {selectedClusterType !== "KubeOpsView" && (
            <div style={{ marginBottom: "10px", marginTop: "5px" }}>
              <strong>Dashboard Configuration URL</strong>
            </div>
          )}
          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: " 85%",
            }}
          >
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Col size={2}>
                <FormikField
                  component={Select}
                  label="Prototcol"
                  name="dashboard_protocol"
                  options={[
                    {
                      label: "Select Protocol",
                      value: "",
                      disabled: true,
                    },
                    ...["http", "https"].map((protocol) => ({
                      key: `protocol-${protocol}`,
                      label: protocol,
                      value: protocol,
                    })),
                  ]}
                  onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                    handleChange(evt);
                    setFieldValue("dashboard_protocol", evt.target.value);
                  }}
                  required
                />
              </Col>
              <Col size={1} style={{ paddingTop: "1.2rem" }}>
                <span>
                  <strong>&#58;&#47;&#47;</strong>
                </span>
              </Col>
              <Col size={3}>
                <FormikField
                  label={
                    OTHER_TYPES.includes(selectedClusterType)
                      ? "Configuration IP Address"
                      : "Dashboard IP Address"
                  }
                  name="dashboard_ipaddress"
                  required={true}
                  onChange={(event: any) => {
                    setFieldValue("dashboard_ipaddress", event.target.value);
                  }}
                  placeholder="Enter valid IP Address"
                  type="text"
                />
              </Col>
              <Col size={1} style={{ paddingTop: "1.2rem" }}>
                <span>
                  <strong>&#58;</strong>
                </span>
              </Col>
              <Col size={3}>
                <FormikField
                  label={
                    OTHER_TYPES.includes(selectedClusterType)
                      ? "Configuration Port"
                      : "Dashboard Port"
                  }
                  name="dashboard_port"
                  required={true}
                  onChange={(event: any) => {
                    setFieldValue("dashboard_port", event.target.value);
                  }}
                  placeholder="Enter valid Port"
                  type="text"
                />
              </Col>
              <Col size={2} style={{ marginLeft: "25px", marginTop: "22px" }}>
                <FormikField
                  defaultChecked={values.default as boolean}
                  label="Display"
                  name="display"
                  type="checkbox"
                />
              </Col>
            </Row>
          </Row>

          {selectedClusterType !== "KubeOpsView" && (
            <>
              <div style={{ marginBottom: "10px", marginTop: "5px" }}>
                <strong>Service Configuration URL</strong>
              </div>
              <Row
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: " 85%",
                }}
              >
                <Row
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Col size={1}>
                    <FormikField
                      component={Select}
                      label="Prototcol"
                      name="service_protocol"
                      options={[
                        {
                          label: "Select Protocol",
                          value: "",
                          disabled: true,
                        },
                        ...["http", "https"].map((protocol) => ({
                          key: `protocol-${protocol}`,
                          label: protocol,
                          value: protocol,
                        })),
                      ]}
                      onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                        handleChange(evt);
                        setFieldValue("service_protocol", evt.target.value);
                      }}
                      required
                    />
                  </Col>
                  <Col size={1} style={{ paddingTop: "1.2rem" }}>
                    <span>
                      <strong>&#58;&#47;&#47;</strong>
                    </span>
                  </Col>
                  <Col size={3}>
                    <FormikField
                      label={"IP Address"}
                      name="service_ipaddress"
                      required={true}
                      onChange={(event: any) => {
                        setFieldValue("service_ipaddress", event.target.value);
                      }}
                      placeholder="Enter valid IP address"
                      type="text"
                    />
                  </Col>
                  <Col size={1} style={{ paddingTop: "1.2rem" }}>
                    <span>
                      <strong>&#58;</strong>
                    </span>
                  </Col>
                  <Col size={2}>
                    <FormikField
                      label={"Port"}
                      name="service_port"
                      required={true}
                      onChange={(event: any) => {
                        setFieldValue("service_port", event.target.value);
                      }}
                      placeholder="Enter valid Port"
                      type="text"
                    />
                  </Col>
                  <Col size={2} style={{ paddingTop: "1.2rem", width: 273 }}>
                    <span>
                      <strong>{`/?cmd=juju&arg=status&model=`}</strong>
                    </span>
                  </Col>
                  <Col size={2}>
                    <FormikField
                      label={"Model"}
                      name="service_model"
                      required={true}
                      onChange={(event: any) => {
                        setFieldValue("service_model", event.target.value);
                      }}
                      placeholder="Enter valid model"
                      type="text"
                    />
                  </Col>
                </Row>
              </Row>
              <Row>
                <Col size={3}>
                  <FormikField
                    label="Username"
                    name="user"
                    onChange={(event: any) => {
                      setFieldValue("user", event.target.value);
                    }}
                    placeholder="Username"
                    type="text"
                  />
                </Col>
                <Col size={3}>
                  <FormikField
                    label="Password"
                    name="password"
                    onChange={(event: any) => {
                      setFieldValue("password", event.target.value);
                    }}
                    placeholder="Password"
                    type="password"
                  />
                </Col>
                <Col size={3}>
                  <FormikField
                    label="Description"
                    name="description"
                    onChange={(event: any) => {
                      setFieldValue("description", event.target.value);
                    }}
                    placeholder="Description"
                    type="text"
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
};

export default MonitorConfigurationFormFields;
