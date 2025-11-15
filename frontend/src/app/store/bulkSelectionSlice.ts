import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BulkSelectionState {
  selectedIds: number[];
}

const initialState: BulkSelectionState = { selectedIds: [] };

export const bulkSelectionSlice = createSlice({
  name: "bulkSelection",
  initialState,
  reducers: {
    toggle: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(x => x !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAll: (state, action: PayloadAction<number[]>) => {
      state.selectedIds = action.payload;
    },
    clear: (state) => {
      state.selectedIds = [];
    },
  },
});

export const { toggle, selectAll, clear } = bulkSelectionSlice.actions;
export default bulkSelectionSlice.reducer;
