import { useState } from "react";

import { Row, Col, Select } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { resetNodeById } from "app/drut/api";

type ResetForm = {
  type: string;
};

type Props = {
  setOpenResetForm: any;
  selectedNode: any;
  setError: any;
};

const actions: any = {
  On: "On",
  ForceOff: "Force Off",
  ForceRestart: "Force Restart",
  GracefulRestart: "Graceful Restart",
  GracefulShutdown: "Graceful Shutdown",
  PushPowerButton: "Push Power Button",
  PowerCycle: "Power Cycle",
};

export const Form = ({
  setOpenResetForm,
  selectedNode,
  setError,
}: Props): JSX.Element => {
  const [saving, setSaving] = useState(false);

  return (
    <FormikForm<ResetForm>
      initialValues={{ type: "" }}
      onCancel={() => setOpenResetForm(false)}
      onSaveAnalytics={{
        action: "Reset",
        category: "Node",
        label: "Node Reset Action Form",
      }}
      onSubmit={(values: ResetForm) => {
        setSaving(true);
        resetNodeById(selectedNode?.Id, { ResetType: values.type })
          .then(() => {
            setSaving(false);
            setOpenResetForm(false);
          })
          .catch((e) => {
            setSaving(false);
            setOpenResetForm(false);
            setError(e);
          });
      }}
      resetOnSave
      submitLabel="Save"
      saving={saving}
    >
      <Row>
        <Col size={4}>
          <FormikField
            component={Select}
            stacked={true}
            label="Reset Type"
            name="type"
            options={[
              { label: "Select Reset Type", value: "", disabled: true },
              ...Object.keys(actions).map((r: any) => ({
                value: r,
                label: actions[r],
              })),
            ]}
            required
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default Form;
