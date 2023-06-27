import { useState, useEffect } from "react";

import { Spinner, Notification } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

import SetZoneFormFields from "./SetZoneFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import { createUpdateManager, actions } from "app/store/drut/managers/slice";
import type {
  Zone,
  Rack,
  Manager,
  RackByType,
} from "app/store/drut/managers/types";
import type { RootState } from "app/store/root/types";

type setZoneForm = {
  zone_id: string;
  rack_id: string;
};

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

export const AddManagerForm = ({ clearHeaderContent }: Props): JSX.Element => {
  const { selectedIds, zones, clearHeader, formLoading, unassignedManagers } =
    useSelector((state: RootState) => state.Managers);
  const dispatch = useDispatch();

  const [racks, setRacks] = useState<Rack[] | undefined>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedRack, setSelectedRack] = useState("");

  useEffect(() => {
    if (clearHeader) {
      clearHeaderContent();
      dispatch(actions.setClearHeader(false));
    }
  }, [clearHeader]);

  const updateManagers = (zone_id: string, rack_id: string) => {
    const racks =
      zones.find((zone: Zone) => zone.zone_id === +zone_id)?.racks || [];
    const rackObj = racks.find((rack: Rack) => rack.rack_id === +rack_id);
    const managersToUpdate: Manager[] = unassignedManagers.filter(
      (manager: Manager) => selectedIds.includes(manager.id || 0)
    );
    const updateManagersPayoad: Manager[] = managersToUpdate.map(
      (manager: Manager) => {
        return {
          id: manager.id,
          rack_id: rack_id,
          rack_name: rackObj?.rack_name,
          rack_fqgn: rackObj?.rack_fqgn,
          name: manager?.name,
        } as Manager;
      }
    );
    dispatch(
      createUpdateManager({
        params: "",
        data: updateManagersPayoad,
        isUpdateOperation: true,
      })
    );
  };

  useEffect(() => {
    const racks: Rack[] | RackByType | undefined = zones.find(
      (zone: Zone) => zone.zone_id === +selectedZone
    )?.racks;
    if (racks) {
      setRacks(racks);
    }
  }, [selectedZone]);

  const SetZoneSchema = Yup.object().shape({
    rack_id: Yup.string().required("Pool required"),
    zone_id: Yup.string().required("Zone required"),
  });

  const getRackName = (zoneId: string, rackId: string): string | undefined => {
    const racks =
      zones.find((zone: Zone) => zone.zone_id === +zoneId)?.racks || [];
    const rackName =
      racks.find((rack: Rack) => rack.rack_id === +rackId)?.rack_name || "";
    return rackName;
  };

  return (
    <>
      {formLoading ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text={`Adding managers to ${getRackName(
              selectedZone,
              selectedRack
            )}`}
            key={`Set_Zone_spinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <FormikForm<setZoneForm>
          initialValues={{
            rack_id: "",
            zone_id: "",
          }}
          onCancel={clearHeaderContent}
          onSaveAnalytics={{
            action: "Save",
            category: "Managers",
            label: "Add manager form",
          }}
          onSubmit={() => {
            updateManagers(selectedZone, selectedRack);
          }}
          onSuccess={() => {
            clearHeaderContent();
          }}
          resetOnSave
          submitLabel="Save"
          validationSchema={SetZoneSchema}
        >
          <SetZoneFormFields
            setSelectedRack={setSelectedRack}
            setSelectedZone={setSelectedZone}
            zones={zones}
            racks={racks}
            selectedZone={selectedZone}
          />
        </FormikForm>
      )}
    </>
  );
};

export default AddManagerForm;
