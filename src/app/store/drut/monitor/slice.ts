import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  MonitorConfigurationState,
  MonitorConfiguration,
  Manager,
  Zone,
} from "./types";
import { MonitorConfigurationMeta } from "./types";

import {
  fetchMonitorConfigurationList,
  fetchManagersData,
  fetchZoneRacksDataByQuery,
  fetchMachineSummaryData,
  fetchSummaryData,
  fetchClusterTypesData,
  fetchResourcePoolsData,
  fetchApplicationPoolsData,
  deleteMonitorConfig,
  setDisplayForMonitorConfigurations,
} from "app/drut/api";
import { genericInitialState } from "app/store/utils/slice";

export const fetcMonitorConfigurations = createAsyncThunk<
  MonitorConfiguration[],
  AbortSignal | undefined
>("MonitorConfiguration/fetchData", async (signal = undefined) => {
  return await fetchMonitorConfigurationList(signal);
});

export const fetchManagers = createAsyncThunk<
  Manager[],
  AbortSignal | undefined
>("MonitorConfiguration/fetchManagerData", async (signal = undefined) => {
  return await fetchManagersData(signal);
});

export const fetchZones = createAsyncThunk<Zone[], AbortSignal | undefined>(
  "MonitorConfiguration/fetchZoneRacksDataByQuery",
  async (signal = undefined) => {
    return await fetchZoneRacksDataByQuery("op=get_zones", signal);
  }
);

export const fetchMachinesData = createAsyncThunk<any, AbortSignal | undefined>(
  "MonitorConfiguration/fetchMachinesData",
  async (signal = undefined) => {
    return await fetchMachineSummaryData(signal);
  }
);

export const fetchSummary = createAsyncThunk<any, AbortSignal | undefined>(
  "MonitorConfiguration/fetchSummary",
  async (signal = undefined) => {
    return fetchSummaryData(signal);
  }
);

export const fetchClusterTypes = createAsyncThunk<any, AbortSignal | undefined>(
  "MonitorConfiguration/fetchClusters",
  async (signal = undefined) => {
    return await fetchClusterTypesData(signal);
  }
);

export const fetchResourcePools = createAsyncThunk<
  any,
  AbortSignal | undefined
>("MonitorConfiguration/fetchResourcePools", async (signal = undefined) => {
  return await fetchResourcePoolsData(signal);
});

export const fetchApplicationPools = createAsyncThunk<
  any,
  AbortSignal | undefined
>("MonitorConfiguration/fetchApplicationPools", async (signal = undefined) => {
  return await fetchApplicationPoolsData(signal);
});

export const deleteConfig = createAsyncThunk<any, any>(
  "UserZone/deleteZones",
  async (data) => {
    return await deleteMonitorConfig(data);
  }
);

export const setDisplay = createAsyncThunk<any, any>(
  "UserZone/setDisplay",
  async (data) => {
    return await setDisplayForMonitorConfigurations(data);
  }
);

const slice = createSlice({
  name: MonitorConfigurationMeta.MODEL,
  initialState: {
    ...genericInitialState,
    managers: [] as Manager[],
    zones: [] as Zone[],
    machines: {},
    resourceBlock: {},
    clusterTypes: [],
    resourcePools: [],
    applicationPools: [],
  } as MonitorConfigurationState,
  reducers: {
    clearError(state) {
      state.errors = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetcMonitorConfigurations.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetcMonitorConfigurations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetcMonitorConfigurations.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(fetchManagers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(fetchMachinesData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchMachinesData.fulfilled, (state, action) => {
        state.loading = false;
        state.machines = action.payload;
      })
      .addCase(fetchMachinesData.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(fetchSummary.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.resourceBlock = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(fetchZones.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload;
      })
      .addCase(fetchZones.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(fetchResourcePools.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchResourcePools.fulfilled, (state, action) => {
        state.loading = false;
        state.resourcePools = action.payload;
      })
      .addCase(fetchResourcePools.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(fetchApplicationPools.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchApplicationPools.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationPools = action.payload;
      })
      .addCase(fetchApplicationPools.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(fetchClusterTypes.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchClusterTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.clusterTypes = action.payload;
      })
      .addCase(fetchClusterTypes.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(deleteConfig.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteConfig.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteConfig.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      })
      .addCase(setDisplay.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(setDisplay.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(setDisplay.rejected, (state, action: any) => {
        state.loading = false;

        state.errors = action.error.message;
      });
  },
});

export const { actions } = slice;

export default slice.reducer;
