import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { AddZones, canBeAddedZonesData } from "./addzones/slice";
import type { UserZoneState, UserZone, RemoveZone } from "./types";
import { UserZoneMeta } from "./types";

import { fetchUsersAndZones, removeZones } from "app/drut/api";
import { genericInitialState } from "app/store/utils/slice";
// import { generateCommonReducers } from "app/store/utils";

export const fetcUserZoneData = createAsyncThunk<
  UserZone[],
  AbortSignal | undefined
>("UserZone/fetchData", async (signal = undefined) => {
  return await fetchUsersAndZones(signal);
});

export const deleteZones = createAsyncThunk<any, RemoveZone>(
  "UserZone/deleteZones",
  async (data) => {
    return await removeZones(data);
  }
);

const slice = createSlice({
  name: UserZoneMeta.MODEL,
  initialState: genericInitialState as UserZoneState,
  reducers: {
    // ...generateCommonReducers<UserZoneState, UserZoneMeta.PK, void, void>(
    //   UserZoneMeta.MODEL,
    //   UserZoneMeta.PK
    // ),
    cleanup(state) {
      state.errors = null;
      state.saved = false;
      state.saving = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetcUserZoneData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetcUserZoneData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetcUserZoneData.rejected, (state, action: any) => {
        state.loading = false;
        state.errors = action.error.message;
      })
      .addCase(deleteZones.pending, (state, action) => {
        state.saving = true;
      })
      .addCase(deleteZones.fulfilled, (state, action) => {
        state.saving = false;
        state.saved = true;
      })
      .addCase(deleteZones.rejected, (state, action: any) => {
        state.saving = false;
        state.errors = action.error.message;
      })
      .addCase(AddZones.rejected, (state, action: any) => {
        state.errors = action.error.message;
      })
      .addCase(canBeAddedZonesData.rejected, (state, action: any) => {
        state.errors = action.error.message;
      });
  },
});

export const { actions } = slice;

export default slice.reducer;
