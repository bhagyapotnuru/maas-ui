import { useState, useEffect } from "react";

import { Spinner, Notification } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

import AddManagerFormFields from "../AddManagerFormFields";
import { IP_ADDRESS_REGEX, PORT_REGEX, MANAGER_NAME_REGEX } from "../constants";

import FormikForm from "app/base/components/FormikForm";
import type { ClearHeaderContent } from "app/base/types";
import { createUpdateManager, actions } from "app/store/drut/managers/slice";
import type { Manager } from "app/store/drut/managers/types";
import type { RootState } from "app/store/root/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  managerToUpdate?: Manager;
};

export const AddManagerForm = ({
  clearHeaderContent,
  managerToUpdate,
}: Props): JSX.Element => {
  const { formLoading, clearHeader } = useSelector(
    (state: RootState) => state.Managers
  );
  const dispatch = useDispatch();
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedManagerType, setSelectedManagerType] = useState(
    managerToUpdate?.manager_type || ""
  );
  const [saveButtondisability, setSaveButtondisability] = useState(true);
  const { redfishurlEdit } = useSelector((state: RootState) => state.Managers);
  useEffect(() => {
    if (clearHeader) {
      clearHeaderContent();
      dispatch(actions.setClearHeader(false));
    }
  }, [clearHeader]);

  const AddManagerOXCSchema = Yup.object().shape({
    manager_type: Yup.string().required("Manager Type required"),
    name: Yup.string()
      .matches(MANAGER_NAME_REGEX, "only - _ and . is allowed")
      .required("Name required"),
    manufacturer: Yup.string().required("Vendor required"), //vendor
    ip_address: Yup.string()
      .matches(IP_ADDRESS_REGEX, "Invalid IP address")
      .required("IP address is required"),
    protocol: Yup.string().required("Protocol required"),
    port: Yup.string()
      .matches(PORT_REGEX, "Invalid Port")
      .required("Port is required"),
    user_name: Yup.string().required("User Name required"),
    password: Yup.string().required("Password required"),
  });

  const AddManagerRedfishSchema = Yup.object().shape({
    manager_type: Yup.string().required("Manager Type required"),
    name: Yup.string()
      .matches(MANAGER_NAME_REGEX, "only - or _ is allowed")
      .required("Name required"),
    protocol: Yup.string().required("Protocol required"),
    ip_address: Yup.string()
      .matches(IP_ADDRESS_REGEX, "Invalid IP address")
      .required("IP address is required"),
    port: Yup.string().matches(PORT_REGEX, "Invalid Port"),
  });

  const UpdateManagerSchema = Yup.object().shape({
    manager_type: Yup.string().required("Manager Type required"),
    name: Yup.string()
      .matches(MANAGER_NAME_REGEX, "only - or _ is allowed")
      .required("Name required"),
  });

  const UpdateRedfishurlSchema = Yup.object().shape({
    protocol: Yup.string().required("Protocol required"),
    ip_address: Yup.string()
      .matches(IP_ADDRESS_REGEX, "Invalid IP address")
      .required("IP address is required"),
    port: Yup.string().matches(PORT_REGEX, "Invalid Port"),
  });

  const createOrUpdateManager = (
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
    dispatch(
      createUpdateManager({
        params: url,
        data: isUpdateOperation
          ? redfishurlEdit
            ? {
                remote_redfish_service_uri:
                  managerToAddorUpdate.remote_redfish_uri,
              }
            : updatePayload
          : addPayload,
        isUpdateOperation: isUpdateOperation,
      })
    );
    dispatch(actions.setRedfishurlEdit(false));
  };

  const getValidationSchema = () => {
    if (selectedManagerType === "OXC") {
      return managerToUpdate ? UpdateManagerSchema : AddManagerOXCSchema;
    } else if (managerToUpdate) {
      return redfishurlEdit ? UpdateRedfishurlSchema : UpdateManagerSchema;
    } else {
      return AddManagerRedfishSchema;
    }
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
      {formLoading ? (
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
            id: managerToUpdate?.id || 0,
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
            discovery_status: managerToUpdate?.discovery_status || "",
          }}
          onCancel={clearHeaderContent}
          onSaveAnalytics={{
            action: "Save",
            category: "Managers",
            label: "Add manager form",
          }}
          onSubmit={(values: Manager) => {
            if (managerToUpdate) {
              createOrUpdateManager(values, `${managerToUpdate?.id}/`, true);
            } else {
              createOrUpdateManager(values, "", false);
            }
          }}
          onSuccess={() => {
            clearHeaderContent();
          }}
          resetOnSave
          submitLabel="Save"
          validationSchema={getValidationSchema}
          submitDisabled={saveButtondisability}
        >
          <AddManagerFormFields
            selectedManagerType={selectedManagerType}
            setSelectedManagerType={setSelectedManagerType}
            managerToUpdate={managerToUpdate}
            setSelectedZone={setSelectedZone}
            selectedZone={selectedZone}
            setSaveButtondisability={setSaveButtondisability}
          />
        </FormikForm>
      )}
    </>
  );
};

export default AddManagerForm;
