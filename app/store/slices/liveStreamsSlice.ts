import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchLiveStreams = createAsyncThunk("liveStreams/fetchLiveStreams", async () => {
  return await api.dashboard.getLiveStreams();
});

// No backend endpoint for cancelling a scheduled stream — local state only
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
  likes: number;
  chatMessages: Array<{ id: string; user: string; text: string }>;
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
        if (state.live.length === 0 && state.scheduled.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchLiveStreams.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.live = (payload?.currentlyLive || payload?.live || payload?.active || []).map((s: any) => ({
          id: s.id || s._id || s.streamId || "",
          title: s.title || "Live Stream",
          seller: s.seller || s.host || s.hostName || "Seller",
          category: s.category || "",
          viewers: s.viewers || s.viewerCount || s.viewersCount || 0,
          likes: s.likes || s.likesCount || 0,
          chatMessages: (s.chatMessages || []).map((msg: any) => ({
            id: msg.id || msg._id || Math.random().toString(),
            user: msg.user || "User",
            text: msg.text || msg.message || ""
          })),
          duration: s.duration || "—",
          thumbnail: s.thumbnail || "",
        }));
        state.scheduled = (payload?.scheduled || payload?.upcoming || []).map((s: any) => ({
          id: s.id || s._id || s.streamId || "",
          title: s.title || "Scheduled Stream",
          seller: s.seller || s.host || s.hostName || "Seller",
          category: s.category || "",
          time: s.time || s.scheduledTime || s.scheduledAt || s.startTime || "",
        }));
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
