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

const fallbackOverviewData: OverviewData = {
  stats: [
    { name: "Total Users", value: "12,540", color: "bg-blue-600" },
    { name: "Active Sellers", value: "3,210", color: "bg-green-600" },
    { name: "Live Streams Now", value: "28", color: "bg-red-600" },
    { name: "Total Trades Today", value: "184", color: "bg-purple-600" },
    { name: "Total Revenue", value: "$24,580", color: "bg-yellow-600" },
    { name: "Pending Disputes", value: "12", color: "bg-orange-600" },
  ],
  revenueData: [
    { day: "Mon", revenue: 3200 },
    { day: "Tue", revenue: 4100 },
    { day: "Wed", revenue: 3800 },
    { day: "Thu", revenue: 4500 },
    { day: "Fri", revenue: 3900 },
    { day: "Sat", revenue: 5300 },
    { day: "Sun", revenue: 4800 },
  ],
  growthData: [
    { month: "Jan", users: 8500 },
    { month: "Feb", users: 9200 },
    { month: "Mar", users: 10100 },
    { month: "Apr", users: 12540 },
  ],
  ratioData: [
    { name: "Trades", value: 45 },
    { name: "Purchases", value: 55 },
  ],
  recentOrders: [
    {
      id: "ORD-1234",
      item: "Nike Air Jordan 1",
      user: "John Doe",
      price: "$320",
      status: "Shipped",
      statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "ORD-1235",
      item: "Rolex Submariner",
      user: "Jane Smith",
      price: "$8,500",
      status: "Pending",
      statusColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    },
    {
      id: "ORD-1236",
      item: "Pokemon Card Charizard",
      user: "Mike Johnson",
      price: "$450",
      status: "Delivered",
      statusColor: "text-green-500 bg-green-500/10 border-green-500/20",
    },
  ],
  recentTrades: [
    {
      id: "TRD-5678",
      items: "Sneakers ↔ Watch",
      users: "Alex Brown ↔ Chris Lee",
      status: "Pending",
      statusColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    },
    {
      id: "TRD-5679",
      items: "Cards ↔ Sneakers",
      users: "Emma Davis ↔ Ryan Clark",
      status: "Accepted",
      statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
  ],
  flaggedActivities: [
    {
      user: "suspect_user_99",
      reason: "Multiple failed payment attempts",
      level: "High",
      color: "text-red-500 bg-red-500/10 border-red-500/20",
    },
    {
      user: "trader_xyz",
      reason: "Unusual trade pattern detected",
      level: "Medium",
      color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    },
  ],
};

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
          state.data = null;
          return;
        }

        // Check if the payload is from the backend (contains summaryCards or revenueLast7Days)
        const isBackend = payload.summaryCards !== undefined || payload.revenueLast7Days !== undefined;

        if (isBackend) {
          const summary = payload.summaryCards || {};
          
          // If database is completely empty (zero users), use mockup demo fallback
          if (!summary.totalUsers) {
            state.data = fallbackOverviewData;
            return;
          }

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

          const growthData = payload.userGrowth || [];

          const ratio = payload.tradeVsPurchaseRatio || { trades: 45, purchases: 55 };
          const ratioData = [
            { name: "Trades", value: ratio.trades },
            { name: "Purchases", value: ratio.purchases },
          ];

          const recentOrders = (payload.recentOrders || []).map((order: any) => {
            const statusColor = 
              order.status === "Delivered" ? "text-green-500 bg-green-500/10 border-green-500/20" :
              order.status === "Pending" ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" :
              "text-blue-500 bg-blue-500/10 border-blue-500/20";
            return {
              id: order.id || "",
              status: order.status || "Pending",
              statusColor: order.statusColor || statusColor,
              item: order.item || order.title || "Product",
              user: order.user || order.buyer || "Customer",
              price: typeof order.amount === "number" ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(order.amount) : (order.price || ""),
            };
          });

          const recentTrades = (payload.recentTrades || []).map((trade: any) => {
            const statusColor = 
              trade.status === "Completed" || trade.status === "Accepted" ? "text-green-500 bg-green-500/10 border-green-500/20" :
              "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            return {
              id: trade.id || "",
              status: trade.status || "Pending",
              statusColor: trade.statusColor || statusColor,
              items: trade.items || trade.title || "Items",
              users: trade.users || `${trade.sender || "User A"} ↔ ${trade.receiver || "User B"}`,
            };
          });

          const flaggedActivities = (payload.flaggedActivities || []).map((activity: any) => {
            const color = 
              activity.severity === "High" || activity.level === "High" ? "text-red-500 bg-red-500/10 border-red-500/20" :
              "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            return {
              user: activity.user || activity.username || "user",
              level: activity.level || activity.severity || "Medium",
              color: activity.color || color,
              reason: activity.reason || "Suspicious activity",
            };
          });

          state.data = {
            stats,
            revenueData,
            growthData,
            ratioData,
            recentOrders,
            recentTrades,
            flaggedActivities,
          };
        } else {
          // Frontend fallback mockup data structure matches
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
