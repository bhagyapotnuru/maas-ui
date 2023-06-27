import { useState } from "react";

import { Spinner, Notification } from "@canonical/react-components";
import * as Yup from "yup";

import { SHELL_IN_A_BOX_CLUSTER_TYPES } from "../ShellInABoxWidget/constants";
import type {
  AddMonitorConfiguration,
  MonitorConfiguration,
} from "../Types/MonitorConfiguration";

import MonitorConfigurationFormFields from "./MonitorConfigurationFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import { createOrUpdateMonitorConfigurations } from "app/drut/api";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  monitorConfigurationToUpdate?: MonitorConfiguration | null;
  setFetchConfigurations: (value: boolean) => void;
};

const IP_ADDRESS_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
const PORT_REGEX =
  /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0][0-9]{1,4})|([0-9]{1,4}))$/;

const AddMonitorConfigurationSchema = Yup.object().shape({
  cluster_type: Yup.string().required("Select Type"),
  dashboard_protocol: Yup.string().required("Select protocol"),
  dashboard_ipaddress: Yup.string()
    .matches(IP_ADDRESS_REGEX, "Enter valid Url")
    .required("Url required"),
  dashboard_port: Yup.string()
    .matches(PORT_REGEX, "Enter valid Url")
    .required("Url required"),
  service_protocol: Yup.string().required("Select protocol"),
  service_ipaddress: Yup.string()
    .matches(IP_ADDRESS_REGEX, "Enter valid IP")
    .required("IP required"),
  service_port: Yup.string()
    .matches(PORT_REGEX, "Enter valid Port")
    .required("Port required"),
  service_model: Yup.string().required("Enter service model"),
  resourcepool: Yup.string().required("Select Resource pool"),
  header: Yup.string().required("Enter name"),
});

const AddMonitorConfigurationSchemaForKubeOps = Yup.object().shape({
  cluster_type: Yup.string().required("Select Type"),
  dashboard_protocol: Yup.string().required("Select protocol"),
  dashboard_ipaddress: Yup.string()
    .matches(IP_ADDRESS_REGEX, "Enter valid IP")
    .required("IP required"),
  dashboard_port: Yup.string()
    .matches(PORT_REGEX, "Enter valid port")
    .required("Port required"),
  header: Yup.string().required("Enter name"),
});

export const MonitorConfigurationForm = ({
  clearHeaderContent,
  monitorConfigurationToUpdate,
  setFetchConfigurations,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [selectedClusterType, setSelectedClusterType] = useState(
    monitorConfigurationToUpdate?.cluster_type || ""
  );

  const getGridLayoutValues = (
    values: AddMonitorConfiguration,
    checkIfUpdate: boolean
  ) => {
    if (!checkIfUpdate) {
      if (SHELL_IN_A_BOX_CLUSTER_TYPES.includes(values.cluster_type)) {
        {
          return {
            w: 12,
            h: 11,
            x: 0,
            y: 0,
            i: "",
            minW: 12,
            minH: 11,
            moved: false,
            static: false,
          };
        }
      } else {
        return {
          h: 11,
          i: "",
          w: 6,
          x: 0,
          y: 0,
          minH: 11,
          minW: 6,
          moved: false,
          static: false,
        };
      }
    } else {
      return values.gridlayout;
    }
  };

  const onSubmit = async (values: AddMonitorConfiguration) => {
    setLoading(true);
    const payLoad: MonitorConfiguration = {
      cluster_type: values.cluster_type,
      display: values.display,
      description: values.description,
      header: values.header,
      id: monitorConfigurationToUpdate?.id,
      dashboard_protocol: values.dashboard_protocol,
      dashboard_ipaddress: values.dashboard_ipaddress,
      dashboard_port: values.dashboard_port,
      user: values.user,
      password: values.password,
      gridlayout: getGridLayoutValues(values, !!monitorConfigurationToUpdate),
      resourcepool: values.resourcepool || "",
    } as MonitorConfiguration;
    if (SHELL_IN_A_BOX_CLUSTER_TYPES.includes(values.cluster_type)) {
      payLoad["service_protocol"] = values.service_protocol;
      payLoad["service_ipaddress"] = values.service_ipaddress;
      payLoad["service_port"] = values.service_port;
      payLoad["service_model"] = values.service_model;
    }
    const params = monitorConfigurationToUpdate?.id
      ? `${monitorConfigurationToUpdate?.id}/`
      : "";
    createOrUpdateMonitorConfigurations(
      params,
      payLoad,
      !!monitorConfigurationToUpdate?.id
    )
      .then(() => {
        clearHeaderContent();
        setFetchConfigurations(true);
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getValidationSchema = () => {
    if (monitorConfigurationToUpdate) {
      if (selectedClusterType === "KubeOpsView") {
        return AddMonitorConfigurationSchemaForKubeOps;
      } else {
        return AddMonitorConfigurationSchema;
      }
    } else {
      if (selectedClusterType === "KubeOpsView") {
        return AddMonitorConfigurationSchemaForKubeOps;
      } else {
        return AddMonitorConfigurationSchema;
      }
    }
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
              monitorConfigurationToUpdate?.id
                ? "Updating Configuration..."
                : "Adding Configuration..."
            }`}
            key={`Add_monitor_configuration_spinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <FormikForm<AddMonitorConfiguration>
          initialValues={{
            cluster_type: monitorConfigurationToUpdate?.cluster_type || "",
            user: monitorConfigurationToUpdate?.user || "",
            password: monitorConfigurationToUpdate?.password || "",
            description: monitorConfigurationToUpdate?.description || "",
            header: monitorConfigurationToUpdate?.header || "",
            dashboard_protocol:
              monitorConfigurationToUpdate?.dashboard_protocol || "",
            dashboard_ipaddress:
              monitorConfigurationToUpdate?.dashboard_ipaddress || "",
            dashboard_port: monitorConfigurationToUpdate?.dashboard_port || "",
            service_protocol:
              monitorConfigurationToUpdate?.service_protocol || "",
            service_ipaddress:
              monitorConfigurationToUpdate?.service_ipaddress || "",
            service_port: monitorConfigurationToUpdate?.service_port || "",
            service_model: monitorConfigurationToUpdate?.service_model || "",
            resourcepool: monitorConfigurationToUpdate?.resourcepool || "",
            display: monitorConfigurationToUpdate
              ? monitorConfigurationToUpdate.display
              : true,
          }}
          onCancel={clearHeaderContent}
          onSaveAnalytics={{
            action: "Save",
            category: "Monitor Configurations",
            label: "Add New Configuration",
          }}
          onSubmit={(values: AddMonitorConfiguration) => {
            onSubmit(values);
          }}
          onSuccess={() => {
            clearHeaderContent();
          }}
          resetOnSave
          submitLabel="Save"
          validationSchema={getValidationSchema}
        >
          <MonitorConfigurationFormFields
            selectedClusterType={selectedClusterType}
            setSelectedClusterType={setSelectedClusterType}
          />
        </FormikForm>
      )}
    </>
  );
};

export default MonitorConfigurationForm;
