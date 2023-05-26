import { useEffect } from "react";

import {
  Spinner,
  Notification,
  Row,
  Col,
  Select,
} from "@canonical/react-components";
import { any } from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField/FormikField";
import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import {
  actions,
  deleteZones,
  fetcUserZoneData,
} from "app/store/drut/userzones/slice";
import type { Data } from "app/store/drut/userzones/types";
import type { RootState } from "app/store/root/types";

type ZoneForm = {
  zone_id: any;
};

type Props = {
  clearHeaderContent: ClearHeaderContent;
  currentUser: Data | null;
};

export const RemoveZonesForm = ({
  clearHeaderContent,
  currentUser,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { loading, saving, saved } = useSelector(
    (state: RootState) => state.UserZone
  );

  useEffect(() => {
    if (saved) {
      clearHeaderContent();
      dispatch(actions.cleanup());
      dispatch(fetcUserZoneData());
    }
  }, [saved]);

  return (
    <>
      {loading ? (
        <Notification inline severity="information">
          <Spinner text="Loading..." />
        </Notification>
      ) : (
        <FormikForm<ZoneForm>
          initialValues={{
            zone_id: any,
          }}
          onCancel={clearHeaderContent}
          onSaveAnalytics={{
            action: "Save",
            category: "User Zones",
            label: "Remove User Zones Form",
          }}
          onSubmit={(values: ZoneForm) => {
            currentUser?.user_id &&
              dispatch(
                deleteZones({
                  user_id: currentUser?.user_id,
                  zone_ids: values.zone_id,
                })
              );
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
                multiple
                label="Remove Zones"
                name="zone_id"
                options={currentUser?.zones.map((r) => ({
                  value: r.zone_id,
                  label: r.zone_fqgn,
                }))}
                required
              />
            </Col>
          </Row>
        </FormikForm>
      )}
    </>
  );
};

export default RemoveZonesForm;
