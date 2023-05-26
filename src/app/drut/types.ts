const rsTypeUI: any = [
  "Compute",
  "Offload",
  // "Memory",
  "Network",
  "Storage",
  "DPU",
  // "Expansion",
  // "IndependentResource",
];

const rsTypeObjShow: any = [
  "Processors",
  "Storage",
  "ComputerSystems",
  "NetworkInterfaces",
];

const rsTypeRedfish: Array<any> = [
  "Processors",
  "Storage",
  "ComputerSystems",
  "NetworkInterfaces",
];

const getTypeTitle: any = (str: any = "") => {
  switch (str) {
    case "Processor" || "Processors":
      return { title: "Offload", short: "O" };
    case "ComputerSystem" || "ComputerSystems":
      return { title: "DPU", short: "D" };
    default:
      return { title: str, short: str.length ? str.charAt(0) : "" };
  }
};

const paginationOptions = [
  {
    value: "25",
    label: "25",
  },
  {
    value: "50",
    label: "50",
  },
  {
    value: "100",
    label: "100",
  },
  {
    value: "200",
    label: "200",
  },
];

export {
  rsTypeUI,
  rsTypeRedfish,
  rsTypeObjShow,
  getTypeTitle,
  paginationOptions,
};
