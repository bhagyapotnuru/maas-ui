import { useEffect, useState } from "react";

import { Col, Row, Select, Tooltip } from "@canonical/react-components";
import { position } from "@canonical/react-components/dist/components/Tooltip";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import {
  getDefaultPortValue,
  getDefaultProtocol,
  getDescription,
  updateManagerFormValidation,
  addManagerFormValidation,
  updateRedfishurlValidation,
} from "../../utils";
import classes from "../AddManager.module.css";
import { MANAGER_TYPES } from "../constants";

import OpticalSwitchFormFields from "./OpticalSwitchFormFields";
import RedfishManagerFormFields from "./RedfishManagerFormFields";

import FormikField from "app/base/components/FormikField";
import type { AnyObject } from "app/base/types";
import { actions } from "app/store/drut/managers/slice";
import type { Manager, Zone, Rack } from "app/store/drut/managers/types";
import type { RootState } from "app/store/root/types";

type Props = {
  setSelectedZone: (type: string) => void;
  setSelectedManagerType: (type: string) => void;
  selectedZone: string;
  selectedManagerType: string;
  managerToUpdate?: Manager;
  setSaveButtondisability: (value: boolean) => void;
};

export const AddManagerFormFields = <V extends AnyObject>({
  setSelectedZone,
  setSelectedManagerType,
  selectedZone,
  selectedManagerType,
  managerToUpdate,
  setSaveButtondisability,
}: Props): JSX.Element => {
  const { zones, isUnassigned, redfishurlEdit } = useSelector(
    (state: RootState) => state.Managers
  );
  const { handleChange, setFieldValue, values, initialValues } =
    useFormikContext<V>();
  const [racks, setRacks] = useState<Rack[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (managerToUpdate) {
      let isSaveButtonDisabled: boolean;
      if (redfishurlEdit) {
        isSaveButtonDisabled = updateRedfishurlValidation(
          values,
          initialValues
        );
      } else
        isSaveButtonDisabled = updateManagerFormValidation(
          values,
          initialValues
        );
      setSaveButtondisability(isSaveButtonDisabled);
    } else {
      const isSaveButtonDisabled = addManagerFormValidation(
        values,
        selectedManagerType,
        isUnassigned
      );
      setSaveButtondisability(isSaveButtonDisabled);
    }
  }, [values]);

  useEffect(() => {
    if (selectedZone || managerToUpdate?.zone_id) {
      const zoneId = selectedZone ? +selectedZone : managerToUpdate?.zone_id;
      const result = zones.find((zone: Zone) => +zone.zone_id === zoneId);
      if (result) {
        setRacks(result?.racks);
      }
    }
  }, [selectedZone, managerToUpdate]);

  return (
    <>
      <Row>
        <Col size={2}>
          <FormikField
            component={Select}
            label="Manager Type"
            name="manager_type"
            disabled={managerToUpdate || redfishurlEdit ? true : false}
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
                disabled={redfishurlEdit}
                name="zone_id"
                options={[
                  { label: "Select Zone", value: "", disabled: true },
                  ...zones
                    .filter(
                      (zoneRack: any) =>
                        !["drut", "default_zone"].includes(
                          zoneRack.zone_name.toLowerCase()
                        )
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
                    zones.find(
                      (zone: Zone) => +zone.zone_id === +event.target.value
                    )?.zone_fqgn
                  );
                  setSelectedZone(event.target.value);
                  setFieldValue(
                    "description",
                    getDescription(
                      zones.find(
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
                  (managerToUpdate
                    ? !!selectedZone && !managerToUpdate
                    : !selectedZone) || redfishurlEdit
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
            disabled={redfishurlEdit}
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
        <Col size={1} className={classes.edit}>
          {redfishurlEdit && (
            <Tooltip message="Edit" position={position.right}>
              <IconButton
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(actions.setRedfishurlEdit(false));
                }}
              >
                <Edit style={{ height: 18, width: 18 }} />
              </IconButton>
            </Tooltip>
          )}
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
