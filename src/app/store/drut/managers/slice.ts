import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  ManagersState,
  Manager,
  Zone,
  FetchManagersByQueryPayload,
  CreateOrUpdateManagerPayload,
} from "./types";
import { ManagersMeta } from "./types";

import {
  fetchManagersDataByQuery,
  createOrUpdateManagers,
  fetchZoneRacksDataByQuery,
} from "app/drut/api";
import { paginationOptions } from "app/drut/types";
import { genericInitialState } from "app/store/utils/slice";

export const fetchManagersByQuery = createAsyncThunk<
  any,
  FetchManagersByQueryPayload
>(
  "Managers/fetchManagersByQuery",
  async ({ params = "", signal = undefined }) => {
    return await fetchManagersDataByQuery(params, signal);
  }
);

export const fetchZoneRacksByQuery = createAsyncThunk<
  Zone[],
  AbortSignal | undefined
>("Managers/fetchZoneRacksByQuery", async (signal = undefined) => {
  return await fetchZoneRacksDataByQuery("op=get_zones_and_racks", signal);
});

export const createUpdateManager = createAsyncThunk<
  Manager[],
  CreateOrUpdateManagerPayload
>(
  "Managers/createUpdateManager",
  async ({ params = null, data = null, isUpdateOperation = false }) => {
    return await createOrUpdateManagers(params, data, isUpdateOperation);
  }
);

const slice = createSlice({
  name: ManagersMeta.MODEL,
  initialState: {
    ...genericInitialState,
    searchText: "",
    prev: 0,
    next: 1,
    pageSize: paginationOptions[0].value,
    formLoading: false,
    clearHeader: false,
    unassignedManagers: [],
    isUnassigned: false,
    fetchManagers: false,
    isInProgressCallManagers: false,
    isInProgressCallUnassignedManagers: false,
    selectedIds: [],
    zones: [],
    filterType: "",
    selectedItem: "",
    count: 0,
    redfishurlEdit: false,
  } as ManagersState,
  reducers: {
    cleanup(state) {
      state.searchText = "";
      state.prev = 0;
      state.next = 1;
      state.pageSize = paginationOptions[0].value;
      state.selectedIds = [];
      state.filterType = "";
      state.selectedItem = "";
      state.count = 0;
      state.isInProgressCallManagers = false;
      state.isInProgressCallUnassignedManagers = false;
      state.clearHeader = false;
      state.formLoading = false;
      state.errors = null;
      state.redfishurlEdit = false;
    },
    setFilterType(state, action) {
      state.filterType = action.payload;
    },
    setSelectedItem(state, action) {
      state.selectedItem = action.payload;
    },
    setIsUnassigned(state, action) {
      state.isUnassigned = action.payload;
    },
    setFetchManagers(state, action) {
      state.fetchManagers = action.payload;
    },
    setNext(state, action) {
      state.next = action.payload;
    },
    setPrev(state, action) {
      state.prev = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
    setError(state, action) {
      state.errors = action.payload;
    },
    setSelectedIds(state, action) {
      state.selectedIds = action.payload;
    },
    setClearHeader(state, action) {
      state.clearHeader = action.payload;
    },
    setRedfishurlEdit(state, action) {
      state.redfishurlEdit = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchManagersByQuery.pending, (state, action) => {
        if (state.isUnassigned) {
          if (!state.isInProgressCallUnassignedManagers) {
            state.loading = true;
          }
        } else {
          if (!state.isInProgressCallManagers) {
            state.loading = true;
          }
        }
      })
      .addCase(fetchManagersByQuery.fulfilled, (state, action) => {
        state.count = action.payload.count;
        const res = action.payload?.results?.filter(
          (r: Manager) => r.discovery_status === "IN_PROGRESS"
        );
        if (state.isUnassigned) {
          state.unassignedManagers = action.payload?.results;
          if (res?.length) {
            state.isInProgressCallUnassignedManagers = true;
          } else {
            state.isInProgressCallUnassignedManagers = false;
          }
        } else {
          state.items = action.payload?.results;
          if (res?.length) {
            state.isInProgressCallManagers = true;
          } else {
            state.isInProgressCallManagers = false;
          }
        }
        state.fetchManagers = false;
        state.loading = false;
      })
      .addCase(fetchManagersByQuery.rejected, (state, action: any) => {
        state.errors = action.error.message;
        state.fetchManagers = false;
        state.loading = false;
      })
      .addCase(fetchZoneRacksByQuery.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchZoneRacksByQuery.fulfilled, (state, action) => {
        state.zones = action.payload;
        state.loading = false;
      })
      .addCase(fetchZoneRacksByQuery.rejected, (state, action: any) => {
        state.errors = action.error.message;
        state.loading = false;
      })
      .addCase(createUpdateManager.pending, (state, action) => {
        state.formLoading = true;
      })
      .addCase(createUpdateManager.fulfilled, (state, action) => {
        state.fetchManagers = true;
        state.clearHeader = true;
        if (action?.meta?.arg?.isUpdateOperation) {
          state.selectedIds = [];
        }
        state.formLoading = false;
      })
      .addCase(createUpdateManager.rejected, (state, action: any) => {
        state.clearHeader = true;
        state.errors = action.error.message;
        state.formLoading = false;
      });
  },
});

export const { actions } = slice;

export default slice.reducer;
