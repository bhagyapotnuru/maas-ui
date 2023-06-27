/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  IP_ADDRESS_REGEX,
  PORT_REGEX,
  MANAGER_NAME_REGEX,
} from "./AddManager/constants";

const isIPAddressValid = (ipString: string): boolean => {
  const ipAddressPattern = new RegExp(IP_ADDRESS_REGEX, "i");
  return ipString !== "" && !!ipAddressPattern.test(ipString);
};

const isPortValid = (portString: string): boolean => {
  const portPattern = new RegExp(PORT_REGEX, "i");
  return portString !== "" && !!portPattern.test(portString);
};

const isNameValid = (nameString: string): boolean => {
  const ipAddressPattern = new RegExp(MANAGER_NAME_REGEX, "i");
  return nameString !== "" && !!ipAddressPattern.test(nameString);
};

const getDefaultPortValue = (managerType: string): string | undefined => {
  if (managerType) {
    switch (managerType) {
      case "OXC": {
        return "3082";
      }
      case "IFIC":
      case "TFIC": {
        return "18080";
      }
      default: {
        return "";
      }
    }
  }
};

const getDefaultProtocol = (managerType: string): string | undefined => {
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

const getDescription = (
  zone_fqgn: string,
  rack_fqgn: string,
  name: string
): string => {
  return `${zone_fqgn || ""}${rack_fqgn ? `.${rack_fqgn}` : ""}${
    name ? `${zone_fqgn ? "." : ""}${name}` : ""
  }`;
};
const updateManagerFormValidation = (
  values: any,
  initialValues: any
): boolean => {
  const valuesValidation =
    (+values.rack_id !== +initialValues.rack_id ||
      +values.zone_id !== +initialValues.zone_id ||
      values.name !== initialValues.name) &&
    isNameValid(values.name) &&
    !!values.rack_id &&
    !!values.zone_id;
  return !valuesValidation;
};

const updateRedfishurlValidation = (
  values: any,
  initialValues: any
): boolean => {
  const valuesValidation =
    (values.ip_address !== initialValues.ip_address ||
      values.port !== initialValues.port ||
      values.protocol !== initialValues.protocol) &&
    isIPAddressValid(values.ip_address) &&
    isPortValid(values.port) &&
    !!values.protocol;
  return !valuesValidation;
};

const addManagerFormValidation = (
  values: any,
  selectedManagerType: string,
  isUnassigned: boolean
): boolean => {
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

export {
  isIPAddressValid,
  isPortValid,
  isNameValid,
  getDefaultPortValue,
  getDefaultProtocol,
  getDescription,
  updateManagerFormValidation,
  addManagerFormValidation,
  updateRedfishurlValidation,
};
