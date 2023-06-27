import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { AddorUpdateGroup, Group, GroupState } from "./types";
import { GroupMeta, DEFAULT_GROUP_NAMES } from "./types";

import {
  createOrUpdateNodeGroup,
  deleteNodeGroup,
  fetchGroupsData,
} from "app/drut/api";
import { genericInitialState } from "app/store/utils/slice";

export const getGroupsData = createAsyncThunk<any, AbortSignal | undefined>(
  "Groups/fetchGroups",
  async (signal = undefined) => {
    return await fetchGroupsData(signal);
  }
);
export const addOrUpdateData = createAsyncThunk<any, AddorUpdateGroup>(
  "Groups/AddorUpdate",
  async (data) => {
    return await createOrUpdateNodeGroup(
      data.id,
      data.groupToAddorUpdate,
      data.isUpdateOperation
    );
  }
);

export const deleteGroup = createAsyncThunk<any, Group | null>(
  "Groups/deletegroup",
  async (data) => {
    return await deleteNodeGroup(data?.id, data?.name);
  }
);

const slice = createSlice({
  name: GroupMeta.MODEL,
  initialState: {
    ...genericInitialState,
    fetchGroups: true,
    filter: "",
    searchFilterText: "",
    renderAddGroupsForm: false,
    renderDeleteGroupsForm: false,
    renderUpdateGroupsForm: false,
    addOrDeleteGroup: null,
    groupsData: [],
  } as GroupState,
  reducers: {
    cleanUp(state) {
      state.filter = "";
      state.searchFilterText = "";
      state.errors = null;
    },
    setFetchGroups(state, action) {
      state.fetchGroups = action.payload;
    },
    clearError(state) {
      state.errors = null;
    },
    setSearchFilterText(state, action) {
      state.searchFilterText = action.payload;
    },
    setFilterValue(state, action) {
      state.filter = action.payload;
    },
    setRenderAddGroupsForm(state, action) {
      state.renderAddGroupsForm = action.payload;
    },
    setRenderDeleteGroupsForm(state, action) {
      state.renderDeleteGroupsForm = action.payload;
      state.addOrDeleteGroup = null;
    },
    setRenderUpdateGroupsForm(state, action) {
      state.renderUpdateGroupsForm = action.payload;
    },
    setGroupsData(state, action) {
      state.groupsData = action.payload;
    },
    setAddOrDeleteGroup(state, action) {
      state.addOrDeleteGroup = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getGroupsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupsData.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload
          .filter(
            (grp: any) => !DEFAULT_GROUP_NAMES.includes(grp.name.toLowerCase())
          )
          .map((grp: any) => {
            return {
              ...grp,
              categoryName: grp.category === "RACK" ? "POOL" : grp.category,
            };
          });
        state.items = data;
        state.fetchGroups = false;
      })
      .addCase(getGroupsData.rejected, (state, action: any) => {
        state.loading = false;
        state.errors = action.error.message;
        state.fetchGroups = false;
      })
      .addCase(addOrUpdateData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOrUpdateData.fulfilled, (state) => {
        state.loading = false;
        state.fetchGroups = true;
        state.addOrDeleteGroup = null;
      })
      .addCase(addOrUpdateData.rejected, (state, action: any) => {
        state.loading = false;
        state.errors = action.error.message;
        state.addOrDeleteGroup = null;
      })
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.renderDeleteGroupsForm = false;
      })
      .addCase(deleteGroup.fulfilled, (state) => {
        state.loading = false;
        state.fetchGroups = true;
        state.addOrDeleteGroup = null;
      })
      .addCase(deleteGroup.rejected, (state, action: any) => {
        state.loading = false;
        state.errors = action.error.message;
        state.addOrDeleteGroup = null;
      });
  },
});

export const { actions } = slice;

export default slice.reducer;
