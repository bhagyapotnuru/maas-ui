/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { Spinner, Notification } from "@canonical/react-components";
import * as Yup from "yup";

import type { Zone, Rack, Manager } from "../../Managers/AddManager/type";

import SetZoneFormFields from "./SetZoneFormFields";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import { postData } from "app/drut/config";

type setZoneForm = {
  zone_id: string;
  rack_id: string;
};

type Props = {
  clearHeaderContent: ClearHeaderContent;
  setError: (value: string) => void;
  setFetchManagers: (value: boolean) => void;
  managerToMove: Manager[];
  zones: Zone[];
};

export const AddManagerForm = ({
  clearHeaderContent,
  setError,
  setFetchManagers,
  managerToMove,
  zones,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [racks, setRacks] = useState<Rack[] | undefined>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedRack, setSelectedRack] = useState("");

  const updateManagers = (
    managersTobeUpdated: Manager[],
    zone_id: string,
    rack_id: string
  ) => {
    const racks =
      zones.find((zone: Zone) => zone.zone_id === +zone_id)?.racks || [];
    const rackObj = racks.find((rack: Rack) => rack.rack_id === +rack_id);
    const updateManagersPayoad: Manager[] = managersTobeUpdated.map(
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
    setLoading(true);
    postData(`dfab/managers/`, updateManagersPayoad, true)
      .then((response: any) => {
        if (response.status === 200) {
          setFetchManagers(true);
          setLoading(false);
          clearHeaderContent();
          return response.json();
        } else {
          response.text().then((text: string) => {
            setLoading(true);
            const isConstraintViolation: boolean = text.includes(
              "ConstraintViolationException"
            );
            const errorMsg = `Manager name already exists in rack ${rackObj?.rack_name}  Cannot be created with a duplicate name.`;
            setError(isConstraintViolation ? errorMsg : text);
          });
        }
      })
      .catch((e: any) => setError(e));
  };

  useEffect(() => {
    const racks: Rack[] | undefined = zones.find(
      (zone: Zone) => zone.zone_id === +selectedZone
    )?.racks;
    if (racks) {
      setRacks(racks);
    }
  }, [selectedZone]);

  const SetZoneSchema = Yup.object().shape({
    rack_id: Yup.string().required("Rack required"),
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
      {loading ? (
        <Notification
          inline
          key={`notification_${Math.random()}`}
          severity="information"
        >
          <Spinner
            key={`Set_Zone_spinner_${Math.random()}`}
            text={`Adding managers to ${getRackName(
              selectedZone,
              selectedRack
            )}`}
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
            updateManagers(managerToMove, selectedZone, selectedRack);
          }}
          onSuccess={() => {
            clearHeaderContent();
          }}
          resetOnSave
          submitLabel="Save"
          validationSchema={SetZoneSchema}
        >
          <SetZoneFormFields
            racks={racks}
            selectedZone={selectedZone}
            setSelectedRack={setSelectedRack}
            setSelectedZone={setSelectedZone}
            zones={zones}
          />
        </FormikForm>
      )}
    </>
  );
};

export default AddManagerForm;
