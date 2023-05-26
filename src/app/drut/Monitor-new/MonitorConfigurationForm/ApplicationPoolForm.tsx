import { useState } from "react";

import { Spinner, Notification } from "@canonical/react-components";
import * as Yup from "yup";

import type { MonitorConfiguration } from "../Types/MonitorConfiguration";

import ApplicationPoolFormFields from "./ApplicationPoolFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import { postData } from "app/drut/config";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  monitorConfigurationToSet: MonitorConfiguration[];
  setFetchConfigurations: (value: boolean) => void;
};

type SetApplicationPool = {
  poolSelection?: string;
  name: string;
  description?: string;
};

const SetApplicationPoolSchema = Yup.object().shape({
  description: Yup.string(),
  name: Yup.string().required("Application pool required"),
  poolSelection: Yup.string().oneOf(["create", "select"]).required(),
});

export const ApplicationPoolForm = ({
  clearHeaderContent,
  monitorConfigurationToSet,
  setFetchConfigurations,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);

  const updatePoolConfiguration = async (values: SetApplicationPool) => {
    if (values.poolSelection === "create") {
      const payload = values;
      delete payload["poolSelection"];
      const url = `dfab/applicationpools/`;
      setLoading(true);
      postData(url, payload).then((response: any) => {
        if (response.status === 200) {
          setConfigsToPool(values);
          setLoading(false);
        } else {
          response.text().then((text: string) => {
            setLoading(false);
          });
        }
      });
    } else {
      setConfigsToPool(values);
    }
  };

  const setConfigsToPool = async (values: SetApplicationPool) => {
    const updatedConfigs = monitorConfigurationToSet.map((config) => ({
      ...config,
      applicationpool: values.name,
    }));
    const url = `dfab/clusters/`;
    setLoading(true);
    postData(url, updatedConfigs, true)
      .then((response: any) => {
        if (response.status === 200) {
          setFetchConfigurations(true);
          setLoading(false);
        } else {
          response.text().then((text: string) => {
            setLoading(false);
          });
        }
      })
      .finally(() => {
        clearHeaderContent();
      });
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
            text={"Setting pool"}
            key={`set_pool_form_notification_${Math.random()}`}
          />
        </Notification>
      ) : (
        <FormikForm<SetApplicationPool>
          initialValues={{
            poolSelection: "select",
            name: "",
            description: "",
          }}
          onCancel={clearHeaderContent}
          onSaveAnalytics={{
            action: "Save",
            category: "Set Pool",
            label: "Set Pool",
          }}
          onSubmit={(values: SetApplicationPool) => {
            updatePoolConfiguration(values);
          }}
          onSuccess={() => {
            clearHeaderContent();
          }}
          resetOnSave
          submitLabel="Save"
          validationSchema={SetApplicationPoolSchema}
        >
          <ApplicationPoolFormFields />
        </FormikForm>
      )}
    </>
  );
};

export default ApplicationPoolForm;
