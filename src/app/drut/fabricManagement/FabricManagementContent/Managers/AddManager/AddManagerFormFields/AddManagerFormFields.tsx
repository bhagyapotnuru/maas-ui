import { useEffect, useState } from "react";

import { Col, Row, Select } from "@canonical/react-components";
import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { useFormikContext } from "formik";

import { MANAGER_TYPES } from "../constants";
import type { Manager, Zone, Rack } from "../type";

import OpticalSwitchFormFields from "./OpticalSwitchFormFields";
import RedfishManagerFormFields from "./RedfishManagerFormFields";

type Props = {
  zoneRackPairs: Zone[];
  setSelectedZone: (type: string) => void;
  setSelectedManagerType: (type: string) => void;
  selectedZone: string;
  selectedManagerType: string;
  managerToUpdate?: Manager;
};

export const AddManagerFormFields = <V extends AnyObject>({
  zoneRackPairs,
  setSelectedZone,
  setSelectedManagerType,
  selectedZone,
  selectedManagerType,
  managerToUpdate,
}: Props): JSX.Element => {
  const { handleChange, setFieldValue, values } = useFormikContext<V>();
  const [racks, setRacks] = useState<Rack[]>([]);

  useEffect(() => {
    if (selectedZone || managerToUpdate?.zone_id) {
      const zoneId = selectedZone ? +selectedZone : managerToUpdate?.zone_id;
      const result = zoneRackPairs.find(
        (zone: Zone) => +zone.zone_id === zoneId
      );
      if (result) {
        setRacks(result?.racks);
      }
    }
  }, [selectedZone, managerToUpdate]);

  const getDefaultProtocol = (managerType: string) => {
    if (managerType) {
      switch (managerType) {
        case "OXC": {
          return "TL1";
        }
        case "BMC": {
          return "https";
        }
        default: {
          return "http";
        }
      }
    } else return;
  };

  const getDescription = (
    zone_fqgn: string,
    rack_fqgn: string,
    name: string
  ) => {
    return `${zone_fqgn || ""}${rack_fqgn ? `.${rack_fqgn}` : ""}${
      name ? `${zone_fqgn ? "." : ""}${name}` : ""
    }`;
  };

  return (
    <>
      <Row>
        <Col size={2}>
          <FormikField
            component={Select}
            disabled={managerToUpdate ? true : false}
            label="Manager Type"
            name="manager_type"
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("manager_type", evt.target.value);
              setFieldValue("protocol", getDefaultProtocol(evt.target.value));
              setSelectedManagerType(evt.target.value);
            }}
            options={[
              { label: "Select Manager Type", value: "", disabled: true },
              ...MANAGER_TYPES.map((managerType) => ({
                key: `manager-type-${managerType}`,
                label: managerType,
                value: managerType,
              })),
            ]}
            required
            style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
          />
        </Col>
        <Col size={3}>
          <FormikField
            component={Select}
            label="Zone"
            name="zone_id"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(event);
              setFieldValue("zone_id", event.target.value);
              setFieldValue("rack_id", "");
              setFieldValue(
                "zone_fqgn",
                zoneRackPairs.find(
                  (zone: Zone) => +zone.zone_id === +event.target.value
                )?.zone_fqgn
              );
              setSelectedZone(event.target.value);
              setFieldValue(
                "description",
                getDescription(
                  zoneRackPairs.find(
                    (zone: Zone) => +zone.zone_id === +event.target.value
                  )?.zone_fqgn || "",
                  values?.rack_name as string,
                  values?.name as string
                )
              );
            }}
            options={[
              { label: "Select Zone", value: "", disabled: true },
              ...zoneRackPairs
                .filter(
                  (zoneRack) => zoneRack.zone_name.toLowerCase() !== "drut"
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
            disabled={
              managerToUpdate
                ? !!selectedZone && !managerToUpdate
                : !selectedZone
            }
            label="Rack"
            name="rack_id"
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("rack_id", evt.target.value);
              setFieldValue(
                "rack_name",
                racks.find((rack: Rack) => +rack.rack_id === +evt.target.value)
                  ?.rack_name
              );
              setFieldValue(
                "rack_fqgn",
                racks.find((rack: Rack) => +rack.rack_id === +evt.target.value)
                  ?.rack_fqgn
              );
              setFieldValue(
                "description",
                getDescription(
                  values?.zone_fqgn as string,
                  racks.find(
                    (rack: Rack) => +rack.rack_id === +evt.target.value
                  )?.rack_name || "",
                  values?.name as string
                )
              );
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
        <Col size={3}>
          <FormikField
            label="Name"
            name="name"
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(evt);
              setFieldValue(
                "description",
                getDescription(
                  values.zone_fqgn as string,
                  values.rack_name as string,
                  evt.target.value
                )
              );
            }}
            placeholder="Name"
            required={true}
            type="text"
          />
        </Col>
      </Row>
      {selectedManagerType && (
        <>
          {selectedManagerType === "OXC" ? (
            <OpticalSwitchFormFields managerToUpdate={managerToUpdate} />
          ) : (
            <RedfishManagerFormFields managerToUpdate={managerToUpdate} />
          )}
          {!managerToUpdate && (
            <Row>
              <Col size={2}>
                <FormikField
                  disabled={managerToUpdate ? true : false}
                  label={`${
                    selectedManagerType === "OXC" ? values.protocol : ""
                  } User Name`}
                  name="user_name"
                  placeholder={`${
                    selectedManagerType === "OXC" ? values.protocol : ""
                  } User Name`}
                  required={selectedManagerType === "OXC"}
                  type="text"
                />
              </Col>
              <Col size={2}>
                <FormikField
                  disabled={managerToUpdate ? true : false}
                  label={`${
                    selectedManagerType === "OXC" ? values.protocol : ""
                  } Password`}
                  name="password"
                  placeholder={`${
                    selectedManagerType === "OXC" ? values.protocol : ""
                  } Password`}
                  required={selectedManagerType === "OXC"}
                  type="password"
                />
              </Col>
              <Col size={6}>
                <FormikField
                  label="Description"
                  name="description"
                  placeholder="Description"
                  type="text"
                />
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default AddManagerFormFields;
