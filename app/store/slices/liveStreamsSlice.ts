import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchLiveStreams = createAsyncThunk("liveStreams/fetchLiveStreams", async () => {
  return await api.dashboard.getLiveStreams();
});

export const cancelScheduledStream = createAsyncThunk(
  "liveStreams/cancelScheduledStream",
  async (id: string) => {
    return id;
  }
);

export interface LiveStream {
  id: string;
  title: string;
  seller: string;
  category: string;
  viewers: number;
  duration: string;
  thumbnail?: string;
}

export interface ScheduledStream {
  id: string;
  title: string;
  seller: string;
  category: string;
  time: string;
}

interface LiveStreamsState {
  live: LiveStream[];
  scheduled: ScheduledStream[];
  loading: boolean;
  error: string | null;
}

const initialState: LiveStreamsState = {
  live: [],
  scheduled: [],
  loading: false,
  error: null,
};

const liveStreamsSlice = createSlice({
  name: "liveStreams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveStreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveStreams.fulfilled, (state, action) => {
        state.loading = false;
        state.live = action.payload?.live || [];
        state.scheduled = action.payload?.scheduled || [];
      })
      .addCase(fetchLiveStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load live streams";
      })
      .addCase(cancelScheduledStream.fulfilled, (state, action) => {
        state.scheduled = state.scheduled.filter((stream) => stream.id !== action.payload);
      });
  },
});

export default liveStreamsSlice.reducer;
