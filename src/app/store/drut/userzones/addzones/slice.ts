import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { Zone, AddZoneState } from "../types";
import { AddZoneMeta } from "../types";

import { fetchCanBeAddedZones, updateUserZones } from "app/drut/api";
import { genericInitialState } from "app/store/utils/slice";

export const canBeAddedZonesData = createAsyncThunk<Zone[], any>(
  "AddZone/fetchData",
  async ({ userId, signal = undefined }) => {
    return await fetchCanBeAddedZones(userId, signal);
  }
);

export const AddZones = createAsyncThunk<any, any>(
  "AddZone/deleteZone",
  async (data) => {
    return await updateUserZones(data);
  }
);

const slice = createSlice({
  name: AddZoneMeta.MODEL,
  initialState: genericInitialState as AddZoneState,
  reducers: {
    cleanup(state) {
      state.errors = null;
      state.saved = false;
      state.saving = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(canBeAddedZonesData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(canBeAddedZonesData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(canBeAddedZonesData.rejected, (state, action: any) => {
        state.loading = false;
      })
      .addCase(AddZones.pending, (state, action) => {
        state.saving = true;
      })
      .addCase(AddZones.fulfilled, (state, action) => {
        state.saving = false;
        state.saved = true;
      })
      .addCase(AddZones.rejected, (state, action: any) => {
        state.saving = false;
      });
  },
});

export const { actions } = slice;

export default slice.reducer;
