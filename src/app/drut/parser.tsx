import { Col, Row, Card } from "@canonical/react-components";
import { JSONTree } from "react-json-tree";

import { jsonTheme } from "./config";
import { drutTable } from "./table";
import { rsTypeUI, rsTypeObjShow, getTypeTitle, rsTypeRedfish } from "./types";

const generateObjData = (node: any = null, size: any = 4): any => {
  const fnd = [];
  if (node !== null) {
    Object.keys(node).forEach((key, index) => {
      if (!(key === "Id") && !(typeof node[key] === "object")) {
        fnd.push(
          <Col size={size} key={"objcol" + index + Math.random()}>
            <div className="drut-node-info-box-1">
              <strong className="p-muted-heading">{key}</strong>
              <br />
              {node[key] !== null && node[key] !== undefined
                ? node[key].toString()
                : "NA"}
            </div>
          </Col>
        );
      }
    });
  } else {
    fnd.push(
      <Col size={6} key={"nodata-obj" + Math.random()}>
        <p>Data not available!</p>
      </Col>
    );
  }
  return fnd;
};

const genObjAccord: any = (
  obj: any = null,
  keys: Array<string> = rsTypeObjShow
) => {
  const accData: any = [];
  try {
    keys.forEach((key: any) => {
      const data = obj && obj[key] ? obj[key] : null;
      if (data !== null) {
        if (["Processors", "ComputerSystems"].includes(key)) {
          const tbl = mainTableComputeGPU(data);
          if (tbl) {
            accData.push({
              title: `${key} (count: ${tbl.len})`,
              key: `${key} (count: ${tbl.len})`,
              content: <Row>{tbl.colFnd}</Row>,
            });
          }
        } else if (["NetworkInterfaces", "Storage"].includes(key)) {
          const tbl = mainTableNetStorage(netStorData(data));
          if (tbl) {
            accData.push({
              title: `${key} (count: ${tbl.len})`,
              key: `${key} (count: ${tbl.len})`,
              content: <Row>{tbl.colFnd}</Row>,
            });
          }
        } else {
          const colm = arrayObject(data);
          if (colm) {
            accData.push({
              title: `${key} (count: ${colm.len})`,
              key: `${key} (count: ${colm.len})`,
              content: <Row>{colm.colFnd}</Row>,
            });
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
  }

  return accData;
};

const netStorData = (data: any) => {
  const fn: any = [];
  data.forEach((dt: any) => {
    const obj: any = { Id: "", Name: "", EndPoint: "", PCI: [], Status: null };
    obj.Id = dt.Id || dt.NodeId;
    obj.Name = dt?.Name || dt.NodeId;
    obj.Status = dt.Status || dt.Endpoint.Status;
    obj.EndPoint = `${dt?.Endpoint?.Name || "NA"} (${
      dt.Endpoint?.PortId || "NA"
    })`;
    (dt?.Endpoint?.ConnectedEntities || []).forEach((ce: any) => {
      obj.PCI.push(
        `${ce?.EntityPciId?.ClassCode} / ${ce?.EntityPciId?.DeviceId} / ${ce?.EntityPciId?.VendorId}`
      );
    });
    fn.push(obj);
  });
  return fn;
};

const arrayObject = (data: Array<any> = [], colSize: any = 4): any => {
  const colFnd: Array<any> = [];
  const fnd: Array<any> = [];
  const fndObj: Array<any> = [];
  if (data !== null && data !== undefined) {
    data.forEach((dataElm: any) => {
      Object.keys(dataElm).forEach((dtKey: any, index) => {
        if (!(dtKey === "Id") && !(typeof dataElm[dtKey] === "object")) {
          fnd.push(
            <p key={"arrobj" + index + Math.random()}>
              <b>{dtKey}</b>: {dataElm[dtKey]}
            </p>
          );
        } else {
          fndObj.push(
            <JSONTree
              key={"json" + index + Math.random()}
              data={dataElm[dtKey]}
              theme={jsonTheme}
              keyPath={[dtKey]}
              shouldExpandNodeInitially={() => true}
            />
          );
        }
      });
      colFnd.push(
        <Col size={colSize} key={"final" + Math.random()}>
          <Card className="drut-node-summary-card">{fnd.concat(fndObj)}</Card>
        </Col>
      );
    });
    return { len: colFnd.length, colFnd };
  } else {
    return null;
  }
};

const mainTableComputeGPU = (data: any) => {
  const colFnd: Array<any> = [];
  const len = data.length;
  colFnd.push(
    <Col size={12}>
      {drutTable(data, [
        { key: "SystemType" },
        { key: "Name" },
        { key: "Manufacturer" },
        { key: "Model" },
        { key: "SerialNumber" },
        { key: "Health" },
        { key: "State" },
      ])}
    </Col>
  );

  return { len, colFnd };
};
// const obj: any = {Id: "", Name: "", EndPoint:"", PCI: [], Status: null}
const mainTableNetStorage = (data: any) => {
  const colFnd: Array<any> = [];
  const len = data.length;
  colFnd.push(
    <Col size={12}>
      {drutTable(data, [
        { key: "Name" },
        { key: "Id" },
        { key: "EndPoint" },
        { key: "PCI" },
        { key: "State" },
        { key: "Health" },
      ])}
    </Col>
  );

  return { len, colFnd };
};

const mainTablePorts = (ports: any) => {
  const colFnd: Array<any> = [];
  const len = ports?.length || "-";
  colFnd.push(
    <Col size={12}>
      {drutTable(ports, [
        { key: "PortType" },
        { key: "Id" },
        { key: "CurrentSpeedGbps" },
        { key: "LinkState" },
        { key: "LinkStatus" },
      ])}
    </Col>
  );

  return { len, colFnd };
};
// dsfsdf
const arrayObjectArray = (data: Array<any> = [], label: string): any => {
  const accData: Array<any> = [];
  let colm: any = { len: 0, colFnd: null };
  if (data && data.length) {
    data.forEach((switchDt: any) => {
      if (switchDt && switchDt?.Ports) {
        colm =
          label !== "Switch Port"
            ? arrayObject(switchDt?.Ports)
            : mainTablePorts(switchDt?.Ports); // arrayObjectOpen(switchDt.Ports);
      }

      if (colm) {
        accData.push({
          title: `${switchDt?.Name || "-"} (${label} Count: ${colm.len})`,
          key: `${switchDt?.Name} (${label} Count: ${colm.len})`,
          content: (
            <>
              <Row> {generateObjData(switchDt)}</Row>
              <strong className="p-muted-heading">{label}</strong>
              <br />
              <Row>{colm.colFnd}</Row>
            </>
          ),
        });
      }
    });
  }
  return accData;
};

const translateUIType = (rb: any) => {
  const rbType: any = [];
  rb.forEach((type: any) => {
    rbType.push(getTypeTitle(type).title);
  });
  return rbType;
};

const resourceData: any = (
  result: any = null,
  resourceType: Array<any> = []
): any => {
  resourceType = resourceType.length ? resourceType : rsTypeUI;
  const stats: any = { total: 0 };
  resourceType.forEach((key: any) => {
    stats[key] = 0;
  });
  const finalData: any = {
    filter: {
      Compute: { ability: [] },
      Offload: { ability: [] },
      Storage: { ability: [] },
      Network: { ability: [] },
      DPU: { ability: [] },
    },
  };
  result.Links.Members.forEach((elm: any, index: any) => {
    elm.ResourceBlockType = translateUIType(elm.ResourceBlockType);
    elm["RTypes"] =
      elm.ResourceBlockType && elm.ResourceBlockType.length
        ? elm.ResourceBlockType.join(", ")
        : "";
    const description = resourceDescriptions(elm);
    const ability = resourceAbility(elm);
    elm["af"] = [];
    Object.keys(description.filterKey).forEach((fKey: any) => {
      Object.keys(description.filterKey[fKey]).forEach((vKey: any) => {
        const key = `${description.filterKey[fKey][vKey]} ${vKey}`;
        elm["af"].push(key);
        try {
          if (
            !finalData.filter[fKey]["ability"].find(
              (dt: any) => dt.data === key
            ) &&
            key.length
          ) {
            finalData.filter[fKey]["ability"].push({
              selected: false,
              index,
              data: key,
            });
          }
        } catch (err) {
          console.log(err);
        }
      });
    });

    elm["filter"] = description.filter;
    elm["filterKey"] = description.filterKey;
    elm["Description"] = description.data;
    elm["DeviceCount"] = description.data.length;
    elm["Ability"] = ability.all;
    elm["checked"] = false;
    elm["BlockType"] = elm.ResourceBlockType[0];
    stats["total"]++;
    elm.ResourceBlockType.forEach((key: any) => {
      stats[key]++;
      elm["NodeName"] = elm["NodeName"] ? elm["NodeName"] : "";
      if (finalData[key]) {
        finalData[key].push(elm);
      } else {
        finalData[key] = [];
        finalData[key].push(elm);
      }
    });
  });
  return [finalData, stats];
};

const resourceDescriptions = (elm: any): any => {
  const firnalData: any = [];
  const firnalFilter: any = [];
  const objFK: any = {};
  const rsType = rsTypeRedfish;
  rsType.forEach((key: any) => {
    if (elm && elm[key]) {
      elm[key].forEach((devices: any) => {
        const descObj = {
          type: "",
          key: "",
          capacity: "",
          unit: "",
          model: "",
          manufacturer: "",
        };
        let identity = key.charAt(0);
        // descObj.type = key;
        // identity = key.charAt(0);
        descObj.type = key;
        if (key === "NetworkInterfaces") {
          identity = "N";
          descObj.type = "Network";
        } else if (key === "ComputerSystems" && elm.RTypes === "Compute") {
          identity = "C";
          descObj.type = "Compute";
        } else if (key === "ComputerSystems") {
          identity = "D";
          descObj.type = "DPU";
        } else if (key === "Processors") {
          identity = "O";
          descObj.type = "Offload";
        }
        let str = `(${identity})-`;

        if (devices["Manufacturer"]) {
          const mf = devices["Manufacturer"].split(" ")[0];
          descObj.manufacturer = mf;
          str += `[${mf}] `;
        }
        if (devices["Model"]) {
          descObj.model = devices["Model"];
          str += ` [${devices["Model"]}] `;
        }

        // For Network and Storage
        if (key === "NetworkInterfaces") {
          str += `${devices?.Name} (${
            devices.NetworkDeviceFunctions
              ? devices.NetworkDeviceFunctions.length
              : 0
          })`;
        }
        if (key === "Storage") {
          str += `${devices?.Name} (${
            devices.Drives ? devices.Drives.length : 0
          })`;
        }

        descObj.key = str;
        if (
          devices.MemorySummary &&
          devices.MemorySummary.TotalSystemMemoryGiB
        ) {
          descObj.capacity = devices["MemorySummary"]["TotalSystemMemoryGiB"];
          descObj.unit = "GB";
          str += ` [S-${devices["MemorySummary"]["TotalSystemMemoryGiB"]} GB] `;
        }

        if (devices["CapacityBytes"]) {
          const val = parseFloat(
            (devices["CapacityBytes"] / (1024 * 1024 * 1024)).toString()
          ).toFixed(2);
          descObj.capacity = val;
          descObj.unit = "GB";
          str += ` [${val} GB] `;
        }
        if (devices["SpeedMbps"]) {
          descObj.capacity = devices["SpeedMbps"];
          descObj.unit = "Mbps";
          str += ` [${devices["SpeedMbps"]} Mbps] `;
        }
        if (devices["MaxSpeedMHz"]) {
          descObj.capacity = devices["MaxSpeedMHz"];
          descObj.unit = "Mhz";
          str += ` [${devices["MaxSpeedMHz"]} Mhz] `;
        }
        if (
          devices["ProcessorSummary"] &&
          devices["ProcessorSummary"]["TotalCores"]
        ) {
          descObj.capacity = `${devices["ProcessorSummary"]["Count"]} of ${devices["ProcessorSummary"]["TotalCores"]}`;
          descObj.unit = "Cores";
          // str += `${devices["ProcessorSummary"]["TotalCores"]}`;
        }
        descObj.key += descObj.capacity
          ? `[${descObj.capacity}${descObj.unit}]`
          : "";
        if (objFK[descObj.type] && objFK[descObj.type][descObj.key]) {
          objFK[descObj.type][descObj.key] =
            objFK[descObj.type][descObj.key] + 1;
        } else {
          objFK[descObj.type] = {};
          objFK[descObj.type][descObj.key] = 1;
        }
        firnalFilter.push(descObj);
        firnalData.push(str);
      });
    }
  });
  return { data: firnalData, filter: firnalFilter, filterKey: objFK };
};

const resourceAbility = (elm: any): any => {
  const summary: any = elm.Summary;
  const ability: any = { S: "", O: "", N: "", C: "", D: "", M: "", all: [] };
  try {
    if (summary.ComputerSystems) {
      let gpu: any = undefined;
      if (elm.ComputerSystems && elm.ComputerSystems.length) {
        gpu = elm.ComputerSystems.find((dt: any) => dt.SystemType === "DPU");
      }
      const cs = summary.ComputerSystems;
      if (cs.Processor) {
        ability[gpu ? "D" : "C"] = `${cs.Processor.TotalCores} CORE`;
        ability.all.push(
          `${cs.Processor.Count} of ${cs.Processor.TotalCores} CORE(${
            gpu ? "D" : "C"
          })`
        );
      }
      if (cs?.Memory?.TotalSystemMemoryGiB) {
        ability.M = `${cs.Memory.TotalSystemMemoryGiB}GB`;
        ability.all.push(`${cs.Memory.TotalSystemMemoryGiB}GB(M)`);
      }
    }
    if (summary.Processors && summary.Processors.MaxSpeedMHz) {
      ability.O = `${summary.Processors.MaxSpeedMHz}MHz`;
      ability.all.push(`${summary.Processors.MaxSpeedMHz}MHz(O)`);
    }
    if (summary.Storage && summary.Storage.CapacityGigaBytes) {
      ability.S = `${summary.Storage.CapacityGigaBytes}GB`;
      ability.all.push(`${summary.Storage.CapacityGigaBytes}GB(S)`);
    }
    if (summary.NetworkInterfaces && summary.NetworkInterfaces.MaxSpeedGbps) {
      ability.N = `${summary.NetworkInterfaces.MaxSpeedGbps}Mbps`;
      ability.all.push(`${summary.NetworkInterfaces.MaxSpeedGbps}Mbps(N)`);
    }
  } catch (err) {
    console.error(err);
    ability.all.push("Error");
  }
  return ability;
};

const resourcesByType = (resources: any = null, selected: any = "All"): any => {
  let res: any = [];
  try {
    if (selected !== "All") {
      res =
        resources && resources[selected] && resources[selected].length
          ? resources[selected]
          : [];
    } else {
      Object.keys(resources).forEach((key) => {
        res = res.concat(resources[key]);
      });
      const temp: any = [];
      res = res.filter((item: any) => {
        if (!temp.includes(item.Id)) {
          temp.push(item.Id);
          return true;
        }
        return false;
      });
    }
  } catch (err) {
    res = [];
  }

  return res;
};

const countDSPort = (compute: any = null): number => {
  let count = 0;
  if (compute && compute.FabricInfo) {
    compute.FabricInfo.forEach((cm: any) => {
      // const dp = cm.Ports.filter((p: any) => p.PortType === "DownstreamPort");
      // count = count + dp.length;
      count = count + cm.DownstreamPorts;
    });
  }
  return count;
};

export {
  generateObjData,
  genObjAccord,
  arrayObjectArray,
  resourceData,
  arrayObject,
  resourcesByType,
  countDSPort,
};
