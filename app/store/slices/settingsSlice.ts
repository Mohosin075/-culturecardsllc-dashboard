import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchSettings = createAsyncThunk("settings/fetchSettings", async () => {
  return await api.dashboard.getSettings();
});

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settings: any) => {
    await api.dashboard.updateSettings(settings);
    return settings;
  }
);

interface SettingsState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  data: null,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load settings";
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        // Merge updated state
        if (state.data) {
          state.data = {
            ...state.data,
            commissionSettings: {
              purchaseCommission: action.payload.commissionPurchase,
              tradeCommission: action.payload.commissionTrade,
            },
            paymentGateway: {
              processor: action.payload.gatewayName,
              testMode: action.payload.testMode,
            },
            notificationSettings: {
              newOrderNotifications: action.payload.toggles?.newOrder,
              disputeAlerts: action.payload.toggles?.dispute,
              systemAlerts: action.payload.toggles?.system,
            },
            securitySettings: {
              twoFactor: action.payload.toggles?.twoFactor,
              ipWhitelist: action.payload.toggles?.ipWhitelist,
              sessionTimeout: action.payload.sessionTimeout,
            },
          };
        }
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update settings";
      });
  },
});

export default settingsSlice.reducer;
