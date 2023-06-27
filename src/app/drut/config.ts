import { getCookie } from "app/utils";

const jsonTheme = {
  scheme: "monokai",
  author: "Indu",
  base00: "#000000",
};

const ROOT_API = "/MAAS/api/2.0/";
const csrftoken: any = () => getCookie("csrftoken");

const hdr: any = () => {
  return new Headers({
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-CSRFToken": csrftoken() || null,
    "X-Requested-With": "XMLHttpRequest",
  });
};

function fetchEventData(path: string, abort: any = null): any {
  const header: any = {
    headers: hdr(),
  };
  if (abort !== null) {
    header.signal = abort;
  }
  return fetch(path, header).then((response: any) =>
    throwHttpMessage(response)
  );
}

function fetchData(path: string, abort: any = null): any {
  const callPath = `${ROOT_API}${path}`;
  const header: any = {
    headers: hdr(),
  };
  if (abort !== null) {
    header.signal = abort;
  }
  return fetch(callPath, header).then((response: any) =>
    throwHttpMessage(response)
  );
}

const downLoadFile = (path: string, abort: any = null): Promise<Response> => {
  const callPath = `${ROOT_API}${path}`;
  const header: any = {
    headers: hdr(),
  };
  if (abort !== null) {
    header.signal = abort;
  }
  return fetch(callPath, header).then((response: Response) => response);
};

function postData(
  path: string,
  data: any = null,
  isPut: any = false
): Promise<any> {
  return fetch(`${ROOT_API}${path}`, {
    method: isPut ? "PUT" : "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken(),
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(data),
  }).then((response: any) => throwHttpMessage(response));
}

function uploadFile(path: string, file: File | FormData): Promise<any> {
  return fetch(`${ROOT_API}${path}`, {
    method: "POST",
    headers: {
      // Accept: "application/json",
      // "Content-Type": file.type,
      // "content-length": `${file.size}`,
      "X-CSRFToken": csrftoken(),
      "X-Requested-With": "XMLHttpRequest",
    },
    body: file,
  }).then((response: any) => throwHttpMessage(response));
}

function deleteData(path: string): Promise<any> {
  return fetch(`${ROOT_API}${path}`, {
    method: "DELETE",
    headers: hdr(),
  }).then((response: any) => throwHttpMessage(response));
}

function deleteManager(path: string): Promise<any> {
  return fetch(`${ROOT_API}${path}`, {
    method: "DELETE",
    headers: hdr(),
  });
}

async function throwHttpMessage(response: Response): Promise<any> {
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let error;
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const res = await response.json();
      error = res?.error?.message;
    } else {
      error = await response.text();
    }
    if (
      (response.status === 500 || response.status === 503) &&
      error.toLowerCase().includes("connection refused")
    ) {
      const errorMessage = error.match(/host='([^']*)/)?.[1] || "-";
      error = `Fabric Manager running at ${errorMessage} is not reachable.`;
    }
    throw new Error(error);
  } else {
    return response.json();
  }
}

export {
  postData,
  uploadFile,
  deleteData,
  fetchEventData,
  fetchData,
  throwHttpMessage,
  jsonTheme,
  deleteManager,
  downLoadFile,
};
