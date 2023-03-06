import { Col, Row } from "@canonical/react-components";
import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { Zone, Rack } from "../../Managers/AddManager/type";

import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";

type Props = {
  zones: Zone[];
  setSelectedZone: (value: string) => void;
  setSelectedRack: (value: string) => void;
  selectedZone: string;
  racks?: Rack[];
};

export const SetZoneFormFields = <V extends AnyObject>({
  zones,
  racks,
  setSelectedRack,
  setSelectedZone,
  selectedZone,
}: Props): JSX.Element => {
  const { handleChange, setFieldValue } = useFormikContext<V>();

  return (
    <>
      <Row>
        <Col size={3}>
          <FormikField
            component={Select}
            label="Zone"
            name="zone_id"
            options={[
              { label: "Select Zone", value: "", disabled: true },
              ...zones
                .filter(
                  (zoneRack: Zone) =>
                    zoneRack.zone_name.toLowerCase() !== "drut"
                )
                .map((zone: Zone) => ({
                  key: `zone_id-${zone.zone_id}`,
                  label: zone.zone_fqgn,
                  value: zone.zone_id,
                })),
            ]}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(event);
              setSelectedZone(event.target.value);
              setFieldValue("zone_id", event.target.value);
            }}
            required
          />
        </Col>
        <Col size={2}>
          <FormikField
            component={Select}
            label="Rack"
            disabled={!selectedZone}
            name="rack_id"
            options={
              !racks || racks.length === 0
                ? [
                    {
                      label: "There are no racks available",
                      value: "",
                      disabled: true,
                    },
                  ]
                : [
                    { label: "Select Rack", value: "", disabled: true },
                    ...racks?.map((rack: Rack) => ({
                      key: `rack_id-${rack?.rack_id}`,
                      label: rack?.rack_name,
                      value: +rack?.rack_id,
                    })),
                  ]
            }
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("rack_id", evt.target.value);
              setSelectedRack(evt.target.value);
            }}
            required
          />
        </Col>
      </Row>
    </>
  );
};

export default SetZoneFormFields;
