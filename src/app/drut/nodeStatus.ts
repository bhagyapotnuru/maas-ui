const nStatus: any = ["IN_PROGRESS"];

const cStatus: any = ["Unused", "Composing", "Detaching", "Deleting"];

const nodeStatus: any = (dt: any = "") => {
  return { status: nStatus.includes(dt), message: getStatusMessage(dt) };
};

const blockStatus: any = (dt: any = "") => {
  return { status: cStatus.includes(dt) };
};

const getStatusMessage: any = (dt: any) => {
  let message = "";
  switch (dt) {
    case "COMPLETED":
      message = "Completed";
      break;
    case "IN_PROGRESS":
      message = "Operations is in progress";
      break;
    case "COMPOSING":
      message = "Composing a resource block";
      break;
    case "DETACHING":
      message = "Detaching a resource block";
      break;
    case "DELETING":
      message = "Deleting a resource block";
      break;
    default:
      message = "";
  }

  return message;
};

export { nStatus, cStatus, nodeStatus, blockStatus };
