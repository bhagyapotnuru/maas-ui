import { getCookie } from "app/utils";

const jsonTheme = {
  scheme: "monokai",
  author: "Indu",
  base00: "#000000",
};

const ROOT_API = "/MAAS/api/2.0/";
const csrftoken: any = () => getCookie("csrftoken");

function resourcesAPI(
  id = null,
  computeBlockId = null,
  isResourcesPage = false
): string {
  if (id) {
    return `${ROOT_API}dfab/resourceblocks/${id}/`;
  }
  if (computeBlockId) {
    if (isResourcesPage) {
      return `${ROOT_API}dfab/resourceblocks/?ComputeBlockId=${computeBlockId}`;
    }
    return `${ROOT_API}dfab/resourceblocks/?op=get_new_schema&ComputeBlockId=${computeBlockId}`;
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

function fetchResources(
  id = null,
  computeBlockId: any = null,
  isResourcesPage = false
): any {
  return fetch(resourcesAPI(id, computeBlockId, isResourcesPage), {
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setError: (value: string) => void = () => {}
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
  uploadFile,
  deleteData,
  fetchData,
  fetchDataPromise,
  throwHttpMessage,
  jsonTheme,
};
