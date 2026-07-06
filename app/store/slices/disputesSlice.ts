import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export interface DisputeItem {
  id: string;
  status: string;
  priority: string;
  date: string;
  users: Array<{ name: string; color: string; initial: string }>;
  targetId: string;
  issueType: string;
  description: string;
}

export const fetchDisputes = createAsyncThunk("disputes/fetchDisputes", async () => {
  return await api.dashboard.getDisputes();
});

export const resolveDispute = createAsyncThunk(
  "disputes/resolveDispute",
  async (id: string) => {
    await api.support.updateStatus(id, "solved", "Resolved by Admin intervention.");
    return id;
  }
);

export const rejectDispute = createAsyncThunk(
  "disputes/rejectDispute",
  async (id: string) => {
    await api.support.updateStatus(id, "dismissed", "Rejected by Admin intervention.");
    return id;
  }
);

interface DisputesState {
  items: DisputeItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DisputesState = {
  items: [],
  loading: false,
  error: null,
};

const disputesSlice = createSlice({
  name: "disputes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisputes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = (action.payload || []).map((d: any, idx: number) => {
          const colors = ["bg-blue-500", "bg-teal-500", "bg-purple-500", "bg-rose-500"];
          const usersInvolved = d.usersInvolved || [];
          const usersMapped = usersInvolved.map((u: any, i: number) => {
            const name = typeof u === "string" ? u : (u.name || "User");
            return {
              name,
              color: colors[i % colors.length],
              initial: name.charAt(0).toUpperCase(),
            };
          });

          return {
            id: d.id || d.disputeId || "",
            status: d.status || "Open",
            priority: d.priority || d.severity || "Medium",
            date: d.date || d.openedOn || "",
            users: d.users || usersMapped,
            targetId: d.targetId || d.orderOrTradeId || "",
            issueType: d.issueType || "Dispute",
            description: d.description || "",
          };
        });
      })
      .addCase(fetchDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load disputes";
      })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        state.items = state.items.map((dispute) =>
          dispute.id === action.payload ? { ...dispute, status: "Resolved" } : dispute
        );
      })
      .addCase(rejectDispute.fulfilled, (state, action) => {
        state.items = state.items.map((dispute) =>
          dispute.id === action.payload ? { ...dispute, status: "Rejected" } : dispute
        );
      });
  },
});

export default disputesSlice.reducer;
