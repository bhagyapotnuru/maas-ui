import { useState } from "react";

import { Spinner, Notification } from "@canonical/react-components";
import * as Yup from "yup";

import { postData } from "../../../../../config";
import AddManagerFormFields from "../AddManagerFormFields";
import { IP_ADDRESS_REGEX, PORT_REGEX, MANAGER_NAME_REGEX } from "../constants";
import type { Manager, Zone, Rack } from "../type";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  zoneRackPairs: any;
  setError: (value: string) => void;
  setFetchManagers: (value: boolean) => void;
  managerToUpdate?: Manager;
};

export const AddManagerForm = ({
  clearHeaderContent,
  zoneRackPairs,
  setError,
  managerToUpdate,
  setFetchManagers,
}: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedManagerType, setSelectedManagerType] = useState(
    managerToUpdate?.manager_type || ""
  );

  const AddManagerOXCSchema = Yup.object().shape({
    manager_type: Yup.string().required("Manager Type required"),
    rack_id: Yup.string().required("Rack required"),
    zone_id: Yup.string().required("Zone required"),
    vendor: Yup.string().required("Vendor required"),
    name: Yup.string()
      .matches(MANAGER_NAME_REGEX, "only - or _ is allowed")
      .required("Name required"),
    protocol: Yup.string().required("Protocol required"),
    user_name: Yup.string().required("User Name required"),
    password: Yup.string().required("Password required"),
    ip_address: Yup.string()
      .matches(IP_ADDRESS_REGEX, "Invalid IP address")
      .required("IP address is required"),
    port: Yup.string()
      .matches(PORT_REGEX, "Invalid Port")
      .required("Port is required"),
  });

  const AddManagerRedfishSchema = Yup.object().shape({
    manager_type: Yup.string().required("Manager Type required"),
    rack_id: Yup.string().required("Rack required"),
    zone_id: Yup.string().required("Zone required"),
    name: Yup.string()
      .matches(MANAGER_NAME_REGEX, "only - or _ is allowed")
      .required("Name required"),
    protocol: Yup.string().required("Protocol required"),
    ip_address: Yup.string()
      .matches(IP_ADDRESS_REGEX, "Invalid IP address")
      .required("IP address is required"),
    port: Yup.string().matches(PORT_REGEX, "Invalid Port"),
  });

  const UpdateManagerRedfishSchema = Yup.object().shape({
    manager_type: Yup.string().required("Manager Type required"),
    rack_id: Yup.string().required("Rack required"),
    zone_id: Yup.string().required("Zone required"),
    name: Yup.string()
      .matches(MANAGER_NAME_REGEX, "only - or _ is allowed")
      .required("Name required"),
  });

  const getRackName = (zoneId: string, rackId: string) => {
    const racks =
      zoneRackPairs.find((zone: Zone) => zone.zone_id === +zoneId)?.racks || [];
    const rackName = racks.find(
      (rack: Rack) => rack.rack_id === +rackId
    )?.rackName;
    return rackName;
  };

  const createUpdateManager = (
    managerToAddorUpdate: Manager,
    url: string,
    isUpdateOperation: boolean
  ) => {
    let updatePayload: Manager = {} as Manager;
    const addPayload: Manager[] = [] as Manager[];
    if (managerToUpdate) {
      const payload: Manager = {} as Manager;
      if (managerToAddorUpdate?.rack_id !== managerToUpdate?.rack_id) {
        payload["rack_id"] = managerToAddorUpdate?.rack_id;
        payload["rack_name"] = managerToAddorUpdate["rack_name"];
      }
      if (managerToAddorUpdate?.name !== managerToUpdate?.name) {
        payload["name"] = managerToAddorUpdate?.name;
      }
      if (managerToAddorUpdate?.description !== managerToUpdate?.description) {
        payload["description"] = managerToAddorUpdate?.description;
      }
      payload["rack_fqgn"] = managerToAddorUpdate["rack_fqgn"];

      updatePayload = payload;
    } else {
      if (managerToAddorUpdate.manager_type === "OXC") {
        managerToAddorUpdate["manufacturer"] =
          managerToAddorUpdate["manufacturer"]?.toUpperCase();
        delete managerToAddorUpdate["remote_redfish_uri"];
      } else {
        delete managerToAddorUpdate["ip_address"];
        delete managerToAddorUpdate["port"];
        delete managerToAddorUpdate["manufacturer"];
        delete managerToAddorUpdate["protocol"];
      }
      addPayload.push(managerToAddorUpdate);
    }
    setLoading(true);
    postData(
      url,
      isUpdateOperation ? updatePayload : addPayload,
      isUpdateOperation
    )
      .then((response: any) => {
        if (response.status === 200) {
          setLoading(false);
          setFetchManagers(true);
          return response.json();
        } else {
          response.text().then((text: string) => {
            setLoading(true);
            const isConstraintViolation: boolean = text.includes(
              "ConstraintViolationException"
            );
            const errorMsg = `Manager name already exists in rack ${getRackName(
              managerToAddorUpdate?.zone_id || "",
              managerToAddorUpdate?.rack_id || ""
            )}  Cannot be created with a duplicate name.`;
            setError(isConstraintViolation ? errorMsg : text);
          });
        }
      })
      .catch((e: any) => setError(e))
      .finally(() => clearHeaderContent());
  };

  let defaultProtocol = "";
  if (selectedManagerType) {
    if (selectedManagerType === "OXC") {
      defaultProtocol = "TL1";
    } else if (selectedManagerType === "BMC") {
      defaultProtocol = "https";
    } else {
      defaultProtocol = "http";
    }
  }

  return (
    <>
      {loading ? (
        <Notification
          key={`notification_${Math.random()}`}
          inline
          severity="information"
        >
          <Spinner
            text={`${
              managerToUpdate?.id ? "Updating Manager..." : "Adding Manager..."
            }`}
            key={`Add_managers_spinner_${Math.random()}`}
          />
        </Notification>
      ) : (
        <FormikForm<Manager>
          initialValues={{
            manager_type: managerToUpdate?.manager_type || "",
            rack_id: managerToUpdate?.rack_id || "",
            rack_name: managerToUpdate?.rack_name || "",
            rack_fqgn: managerToUpdate?.rack_fqgn || "",
            zone_id: managerToUpdate?.zone_id || "",
            name: managerToUpdate?.name || "",
            description: managerToUpdate?.description || "",
            user_name: managerToUpdate?.user_name || "",
            password: managerToUpdate?.password || "",
            ip_address: managerToUpdate?.ip_address || "",
            port: managerToUpdate?.port || "",
            manufacturer: managerToUpdate?.manufacturer || "",
            protocol: managerToUpdate?.protocol || defaultProtocol,
            remote_redfish_uri: managerToUpdate?.remote_redfish_uri || "",
          }}
          onCancel={clearHeaderContent}
          onSaveAnalytics={{
            action: "Save",
            category: "Managers",
            label: "Add manager form",
          }}
          onSubmit={(values: Manager) => {
            if (managerToUpdate) {
              createUpdateManager(
                values,
                `dfab/managers/${managerToUpdate?.id}/`,
                true
              );
            } else {
              createUpdateManager(values, `dfab/managers/`, false);
            }
          }}
          onSuccess={() => {
            clearHeaderContent();
          }}
          resetOnSave
          submitLabel="Save"
          validationSchema={
            selectedManagerType === "OXC "
              ? AddManagerOXCSchema
              : managerToUpdate
              ? UpdateManagerRedfishSchema
              : AddManagerRedfishSchema
          }
        >
          <AddManagerFormFields
            zoneRackPairs={zoneRackPairs}
            selectedManagerType={selectedManagerType}
            setSelectedManagerType={setSelectedManagerType}
            managerToUpdate={managerToUpdate}
            setSelectedZone={setSelectedZone}
            selectedZone={selectedZone}
          />
        </FormikForm>
      )}
    </>
  );
};

export default AddManagerForm;
