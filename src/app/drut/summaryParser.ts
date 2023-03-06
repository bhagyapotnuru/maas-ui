const getParsedSummary = (summary: any = null): any => {
  const fnData: Array<any> = [];
  const Total: any = {
    chart: "PIE",
    position: 0,
    total: 0,
    title: "Resource Blocks",
    counters: { Unused: 0, Composed: 0, Failed: 0, Unavailable: 0 },
    data: null,
    unit: "",
  };
  const data: any = summary?.Summary?.ResourceBlock || {};
  const keys = Object.keys(data).sort();
  // Object.keys(data).forEach((key, index) => {
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const cs = data[key].CompositionState;
    const obj: any = {
      chart: "MTR",
      position: index + 1,
      total: 0,
      title: key,
      counters: { Unused: 0, Composed: 0, Failed: 0, Unavailable: 0 },
      data: null,
      data1: null,
    };
    Object.keys(cs).forEach((cKey: string) => {
      Total.counters[cKey] = Total.counters[cKey] + cs[cKey];
      Total.total = Total.total + cs[cKey];
      obj.counters[cKey] = cs[cKey];
      obj.total = obj.total + cs[cKey];
    });
    if (key === "Compute") {
      obj.data = getTotalByKey(
        summary?.Summary?.Cluster.TotalComputeCores || null,
        "CPU",
        "CORES"
      );
      obj.data1 = getTotalByKey(
        summary?.Summary?.Cluster.TotalComputeMemoryGiB || null,
        "RAM",
        "GB"
      );
    } else if (key === "ComputerSystem") {
      obj.data = getTotalByKey(
        summary?.Summary?.Cluster.TotalComputerSystemCores || null,
        "CPU",
        "CORES"
      );
      if (summary?.Summary?.Cluster.TotalComputerSystemMemoryGiB) {
        obj.data1 = getTotalByKey(
          summary?.Summary?.Cluster.TotalComputerSystemMemoryGiB || null,
          "RAM",
          "GB"
        );
      }
    } else if (key === "Memory") {
      obj.data = getTotalByKey(
        summary?.Summary?.Cluster.TotalSystemMemoryGiB || null,
        "RAM",
        "GB"
      );
    } else if (key === "Offload") {
      obj.data = getTotalByKey(
        summary?.Summary?.Cluster.TotalOffloadCores || null,
        "GPU",
        "CORES"
      );
    } else if (key === "Network") {
      obj.data = getTotalByKey(
        summary?.Summary?.Cluster.TotalNetworkMaxSpeedGbps || null,
        "NICS",
        "GBPs"
      );
    } else if (key === "Storage") {
      obj.data = getTotalByKey(
        summary?.Summary?.Cluster.TotalStorageCapacityGigaBytes || null,
        "STORAGE",
        "GB"
      );
    }

    fnData.push(obj);
  }
  // });

  fnData.unshift(Total);

  return fnData;
};

const getTotalByKey = (dt: any, name: any, unit: any) => {
  const obj: any = {
    total: 0.0,
    Unused: 0,
    Composed: 0,
    Failed: 0,
    Unavailable: 0,
    name,
    unit,
  };
  if (dt) {
    Object.keys(dt).forEach((key: any) => {
      const obData = dt[key];

      Object.keys(obData).forEach((k: any) => {
        obj[k] = obData[k];
        obj.total += obData[k];
      });
    });
  }
  obj.total = parseFloat(parseFloat(obj.total.toString()).toFixed(1));
  return obj;
};

// Inventry
const getSummaryInventry: any = (summary: any = null) => {
  const fnd: Array<any> = [];
  const data = summary?.Summary?.Resource || {};
  Object.keys(data).forEach((key) => {
    const mmd: any = {
      name: "",
      total: 0,
      Unused: 0,
      Composed: 0,
      Failed: 0,
      Unavailable: 0,
      Reserved: 0,
      SharingCapable: 0,
      data: {},
    };
    const sData: any = data[key];
    mmd.name = key;
    Object.keys(sData).forEach((sKey) => {
      if (typeof sData[sKey] === "object") {
        if (sKey === "CompositionState") {
          const cData: any = sData[sKey];
          Object.keys(cData).forEach((nKey: string) => {
            mmd[nKey] = cData[nKey];
            mmd.total += cData[nKey];
          });
        } else {
          if (!data[sKey]) {
            mmd.data[sKey] = [];
          }
          mmd.data[sKey].push(typeInventries(sData[sKey]));
        }
      } else {
        mmd[sKey] = sData[sKey];
      }
    });
    fnd.push(mmd);
  });
  return fnd;
};

const typeInventries = (data: any) => {
  const structure: any = {
    name: "",
    total: 0,
    Unused: 0,
    Composed: 0,
    Failed: 0,
    Unavailable: 0,
  };
  Object.keys(data).forEach((key) => {
    structure.name = key;
    const dt = data[key];
    Object.keys(dt).forEach((nKey) => {
      structure[nKey] = dt[nKey];
      structure.total += dt[nKey];
    });
  });
  return structure;
};

export { getParsedSummary, getSummaryInventry };
