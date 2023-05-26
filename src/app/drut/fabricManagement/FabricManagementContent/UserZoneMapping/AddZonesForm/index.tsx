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
  AddZones,
  canBeAddedZonesData,
} from "app/store/drut/userzones/addzones/slice";
import { fetcUserZoneData } from "app/store/drut/userzones/slice";
import type { Data } from "app/store/drut/userzones/types";
import type { RootState } from "app/store/root/types";

type ZoneForm = {
  zone_id: any;
};

type Props = {
  clearHeaderContent: ClearHeaderContent;
  currentUser: Data | null;
};

export const AddZonesForm = ({
  clearHeaderContent,
  currentUser,
}: Props): JSX.Element => {
  const dispatch = useDispatch();

  const abortController = new AbortController();
  const { loading, items, saved, saving } = useSelector(
    (state: RootState) => state.AddZone
  );

  useEffect(() => {
    dispatch(
      canBeAddedZonesData({
        userId: currentUser?.user_id,
        signal: abortController.signal,
      })
    );
    return () => {
      abortController.abort();
    };
  }, []);

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
            label: "Add User Zones Form",
          }}
          onSubmit={(values: ZoneForm) => {
            dispatch(
              AddZones({
                user_id: currentUser?.user_id,
                zone: items?.filter((zone) =>
                  values.zone_id.includes(zone.zone_id.toString())
                ),
              })
            );
          }}
          onSuccess={() => {
            clearHeaderContent();
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
                label="Add Zones"
                name="zone_id"
                options={items.map((r) => ({
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

export default AddZonesForm;
