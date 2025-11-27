import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ThemeState } from "../../../../types";


const initialState: ThemeState = {
  mode: "light",
  color: "blue",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload;
    },
    setThemeColor: (
      state,
      action: PayloadAction<"blue" | "green" | "purple">
    ) => {
      state.color = action.payload;
    },
  },
});

export const { setThemeMode, setThemeColor } = themeSlice.actions;
export default themeSlice.reducer;
