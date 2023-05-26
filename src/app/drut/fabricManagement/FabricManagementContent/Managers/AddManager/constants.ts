export const MANAGER_TYPES = ["OXC", "IFIC", "BMC", "TFIC", "PRU"];

export const OPTICAL_SWITCH_PROTOCOLS = ["TL1"];

export const VENDORS = ["Polatis", "Drut", "Calient"];

export const REDIFISH_MANAGER_PROTOCOLS = ["http", "https"];

export const IP_ADDRESS_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

export const MANAGER_NAME_REGEX = /^[a-zA-Z0-9_.-]*$/;

export const PORT_REGEX =
  /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0][0-9]{1,4})|([0-9]{1,4}))$/;
