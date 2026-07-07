import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/app/lib/api";

export const fetchOverview = createAsyncThunk("overview/fetchOverview", async () => {
  return await api.dashboard.getOverview();
});

export interface StatCard {
  name: string;
  value: string;
  color?: string;
}

export interface ChartData {
  day?: string;
  month?: string;
  revenue?: number;
  users?: number;
}

export interface RatioItem {
  name: string;
  value: number;
}

export interface RecentOrder {
  id: string;
  item: string;
  user: string;
  price: string;
  status: string;
  statusColor: string;
}

export interface RecentTrade {
  id: string;
  items: string;
  users: string;
  status: string;
  statusColor: string;
}

export interface FlaggedActivity {
  user: string;
  reason: string;
  level: string;
  color: string;
}

export interface OverviewData {
  stats: StatCard[];
  revenueData: ChartData[];
  growthData: ChartData[];
  ratioData: RatioItem[];
  recentOrders: RecentOrder[];
  recentTrades: RecentTrade[];
  flaggedActivities: FlaggedActivity[];
}

interface OverviewState {
  data: OverviewData | null;
  loading: boolean;
  error: string | null;
}

const initialState: OverviewState = {
  data: null,
  loading: false,
  error: null,
};

function getStatusColor(status: string): string {
  if (status === "Delivered" || status === "Completed" || status === "Accepted")
    return "text-green-500 bg-green-500/10 border-green-500/20";
  if (status === "Pending")
    return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  if (status === "Cancelled" || status === "Rejected" || status === "Declined")
    return "text-red-500 bg-red-500/10 border-red-500/20";
  return "text-blue-500 bg-blue-500/10 border-blue-500/20";
}

const overviewSlice = createSlice({
  name: "overview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        if (!payload) {
          state.error = "No data returned from server";
          return;
        }

        // Detect backend structured response
        const isBackend = payload.summaryCards !== undefined || payload.revenueLast7Days !== undefined;

        if (isBackend) {
          const summary = payload.summaryCards || {};

          const stats = [
            { name: "Total Users", value: new Intl.NumberFormat().format(summary.totalUsers || 0), color: "bg-blue-600" },
            { name: "Active Sellers", value: new Intl.NumberFormat().format(summary.activeSellers || 0), color: "bg-green-600" },
            { name: "Live Streams Now", value: new Intl.NumberFormat().format(summary.liveStreamsNow || 0), color: "bg-red-600" },
            { name: "Total Trades Today", value: new Intl.NumberFormat().format(summary.totalTradesToday || 0), color: "bg-purple-600" },
            { name: "Total Revenue", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(summary.totalRevenue || 0), color: "bg-yellow-600" },
            { name: "Pending Disputes", value: new Intl.NumberFormat().format(summary.pendingDisputes || 0), color: "bg-orange-600" },
          ];

          const revenueData = (payload.revenueLast7Days || []).map((r: any) => ({
            day: r.day,
            revenue: r.amount || r.revenue || 0,
          }));

          const growthData = (payload.userGrowth || []).map((g: any) => ({
            month: g.month,
            users: g.users || g.count || 0,
          }));

          const ratio = payload.tradeVsPurchaseRatio || { trades: 0, purchases: 0 };
          const ratioData = [
            { name: "Trades", value: ratio.trades || 0 },
            { name: "Purchases", value: ratio.purchases || 0 },
          ];

          const recentOrders = (payload.recentOrders || []).map((order: any) => ({
            id: order.id || order._id || "",
            status: order.status || "Pending",
            statusColor: order.statusColor || getStatusColor(order.status || "Pending"),
            item: order.item || order.title || order.productName || "Product",
            user: order.user || order.buyer || order.buyerName || "Customer",
            price: typeof order.amount === "number"
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(order.amount)
              : (order.price || order.totalPrice || ""),
          }));

          const recentTrades = (payload.recentTrades || []).map((trade: any) => ({
            id: trade.id || trade._id || "",
            status: trade.status || "Pending",
            statusColor: trade.statusColor || getStatusColor(trade.status || "Pending"),
            items: trade.items || trade.title || `${trade.senderProduct || "Item A"} ↔ ${trade.receiverProduct || "Item B"}`,
            users: trade.users || `${trade.sender || trade.userA || "User A"} ↔ ${trade.receiver || trade.userB || "User B"}`,
          }));

          const flaggedActivities = (payload.flaggedActivities || []).map((activity: any) => {
            const level = activity.level || activity.severity || "Medium";
            return {
              user: activity.user || activity.username || "user",
              level,
              color: activity.color || getStatusColor(level === "High" ? "Declined" : "Pending"),
              reason: activity.reason || "Suspicious activity",
            };
          });

          state.data = { stats, revenueData, growthData, ratioData, recentOrders, recentTrades, flaggedActivities };
        } else {
          // Direct object match (e.g. already-normalised structure)
          state.data = payload;
        }
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load overview data";
      });
  },
});

export default overviewSlice.reducer;
