import { Col, Row, Select } from "@canonical/react-components";
import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { useFormikContext } from "formik";

import type { Zone, Rack } from "../../Managers/AddManager/type";

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
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(event);
              setSelectedZone(event.target.value);
              setFieldValue("zone_id", event.target.value);
            }}
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
            required
          />
        </Col>
        <Col size={2}>
          <FormikField
            component={Select}
            disabled={!selectedZone}
            label="Rack"
            name="rack_id"
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("rack_id", evt.target.value);
              setSelectedRack(evt.target.value);
            }}
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
            required
          />
        </Col>
      </Row>
    </>
  );
};

export default SetZoneFormFields;
