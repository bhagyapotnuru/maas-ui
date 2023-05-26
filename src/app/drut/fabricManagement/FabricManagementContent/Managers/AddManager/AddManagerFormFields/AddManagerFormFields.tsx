import { useEffect, useState } from "react";

import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import {
  MANAGER_TYPES,
  IP_ADDRESS_REGEX,
  PORT_REGEX,
  MANAGER_NAME_REGEX,
} from "../constants";
import type { Manager, Zone, Rack } from "../type";

import OpticalSwitchFormFields from "./OpticalSwitchFormFields";
import RedfishManagerFormFields from "./RedfishManagerFormFields";

import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";

type Props = {
  zoneRackPairs: Zone[];
  setSelectedZone: (type: string) => void;
  setSelectedManagerType: (type: string) => void;
  selectedZone: string;
  selectedManagerType: string;
  managerToUpdate?: Manager;
  setSaveButtondisability: (value: boolean) => void;
  isUnassigned: boolean;
};

export const AddManagerFormFields = <V extends AnyObject>({
  zoneRackPairs,
  setSelectedZone,
  setSelectedManagerType,
  selectedZone,
  selectedManagerType,
  managerToUpdate,
  setSaveButtondisability,
  isUnassigned,
}: Props): JSX.Element => {
  const { handleChange, setFieldValue, values, initialValues } =
    useFormikContext<V>();
  const [racks, setRacks] = useState<Rack[]>([]);

  useEffect(() => {
    if (managerToUpdate) {
      const isSaveButtonDisabled = updateManagerFormValidation(
        values,
        initialValues
      );
      setSaveButtondisability(isSaveButtonDisabled);
    } else {
      const isSaveButtonDisabled = addManagerFormValidation(values);
      setSaveButtondisability(isSaveButtonDisabled);
    }
  }, [values]);

  useEffect(() => {
    if (selectedZone || managerToUpdate?.zone_id) {
      const zoneId = selectedZone ? +selectedZone : managerToUpdate?.zone_id;
      const result = zoneRackPairs.find(
        (zone: Zone) => +zone.zone_id === zoneId
      );
      if (result) {
        setRacks(result?.racks as Rack[]);
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
        case "IFIC":
        case "TFIC": {
          return "http";
        }
        default: {
          return "";
        }
      }
    }
  };

  const getDefaultPortValue = (managerType: string) => {
    if (managerType) {
      switch (managerType) {
        case "OXC": {
          return 3082;
        }
        case "IFIC":
        case "TFIC": {
          return 18080;
        }
        default: {
          return "";
        }
      }
    }
  };

  const isIPAddressValid = (ipString: string) => {
    const ipAddressPattern = new RegExp(IP_ADDRESS_REGEX, "i");
    return ipString !== "" && !!ipAddressPattern.test(ipString);
  };

  const isPortValid = (portString: string) => {
    const portPattern = new RegExp(PORT_REGEX, "i");
    return portString !== "" && !!portPattern.test(portString);
  };

  const isNameValid = (nameString: string) => {
    const ipAddressPattern = new RegExp(MANAGER_NAME_REGEX, "i");
    return nameString !== "" && !!ipAddressPattern.test(nameString);
  };

  const addManagerFormValidation = (values: any) => {
    let validation = true;
    if (selectedManagerType === "OXC") {
      validation =
        !!values.manager_type &&
        isNameValid(values.name) &&
        isIPAddressValid(values.ip_address) &&
        isPortValid(values.port) &&
        !!values.protocol &&
        !!values.user_name &&
        !!values.password &&
        !!values.manufacturer;
    } else {
      validation =
        !!values.manager_type &&
        isNameValid(values.name) &&
        isIPAddressValid(values.ip_address) &&
        !!values.protocol;
    }
    return isUnassigned
      ? !validation
      : !(validation && !!values.rack_id && !!values.zone_id);
  };

  const updateManagerFormValidation = (values: any, initialValues: any) => {
    const valuesValidation =
      (+values.rack_id !== +initialValues.rack_id ||
        +values.zone_id !== +initialValues.zone_id ||
        values.name !== initialValues.name) &&
      isNameValid(values.name) &&
      !!values.rack_id &&
      !!values.zone_id;
    return !valuesValidation;
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
            label="Manager Type"
            name="manager_type"
            disabled={managerToUpdate ? true : false}
            style={{ opacity: !!managerToUpdate ? "0.8" : "1" }}
            options={[
              { label: "Select Manager Type", value: "", disabled: true },
              ...MANAGER_TYPES.map((managerType) => ({
                key: `manager-type-${managerType}`,
                label: managerType,
                value: managerType,
              })),
            ]}
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              handleChange(evt);
              setFieldValue("manager_type", evt.target.value);
              setFieldValue("protocol", getDefaultProtocol(evt.target.value));
              setFieldValue("port", getDefaultPortValue(evt.target.value));
              setSelectedManagerType(evt.target.value);
            }}
            required
          />
        </Col>
        {!isUnassigned && (
          <>
            <Col size={3}>
              <FormikField
                component={Select}
                label="Zone"
                name="zone_id"
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
                required
              />
            </Col>
            <Col size={2}>
              <FormikField
                component={Select}
                label="Pool"
                disabled={
                  managerToUpdate
                    ? !!selectedZone && !managerToUpdate
                    : !selectedZone
                }
                name="rack_id"
                options={
                  !racks || racks.length === 0
                    ? [
                        {
                          label: "There are no pools available",
                          value: "",
                          disabled: true,
                        },
                      ]
                    : [
                        { label: "Select Pool", value: "", disabled: true },
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
                  setFieldValue(
                    "rack_name",
                    racks.find(
                      (rack: Rack) => +rack.rack_id === +evt.target.value
                    )?.rack_name
                  );
                  setFieldValue(
                    "rack_fqgn",
                    racks.find(
                      (rack: Rack) => +rack.rack_id === +evt.target.value
                    )?.rack_fqgn
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
                required
              />
            </Col>
          </>
        )}
        <Col size={3}>
          <FormikField
            label="Name"
            name="name"
            required={true}
            placeholder="Name"
            type="text"
            autoComplete="off"
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
                  name="user_name"
                  required={selectedManagerType === "OXC"}
                  disabled={managerToUpdate ? true : false}
                  placeholder={`${
                    selectedManagerType === "OXC" ? values.protocol : ""
                  } User Name`}
                  label={`${
                    selectedManagerType === "OXC" ? values.protocol : ""
                  } User Name`}
                  type="text"
                />
              </Col>
              <Col size={2}>
                <FormikField
                  name="password"
                  disabled={managerToUpdate ? true : false}
                  required={selectedManagerType === "OXC"}
                  label={`${
                    selectedManagerType === "OXC" ? values.protocol : ""
                  } Password`}
                  placeholder={`${
                    selectedManagerType === "OXC" ? values.protocol : ""
                  } Password`}
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
