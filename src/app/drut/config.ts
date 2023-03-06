import { getCookie } from "app/utils";

const jsonTheme = {
  scheme: "monokai",
  author: "Indu",
  base00: "#000000",
};

const ROOT_API = "/MAAS/api/2.0/";
const csrftoken: any = () => getCookie("csrftoken");

function resourcesAPI(id = null): string {
  if (id) {
    return `${ROOT_API}dfab/resourceblocks/${id}/`;
  }
  return `${ROOT_API}dfab/resourceblocks/`;
}

const hdr: any = () => {
  return new Headers({
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-CSRFToken": csrftoken() || null,
    "X-Requested-With": "XMLHttpRequest",
  });
};

function fetchResources(id = null): any {
  return fetch(resourcesAPI(id), {
    headers: hdr(),
  });
}

async function fetchDataPromise(
  path: string,
  isFullPath: any = false,
  abort: any = null
): Promise<any> {
  const callPath = isFullPath ? `${path}` : `${ROOT_API}${path}`;
  const header: any = {
    headers: hdr(),
  };
  if (abort !== null) {
    header.signal = abort;
  }
  const response: any = await fetch(callPath, header);
  return await response.text();
}

function fetchData(
  path: string,
  isFullPath: any = false,
  abort: any = null
): any {
  const callPath = isFullPath ? `${path}` : `${ROOT_API}${path}`;
  const header: any = {
    headers: hdr(),
  };
  if (abort !== null) {
    header.signal = abort;
  }
  return fetch(callPath, header);
}

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
  });
}

function deleteData(path: string): Promise<any> {
  return fetch(`${ROOT_API}${path}`, {
    method: "DELETE",
    headers: hdr(),
  });
}

async function throwHttpMessage(
  response: Response,
  setError: (value: string) => void
): Promise<any> {
  if (!response.ok) {
    await response.text().then((text: any) => {
      setError(text);
      throw new Error(text);
    });
  } else {
    return response.json();
  }
}

export {
  fetchResources,
  postData,
  deleteData,
  fetchData,
  fetchDataPromise,
  throwHttpMessage,
  jsonTheme,
};
