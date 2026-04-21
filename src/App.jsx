import React, { useMemo, useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  BarChart3,
  Coffee,
  AlertTriangle,
  X,
  User,
  Lock,
  LogOut,
  Calendar,
  Shield,
  UserCircle,
  Mail,
  Download,
  BellRing,
  CheckCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// -------------------------
// API
// -------------------------
const API_BASE = "https://ohana-backend.onrender.com";
const TOKEN_KEY = "ohana_token";
const USER_KEY = "ohana_user";

const getSavedToken = () => localStorage.getItem(TOKEN_KEY);

const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const apiFetch = async (path, options = {}) => {
  const token = getSavedToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
};

// -------------------------
// 1) INVENTORY (ALL RAW MATERIALS)
// -------------------------
const INITIAL_INVENTORY = {
  coffeeBeans: 5000,
  matchaPowder: 1000,
  cocoaPowder: 1000,
  milk: 10000,
  sugarSyrup: 5000,
  condensedMilk: 2000,
  cups12oz: 50,
  cups16oz: 50,
  cups22oz: 50,
  lids: 200,
  straws: 200,
};

// -------------------------
// 2) PRODUCTS
// -------------------------
const products = [
  {
    id: 1,
    name: "Americano",
    desc: "Espresso + hot water",
    image: "https://images.pexels.com/photos/4264049/pexels-photo-4264049.jpeg",
    prices: { "12oz": 60, "16oz": 70, "22oz": 80 },
    category: "Coffee",
    matchScore: 95,
  },
  {
    id: 2,
    name: "Cafe Latte",
    desc: "Espresso + milk",
    image:
      "https://images.pexels.com/photos/35026581/pexels-photo-35026581.jpeg?auto=compress&cs=tinysrgb&w=600",
    prices: { "12oz": 80, "16oz": 90, "22oz": 100 },
    category: "Coffee",
    matchScore: 92,
  },
  {
    id: 3,
    name: "Caramel Latte",
    desc: "Espresso + milk + caramel",
    image:
      "https://images.unsplash.com/photo-1599398054066-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    prices: { "12oz": 90, "16oz": 100, "22oz": 110 },
    category: "Coffee",
    matchScore: 88,
  },
  {
    id: 4,
    name: "Hazelnut Latte",
    desc: "Espresso + milk + hazelnut",
    image: "https://images.pexels.com/photos/5169108/pexels-photo-5169108.jpeg",
    prices: { "12oz": 90, "16oz": 100, "22oz": 110 },
    category: "Coffee",
    matchScore: 85,
  },
  {
    id: 5,
    name: "Spanish Latte",
    desc: "Espresso + milk + condensed milk",
    image: "https://images.pexels.com/photos/34534271/pexels-photo-34534271.jpeg",
    prices: { "12oz": 90, "16oz": 100, "22oz": 110 },
    category: "Coffee",
    matchScore: 96,
  },
  {
    id: 6,
    name: "Vanilla Latte",
    desc: "Espresso + milk + vanilla syrup",
    image: "https://images.pexels.com/photos/34032348/pexels-photo-34032348.jpeg",
    prices: { "12oz": 95, "16oz": 105, "22oz": 115 },
    category: "Coffee",
    matchScore: 90,
  },
  {
    id: 7,
    name: "Dark Mocha",
    desc: "Espresso + milk + cocoa",
    image: "https://images.pexels.com/photos/3491211/pexels-photo-3491211.jpeg",
    prices: { "12oz": 95, "16oz": 105, "22oz": 115 },
    category: "Coffee",
    matchScore: 82,
  },
  {
    id: 8,
    name: "White Mocha",
    desc: "Espresso + milk + sweet cocoa",
    image: "https://images.pexels.com/photos/2034078/pexels-photo-2034078.jpeg",
    prices: { "12oz": 95, "16oz": 105, "22oz": 115 },
    category: "Coffee",
    matchScore: 84,
  },
  {
    id: 9,
    name: "Caramel Macchiato",
    desc: "Espresso + milk + caramel drizzle",
    image: "https://images.pexels.com/photos/236288/pexels-photo-236288.jpeg",
    prices: { "12oz": 95, "16oz": 105, "22oz": 115 },
    category: "Coffee",
    matchScore: 98,
  },
  {
    id: 10,
    name: "Dirty Matcha Latte",
    desc: "Espresso + matcha + milk",
    image: "https://images.pexels.com/photos/27793644/pexels-photo-27793644.jpeg",
    prices: { "12oz": 95, "16oz": 105, "22oz": 115 },
    category: "Coffee",
    matchScore: 89,
  },
  {
    id: 11,
    name: "Matcha Latte",
    desc: "Milk + matcha",
    image: "https://images.pexels.com/photos/25686146/pexels-photo-25686146.jpeg",
    prices: { "12oz": 85, "16oz": 95, "22oz": 105 },
    category: "Non-Coffee",
    matchScore: 78,
  },
  {
    id: 12,
    name: "Double Chocolate",
    desc: "Milk + cocoa",
    image: "https://images.pexels.com/photos/11623153/pexels-photo-11623153.jpeg",
    prices: { "12oz": 85, "16oz": 95, "22oz": 105 },
    category: "Non-Coffee",
    matchScore: 91,
  },
  {
    id: 13,
    name: "Espresso Shot",
    desc: "Extra kick of coffee",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    prices: { Single: 20 },
    category: "Add-Ons",
    matchScore: 0,
  },
  {
    id: 14,
    name: "Extra Milk",
    desc: "Creamy addition",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80",
    prices: { Portion: 20 },
    category: "Add-Ons",
    matchScore: 0,
  },
  {
    id: 15,
    name: "Syrup",
    desc: "Vanilla, Caramel, or Hazelnut",
    image: "https://images.pexels.com/photos/33260/honey-sweet-syrup-organic.jpg",
    prices: { Pump: 10 },
    category: "Add-Ons",
    matchScore: 0,
  },
  {
    id: 16,
    name: "Sauce",
    desc: "Chocolate or Caramel drizzle",
    image: "https://images.pexels.com/photos/5060468/pexels-photo-5060468.jpeg",
    prices: { Drizzle: 10 },
    category: "Add-Ons",
    matchScore: 0,
  },
];

// -------------------------
// 3) RECIPES
// -------------------------
const getSizeMultiplier = (sizeKey, isAddon) => {
  if (isAddon) return 1;
  if (sizeKey === "16oz") return 1.2;
  if (sizeKey === "22oz") return 1.5;
  return 1;
};

const RECIPES = {
  1: { beans: 18 },
  2: { beans: 18, milk: 200, sugarSyrup: 20 },
  3: { beans: 18, milk: 200, sugarSyrup: 40 },
  4: { beans: 18, milk: 200, sugarSyrup: 35 },
  5: { beans: 18, milk: 150, condensedMilk: 80, sugarSyrup: 30 },
  6: { beans: 18, milk: 200, sugarSyrup: 30 },
  7: { beans: 18, milk: 200, cocoaPowder: 20, sugarSyrup: 30 },
  8: { beans: 18, milk: 200, sugarSyrup: 30 },
  9: { beans: 18, milk: 180, sugarSyrup: 45 },
  10: { beans: 18, milk: 150, matchaPowder: 10, sugarSyrup: 25 },
  11: { milk: 250, matchaPowder: 15, sugarSyrup: 35 },
  12: { milk: 250, cocoaPowder: 25, sugarSyrup: 35 },
  13: { beans: 18 },
  14: { milk: 50 },
  15: { sugarSyrup: 30 },
  16: { cocoaPowder: 15 },
};

const invKeyFor = (recipeKey) => {
  if (recipeKey === "beans") return "coffeeBeans";
  if (recipeKey === "milk") return "milk";
  if (recipeKey === "matchaPowder") return "matchaPowder";
  if (recipeKey === "cocoaPowder") return "cocoaPowder";
  if (recipeKey === "sugarSyrup") return "sugarSyrup";
  if (recipeKey === "condensedMilk") return "condensedMilk";
  return null;
};

// -------------------------
// 4) COST + HEALTH
// -------------------------
const UNIT_COST = {
  coffeeBeans: 0.02,
  matchaPowder: 0.05,
  cocoaPowder: 0.04,
  milk: 0.01,
  sugarSyrup: 0.015,
  condensedMilk: 0.03,
  cups12oz: 0.5,
  cups16oz: 0.6,
  cups22oz: 0.7,
  lids: 0.1,
  straws: 0.1,
};

const HEALTH = {
  coffeeBeans: { red: 900, yellow: 2000 },
  matchaPowder: { red: 150, yellow: 300 },
  cocoaPowder: { red: 150, yellow: 300 },
  milk: { red: 1500, yellow: 3500 },
  sugarSyrup: { red: 800, yellow: 1600 },
  condensedMilk: { red: 200, yellow: 500 },
  cups12oz: { red: 10, yellow: 20 },
  cups16oz: { red: 10, yellow: 20 },
  cups22oz: { red: 10, yellow: 20 },
  lids: { red: 30, yellow: 80 },
  straws: { red: 30, yellow: 80 },
};

const getHealthBadge = (key, value) => {
  const t = HEALTH[key];
  if (!t) return { label: "Green", color: "bg-green-100 text-green-800 border-green-300" };
  if (value < t.red) return { label: "Red", color: "bg-red-100 text-red-800 border-red-300" };
  if (value < t.yellow) {
    return { label: "Yellow", color: "bg-amber-100 text-amber-800 border-amber-300" };
  }
  return { label: "Green", color: "bg-green-100 text-green-800 border-green-300" };
};

const MATERIALS_TABLE = [
  { key: "coffeeBeans", label: "Coffee Beans (g)" },
  { key: "matchaPowder", label: "Matcha Powder (g)" },
  { key: "cocoaPowder", label: "Cocoa Powder (g)" },
  { key: "milk", label: "Milk (ml)" },
  { key: "sugarSyrup", label: "Sugar Syrup (ml)" },
  { key: "condensedMilk", label: "Condensed Milk (ml)" },
  { key: "cups12oz", label: "Cups (12oz)" },
  { key: "cups16oz", label: "Cups (16oz)" },
  { key: "cups22oz", label: "Cups (22oz)" },
  { key: "lids", label: "Lids" },
  { key: "straws", label: "Straws" },
];

// -------------------------
// 5) CSV
// -------------------------
const downloadCSV = (filename, headers, rows) => {
  const esc = (v) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, "\"\"")}"`;
    return s;
  };
  const csv = [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// -------------------------
// 6) TIME HELPERS
// -------------------------
const toLocalYMD = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const toLocalYM = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

const startOfWeekMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const labelFromBucket = (bucket, range) => {
  if (range === "day") return bucket.substring(5);
  if (range === "week") return `Week of ${bucket.substring(5)}`;
  if (range === "month") return bucket;
  return bucket;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState("staff");

  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [orders, setOrders] = useState([]);
  const [soldCounts, setSoldCounts] = useState({});
  const [revenueByProduct, setRevenueByProduct] = useState({});
  const [grossProfit, setGrossProfit] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("All Products");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [safeView, setView] = useState("POS");
  const [trendRange, setTrendRange] = useState("day");

  const [staffAlerts, setStaffAlerts] = useState([]);
  const [restockQty, setRestockQty] = useState({});

  const [supplierDeliveries, setSupplierDeliveries] = useState([]);

  const [deliveryForm, setDeliveryForm] = useState({
    supplier: "",
    item: "",
    qty: "",
    cost: "",
  });

  const loyaltyStats = {
    activeMembers: 124,
    pointsRedeemed: 3820,
    newMembersThisMonth: 18,
  };

  const feedbackEntries = [
    { rating: 5, tags: ["taste", "service"] },
    { rating: 4, tags: ["price", "service"] },
    { rating: 5, tags: ["ambience", "taste"] },
    { rating: 3, tags: ["waiting-time"] },
    { rating: 4, tags: ["taste", "price"] },
  ];

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((p) => p.category));
    return Array.from(uniqueCategories);
  }, []);

  const isOwner = userRole === "owner";
  const isAdmin = userRole === "admin";
  const isStaff = userRole === "staff";

  const toastError = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 2500);
  };

  const recalcStatsFromOrders = (orderList) => {
    const sold = {};
    const revenue = {};
    let gp = 0;

    for (const o of orderList) {
      sold[o.productId] = (sold[o.productId] || 0) + 1;
      revenue[o.productId] = (revenue[o.productId] || 0) + (o.revenue || 0);
      gp += (o.revenue || 0) - (o.cogs || 0);
    }

    setSoldCounts(sold);
    setRevenueByProduct(revenue);
    setGrossProfit(gp);
  };

  const refreshProtectedData = async (roleArg) => {
    const role = roleArg || userRole;

    const invRes = await apiFetch("/api/inventory");
    const inv = invRes?.inventory || invRes || {};
    setInventory(inv);

    if (role === "owner" || role === "admin") {
      const ordRes = await apiFetch("/api/orders");
      const rawOrders = ordRes?.orders || ordRes || [];
      const mappedOrders = rawOrders.map((o) => ({
        createdAt: o.createdAt,
        productId: o.productId,
        productName: o.productName,
        size: o.size,
        revenue: o.revenue || 0,
        cogs: o.cogs || 0,
      }));
      setOrders(mappedOrders);
      recalcStatsFromOrders(mappedOrders);

      const alertsRes = await apiFetch("/api/alerts");
      const rawAlerts = alertsRes?.alerts || alertsRes || [];
      setStaffAlerts(
        rawAlerts.map((a) => ({
          id: a._id || a.id,
          materialKey: a.materialKey,
          message: a.message,
          severity: a.severity,
          createdAt: a.createdAt,
        }))
      );

      try {
        const deliveriesRes = await apiFetch("/api/supplier-deliveries");
        const rawDeliveries = deliveriesRes?.deliveries || deliveriesRes || [];
        setSupplierDeliveries(
          rawDeliveries.map((d) => ({
            id: d._id || d.id,
            createdAt: d.createdAt,
            supplier: d.supplier,
            item: d.item,
            qty: d.qty,
            cost: d.cost,
          }))
        );
      } catch {
        // optional
      }
    }
  };

  useEffect(() => {
    const token = getSavedToken();
    const savedUser = localStorage.getItem(USER_KEY);
    if (!token || !savedUser) return;

    try {
      const user = JSON.parse(savedUser);
      const role = user?.role || "staff";
      setUserRole(role);
      setIsAuthenticated(true);
      setView(role === "owner" ? "DASHBOARD" : role === "admin" ? "STOCK" : "POS");

      refreshProtectedData(role).catch(() => {
        clearSession();
        setIsAuthenticated(false);
        setUserRole("staff");
        setView("POS");
      });
    } catch {
      clearSession();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const role = data?.user?.role || "staff";
      saveSession(data.token, data.user);
      setUserRole(role);
      setIsAuthenticated(true);
      setView(role === "owner" ? "DASHBOARD" : role === "admin" ? "STOCK" : "POS");

      await refreshProtectedData(role);
    } catch (err) {
      setLoginError(err.message || "Invalid username or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoginError(null);
  
    try {
      const fd = new FormData(e.currentTarget);
      const usernameVal = String(fd.get("username") || "").trim();
      const emailVal = String(fd.get("email") || "").trim();
      const passwordVal = String(fd.get("password") || "").trim();
  
      if (!usernameVal || !emailVal || !passwordVal) {
        throw new Error("Please complete username, email, and password.");
      }
  
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: usernameVal,
          email: emailVal,
          password: passwordVal,
          role: "staff",
        }),
      });
  
      saveSession(data.token, data.user);
      setUserRole(data.user?.role || "staff");
      setIsRegistering(false);
      setIsAuthenticated(true);
      setView("POS");
      await refreshProtectedData(data.user?.role || "staff");
    } catch (err) {
      setLoginError(err.message || "Registration failed.");
    }
  };

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setUserRole("staff");
    setLoginError(null);
    setView("POS");
  };

  const handleSendAlert = async (materialKey) => {
    const currentStock = inventory[materialKey];
    const health = getHealthBadge(materialKey, currentStock);
    if (health.label === "Green") return;

    const materialLabel =
      MATERIALS_TABLE.find((m) => m.key === materialKey)?.label || materialKey;
    const alertText = `Staff Alert: ${materialLabel} is ${health.label.toLowerCase()} (${currentStock} remaining).`;

    if (staffAlerts.some((a) => a.materialKey === materialKey)) return;

    try {
      const res = await apiFetch("/api/alerts", {
        method: "POST",
        body: JSON.stringify({
          materialKey,
          message: alertText,
          severity: health.label,
        }),
      });

      const a = res?.alert;
      if (a) {
        setStaffAlerts((prev) => [
          ...prev,
          {
            id: a._id || a.id,
            materialKey: a.materialKey,
            message: a.message,
            severity: a.severity,
            createdAt: a.createdAt,
          },
        ]);
      }
    } catch (err) {
      toastError(err.message || "Failed to send alert.");
    }
  };

  const handleClearAlert = async (id) => {
    try {
      await apiFetch(`/api/alerts/${id}/clear`, { method: "PATCH" });
      setStaffAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (err) {
      toastError(err.message || "Failed to clear alert.");
    }
  };

  const handleRestock = async (materialKey) => {
    if (!(isAdmin || isOwner)) return;

    const qty = Number(restockQty[materialKey] || 0);
    if (!Number.isFinite(qty) || qty <= 0) {
      toastError("Enter a valid restock quantity.");
      return;
    }

    try {
      const res = await apiFetch("/api/inventory/restock", {
        method: "PATCH",
        body: JSON.stringify({ materialKey, qty }),
      });

      const nextInv = res?.inventory || {};
      setInventory((prev) => ({ ...prev, ...nextInv }));
      setStaffAlerts((prev) => prev.filter((a) => a.materialKey !== materialKey));
      setRestockQty((prev) => ({ ...prev, [materialKey]: "" }));

      setAlertMessage(`Restocked ${qty} of ${materialKey}.`);
      setTimeout(() => setAlertMessage(null), 2000);
    } catch (err) {
      toastError(err.message || "Restock failed.");
    }
  };

  const handleAddDelivery = async (e) => {
    e.preventDefault();

    const qty = Number(deliveryForm.qty);
    const cost = Number(deliveryForm.cost);

    if (!deliveryForm.supplier || !deliveryForm.item || qty <= 0 || cost <= 0) {
      toastError("Please complete supplier, item, qty, and cost.");
      return;
    }

    try {
      const res = await apiFetch("/api/supplier-deliveries", {
        method: "POST",
        body: JSON.stringify({
          supplier: deliveryForm.supplier,
          item: deliveryForm.item,
          qty,
          cost,
        }),
      });

      const d = res?.delivery;
      if (d) {
        setSupplierDeliveries((prev) => [
          {
            id: d._id || d.id,
            createdAt: d.createdAt,
            supplier: d.supplier,
            item: d.item,
            qty: d.qty,
            cost: d.cost,
          },
          ...prev,
        ]);
      }

      setDeliveryForm({ supplier: "", item: "", qty: "", cost: "" });
      setAlertMessage("Supplier delivery recorded.");
      setTimeout(() => setAlertMessage(null), 1800);
    } catch (err) {
      toastError(err.message || "Failed to add delivery.");
    }
  };

  const totalProductsCount = products.length;
  const allProductsCount = products.filter((p) => p.category !== "Add-Ons").length;

  const totalOrdersToday = useMemo(() => {
    const today = toLocalYMD(new Date());
    return orders.filter((o) => toLocalYMD(o.createdAt) === today).length;
  }, [orders]);

  const totalSalesToday = useMemo(() => {
    const today = toLocalYMD(new Date());
    return orders
      .filter((o) => toLocalYMD(o.createdAt) === today)
      .reduce((sum, o) => sum + o.revenue, 0);
  }, [orders]);

  const ordersAllTimeRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.revenue, 0),
    [orders]
  );

  const computeNeeded = (product, sizeKey) => {
    const isAddon = product.category === "Add-Ons";
    const mult = getSizeMultiplier(sizeKey, isAddon);
    const base = RECIPES[product.id];
    if (!base) return null;

    const needed = {};
    for (const [k, v] of Object.entries(base)) {
      const invKey = invKeyFor(k);
      if (!invKey) continue;
      needed[invKey] = (needed[invKey] || 0) + v * mult;
    }

    if (!isAddon) {
      needed.lids = 1;
      needed.straws = 1;
      if (sizeKey === "12oz") needed.cups12oz = 1;
      if (sizeKey === "16oz") needed.cups16oz = 1;
      if (sizeKey === "22oz") needed.cups22oz = 1;
    }

    return needed;
  };

  const computeCogs = (needed) => {
    let total = 0;
    for (const [k, amt] of Object.entries(needed)) {
      const costPerUnit = UNIT_COST[k] || 0;
      total += amt * costPerUnit;
    }
    return total;
  };

  const getStockForProductSize = (product, sizeKey) => {
    const needed = computeNeeded(product, sizeKey);
    if (!needed) return 0;

    let min = Infinity;
    for (const [k, amt] of Object.entries(needed)) {
      if (!amt || amt <= 0) continue;
      const onHand = inventory[k] ?? 0;
      min = Math.min(min, Math.floor(onHand / amt));
    }

    if (min === Infinity) min = 0;
    return Math.max(0, min);
  };

  const getDisplayedStock = (product) => {
    if (product.category === "Add-Ons") {
      const sizeKey = Object.keys(product.prices || {})[0];
      return getStockForProductSize(product, sizeKey);
    }

    const sizeKeys = Object.keys(product.prices || {}).filter((k) =>
      ["12oz", "16oz", "22oz"].includes(k)
    );
    if (!sizeKeys.length) return 0;
    return Math.min(...sizeKeys.map((s) => getStockForProductSize(product, s)));
  };

  const handlePurchase = async (product, sizeKey) => {
    const needed = computeNeeded(product, sizeKey);
    if (!needed) return;

    const revenue = Number(product.prices?.[sizeKey] || 0);
    const cogs = computeCogs(needed);

    try {
      const res = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          size: sizeKey,
          revenue,
          cogs,
          needed,
        }),
      });

      if (res?.inventory) {
        setInventory((prev) => ({ ...prev, ...res.inventory }));
      }

      const o = res?.order;
      if (o) {
        const nextOrders = [
          ...orders,
          {
            createdAt: o.createdAt,
            productId: o.productId,
            productName: o.productName,
            size: o.size,
            revenue: o.revenue || 0,
            cogs: o.cogs || 0,
          },
        ];
        setOrders(nextOrders);
        recalcStatsFromOrders(nextOrders);
      }

      setAlertMessage(`Success: ${product.name} (${sizeKey}) added!`);
      setTimeout(() => setAlertMessage(null), 2000);
      setSelectedProduct(null);
    } catch (err) {
      toastError(err.message || "Failed to create order.");
    }
  };

  const topSellingProducts = useMemo(() => {
    return Object.keys(soldCounts)
      .map((pid) => {
        const p = products.find((x) => x.id === Number(pid));
        return {
          productId: Number(pid),
          name: p?.name || `Product ${pid}`,
          units: soldCounts[pid] || 0,
          revenue: revenueByProduct[pid] || 0,
        };
      })
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);
  }, [soldCounts, revenueByProduct]);

  const maxTopUnits = Math.max(0, ...topSellingProducts.map((p) => p.units));

  const salesTrendData = useMemo(() => {
    const now = new Date();

    const bucketKey = (oDate) => {
      if (trendRange === "day") return toLocalYMD(oDate);
      if (trendRange === "week") return toLocalYMD(startOfWeekMonday(oDate));
      if (trendRange === "month") return toLocalYM(oDate);
      return String(new Date(oDate).getFullYear());
    };

    const sumByBucket = {};
    for (const o of orders) {
      const k = bucketKey(o.createdAt);
      sumByBucket[k] = (sumByBucket[k] || 0) + (o.revenue || 0);
    }

    const buckets = [];
    if (trendRange === "day") {
      for (let i = 6; i >= 0; i--) buckets.push(toLocalYMD(addDays(now, -i)));
    } else if (trendRange === "week") {
      for (let i = 7; i >= 0; i--) {
        const d = addDays(now, -i * 7);
        buckets.push(toLocalYMD(startOfWeekMonday(d)));
      }
    } else if (trendRange === "month") {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        buckets.push(toLocalYM(d));
      }
    } else {
      for (let i = 4; i >= 0; i--) buckets.push(String(now.getFullYear() - i));
    }

    return buckets.map((k) => ({
      label: labelFromBucket(k, trendRange),
      sales: sumByBucket[k] || 0,
    }));
  }, [orders, trendRange]);

  const expenseTrendData = useMemo(() => {
    const now = new Date();

    const bucketKey = (oDate) => {
      if (trendRange === "day") return toLocalYMD(oDate);
      if (trendRange === "week") return toLocalYMD(startOfWeekMonday(oDate));
      if (trendRange === "month") return toLocalYM(oDate);
      return String(new Date(oDate).getFullYear());
    };

    const sumByBucket = {};
    for (const d of supplierDeliveries) {
      const k = bucketKey(d.createdAt);
      sumByBucket[k] = (sumByBucket[k] || 0) + (d.cost || 0);
    }

    const buckets = [];
    if (trendRange === "day") {
      for (let i = 6; i >= 0; i--) buckets.push(toLocalYMD(addDays(now, -i)));
    } else if (trendRange === "week") {
      for (let i = 7; i >= 0; i--) {
        const d = addDays(now, -i * 7);
        buckets.push(toLocalYMD(startOfWeekMonday(d)));
      }
    } else if (trendRange === "month") {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        buckets.push(toLocalYM(d));
      }
    } else {
      for (let i = 4; i >= 0; i--) buckets.push(String(now.getFullYear() - i));
    }

    return buckets.map((k) => ({
      label: labelFromBucket(k, trendRange),
      expenses: sumByBucket[k] || 0,
    }));
  }, [supplierDeliveries, trendRange]);

  const salesVsExpenseData = useMemo(() => {
    return salesTrendData.map((s, i) => {
      const expenses = expenseTrendData[i]?.expenses || 0;
      return {
        label: s.label,
        sales: s.sales,
        expenses,
        net: s.sales - expenses,
      };
    });
  }, [salesTrendData, expenseTrendData]);

  const totalSupplierExpense = useMemo(
    () => supplierDeliveries.reduce((sum, d) => sum + (d.cost || 0), 0),
    [supplierDeliveries]
  );

  const totalCogsAllTime = useMemo(
    () => orders.reduce((sum, o) => sum + (o.cogs || 0), 0),
    [orders]
  );

  const netProfitAfterExpenses = useMemo(
    () => ordersAllTimeRevenue - totalSupplierExpense,
    [ordersAllTimeRevenue, totalSupplierExpense]
  );

  const grossMarginPercent = useMemo(() => {
    if (!ordersAllTimeRevenue) return 0;
    return ((ordersAllTimeRevenue - totalCogsAllTime) / ordersAllTimeRevenue) * 100;
  }, [ordersAllTimeRevenue, totalCogsAllTime]);

  const hourlyHeatmapData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, orders: 0 }));
    for (const o of orders) {
      const h = new Date(o.createdAt).getHours();
      hours[h].orders += 1;
    }
    return hours;
  }, [orders]);

  const peakHourMax = Math.max(1, ...hourlyHeatmapData.map((h) => h.orders));

  const rankedDrinks = useMemo(() => {
    return Object.keys(soldCounts)
      .map((pid) => {
        const p = products.find((x) => x.id === Number(pid));
        return {
          name: p?.name || `Product ${pid}`,
          units: soldCounts[pid] || 0,
          category: p?.category,
        };
      })
      .filter((x) => x.category && x.category !== "Add-Ons")
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);
  }, [soldCounts]);

  const rankedAddOns = useMemo(() => {
    return Object.keys(soldCounts)
      .map((pid) => {
        const p = products.find((x) => x.id === Number(pid));
        return {
          name: p?.name || `Product ${pid}`,
          units: soldCounts[pid] || 0,
          category: p?.category,
        };
      })
      .filter((x) => x.category === "Add-Ons")
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);
  }, [soldCounts]);

  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      buckets.push(toLocalYM(d));
    }

    const salesByMonth = {};
    for (const o of orders) {
      const k = toLocalYM(o.createdAt);
      salesByMonth[k] = (salesByMonth[k] || 0) + (o.revenue || 0);
    }

    return buckets.map((m) => ({ month: m, sales: salesByMonth[m] || 0 }));
  }, [orders]);

  const avgFeedbackRating = useMemo(() => {
    if (!feedbackEntries.length) return 0;
    return feedbackEntries.reduce((sum, f) => sum + f.rating, 0) / feedbackEntries.length;
  }, [feedbackEntries]);

  const commonSuggestions = useMemo(() => {
    const freq = {};
    for (const f of feedbackEntries) {
      for (const tag of f.tags) freq[tag] = (freq[tag] || 0) + 1;
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [feedbackEntries]);

  const downloadStockCSV = () => {
    const headers = ["Material Name", "Current Quantity", "Health Status"];
    const rows = MATERIALS_TABLE.map((m) => {
      const value = inventory[m.key];
      const badge = getHealthBadge(m.key, value);
      return [m.label, value, badge.label];
    });
    downloadCSV("ohana_stock_report.csv", headers, rows);
  };

  const downloadSalesCSV = () => {
    if (!isOwner) return;
    const headers = ["Product Name", "Units Sold", "Total Revenue"];
    const rows = Object.keys(soldCounts)
      .map((pid) => {
        const p = products.find((x) => x.id === Number(pid));
        return [p?.name || `Product ${pid}`, soldCounts[pid] || 0, revenueByProduct[pid] || 0];
      })
      .filter((r) => (r[1] || 0) > 0);

    downloadCSV("ohana_sales_report_owner_only.csv", headers, rows);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        {alertMessage && (
          <div
            className={`fixed top-10 z-[60] px-6 py-4 rounded-xl shadow-lg border-l-4 animate-bounce ${
              String(alertMessage).toLowerCase().includes("success")
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-red-50 border-red-500 text-red-700"
            }`}
          >
            {alertMessage}
          </div>
        )}

        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="bg-amber-900 p-8 text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-amber-100 rounded-full absolute -top-8 -left-8 opacity-10" />
            <div className="w-24 h-24 bg-amber-100 rounded-full absolute -bottom-10 -right-10 opacity-10" />
            <h1 className="text-2xl font-bold text-white relative z-10">Ohana Cafe System</h1>
            <p className="text-amber-200 text-sm relative z-10">POS + Inventory + Owner Analytics</p>
          </div>

          <div className="p-8">
            {isRegistering ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <h2 className="text-xl font-bold text-amber-900 text-center mb-2">Create Account</h2>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-stone-400" size={18} />
                    <input
                      name="username"
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="Choose username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-stone-400" size={18} />
                    <input
                      name="email"
                      type="email"
                      className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-stone-400" size={18} />
                    <input
                      name="password"
                      type="password"
                      className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="Create password"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg border border-red-200">
                    {loginError}
                  </p>
                )}

                <button className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-lg transition shadow-md">
                  Sign Up
                </button>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-stone-400" size={18} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="owner / admin / staff"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-stone-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="1234"
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg border border-red-200">
                    {loginError}
                  </p>
                )}

                <button className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-lg transition shadow-md active:scale-[0.98]">
                  Secure Login
                </button>

                <div className="mt-4 text-center border-t border-stone-100 pt-4 text-sm text-stone-500">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {!isRegistering && (
              <div className="mt-6 text-center text-xs text-stone-400 space-y-1 bg-stone-50 p-3 rounded-lg">
                <p>
                  <strong>Owner:</strong> owner / 1234
                </p>
                <p>
                  <strong>Admin:</strong> admin / 1234
                </p>
                <p>
                  <strong>Staff:</strong> staff / 1234
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderSizeModal = () => {
    if (!selectedProduct) return null;
    const product = selectedProduct;
    const sizes = Object.entries(product.prices || {});

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
          <div className="h-32 relative">
            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white p-1 rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-3 left-4 text-white">
              <h3 className="text-2xl font-bold leading-none">{product.name}</h3>
              <p className="text-white/80 text-sm mt-1">{product.category}</p>
            </div>
          </div>

          <div className="p-6">
            <p className="text-stone-500 text-sm mb-4 font-medium">Select a size to add:</p>
            <div className="space-y-3">
              {sizes.map(([sizeKey, price]) => {
                const stockForThis = getStockForProductSize(product, sizeKey);
                const disabled = stockForThis <= 0;
                return (
                  <button
                    key={sizeKey}
                    onClick={() => handlePurchase(product, sizeKey)}
                    disabled={disabled}
                    className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all ${
                      disabled
                        ? "bg-stone-100 text-stone-400 cursor-not-allowed border-stone-200"
                        : "border-stone-200 hover:border-amber-600 hover:bg-amber-50 active:scale-[0.98]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center text-xs font-bold">
                        {String(sizeKey).charAt(0)}
                      </div>
                      <span className="font-bold text-stone-700 text-lg">{sizeKey}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {disabled ? (
                        <span className="text-xs font-bold text-red-600">OUT</span>
                      ) : (
                        <span className="text-xs font-bold text-green-600">~{stockForThis} left</span>
                      )}
                      <span className="font-bold text-amber-700 text-lg">₱{Number(price).toFixed(2)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const dashboardCards = (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-stone-500 text-sm font-medium">Categories List</p>
            <div className="text-2xl font-extrabold text-stone-800 mt-2">{categories.length}</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <Package className="text-amber-700" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-stone-500 text-sm font-medium">Product List</p>
            <div className="text-2xl font-extrabold text-stone-800 mt-2">{totalProductsCount}</div>
            <div className="text-xs text-stone-500 mt-1">
              {allProductsCount} drink items + {totalProductsCount - allProductsCount} add-ons
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Coffee className="text-blue-700" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-stone-500 text-sm font-medium">Total Orders Today</p>
            <div className="text-2xl font-extrabold text-stone-800 mt-2">{totalOrdersToday}</div>
            <div className="text-xs text-stone-500 mt-1">From POS</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <ShoppingCart className="text-emerald-700" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-stone-500 text-sm font-medium">Total Sales Today</p>
            <div className="text-2xl font-extrabold text-stone-800 mt-2">
              ₱{totalSalesToday.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500 mt-1">Gross income (simulated)</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <DollarIcon />
          </div>
        </div>
      </div>
    </div>
  );

  function DollarIcon() {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="rgb(217 119 6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-800">
      {alertMessage && (
        <div
          className={`fixed top-24 right-6 z-[60] px-6 py-4 rounded-xl shadow-lg border-l-4 animate-bounce ${
            String(alertMessage).toLowerCase().includes("out") ||
            String(alertMessage).toLowerCase().includes("not enough") ||
            String(alertMessage).toLowerCase().includes("not low")
              ? "bg-red-50 border-red-500 text-red-700"
              : "bg-green-50 border-green-500 text-green-700"
          }`}
        >
          <div className="font-bold flex items-center gap-2">
            {String(alertMessage).toLowerCase().includes("out") ||
            String(alertMessage).toLowerCase().includes("not enough") ||
            String(alertMessage).toLowerCase().includes("not low") ? (
              <AlertTriangle size={20} />
            ) : (
              <ShoppingCart size={20} />
            )}
            {alertMessage}
          </div>
        </div>
      )}

      {renderSizeModal()}

      <div className="flex">
        <aside className="w-72 bg-white border-r border-stone-200 min-h-screen p-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-900">
              <Coffee size={20} />
            </div>
            <div>
              <div className="font-extrabold text-lg text-amber-900 leading-tight">Ohana Cafe</div>
              <div className="text-xs text-stone-500">POS + Inventory</div>
              <div className="text-xs mt-2 space-y-1">
                {isOwner && (
                  <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-200">
                    <Shield size={12} /> Owner
                  </div>
                )}
                {isAdmin && (
                  <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-200">
                    <Shield size={12} /> Admin
                  </div>
                )}
                {isStaff && (
                  <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
                    <UserCircle size={12} /> Staff
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setView("POS")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition ${
                safeView === "POS" ? "bg-amber-100 text-amber-900" : "hover:bg-stone-50 text-stone-700"
              }`}
            >
              <ShoppingCart size={16} /> POS
            </button>

            {(isOwner || isAdmin) && (
              <button
                onClick={() => setView("STOCK")}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition ${
                  safeView === "STOCK" ? "bg-amber-100 text-amber-900" : "hover:bg-stone-50 text-stone-700"
                }`}
              >
                <Package size={16} /> Stock List
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setView("DASHBOARD")}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition ${
                  safeView === "DASHBOARD" ? "bg-amber-100 text-amber-900" : "hover:bg-stone-50 text-stone-700"
                }`}
              >
                <BarChart3 size={16} /> Dashboard
              </button>
            )}
          </nav>

          <div className="mt-6 pt-4 border-t border-stone-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition font-bold text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          {safeView === "POS" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {["All Products", ...categories].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                        activeTab === tab
                          ? "bg-amber-900 text-white shadow-md scale-105"
                          : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeTab === "All Products"
                    ? products.filter((p) => p.category !== "Add-Ons")
                    : products.filter((p) => p.category === activeTab)
                  ).map((product) => {
                    const liveStock = getDisplayedStock(product);
                    const isLowStock = liveStock < 10;
                    const prices = Object.values(product.prices);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    const neededMaterials = computeNeeded(product, Object.keys(product.prices)[0]);

                    return (
                      <div
                        key={product.id}
                        className={`bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition-all ${
                          isLowStock && liveStock > 0 ? "border-red-300 shadow-red-100" : "border-stone-200"
                        }`}
                      >
                        <div className="h-40 bg-stone-100 relative group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {product.matchScore > 0 && (
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-green-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                              {product.matchScore}% Match
                            </div>
                          )}
                          {liveStock <= 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                              OUT OF STOCK
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-lg text-stone-800 leading-tight">{product.name}</h3>
                            <div className="text-right">
                              <span className="block font-bold text-amber-900">₱{minPrice}</span>
                              {minPrice !== maxPrice && (
                                <span className="text-xs text-stone-400 font-normal">to ₱{maxPrice}</span>
                              )}
                            </div>
                          </div>

                          <p className="text-stone-500 text-sm mb-3">{product.desc}</p>

                          <div className="flex justify-between items-center text-xs border-t border-stone-100 pt-3 mb-3">
                            <span
                              className={`flex items-center gap-1 font-bold ${
                                isLowStock ? "text-red-600" : "text-green-600"
                              }`}
                            >
                              <Package size={12} /> {liveStock > 0 ? `Stock: ~${liveStock}` : "Restock Needed"}
                            </span>
                            {isOwner && (
                              <span className="text-amber-700 font-medium">{soldCounts[product.id] || 0} sold</span>
                            )}
                          </div>

                          <button
                            onClick={() => setSelectedProduct(product)}
                            disabled={liveStock <= 0}
                            className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                              liveStock <= 0
                                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                : "bg-amber-900 hover:bg-amber-800 text-white shadow-md hover:shadow-lg"
                            }`}
                          >
                            <ShoppingCart size={16} /> {liveStock <= 0 ? "Unavailable" : "Add to Order"}
                          </button>

                          {isStaff && isLowStock && (
                            <button
                              onClick={() => {
                                if (!neededMaterials) return;

                                const lowMaterials = Object.keys(neededMaterials).filter(
                                  (materialKey) => getHealthBadge(materialKey, inventory[materialKey]).label !== "Green"
                                );

                                if (!lowMaterials.length) {
                                  toastError("No low-stock material to alert.");
                                  return;
                                }

                                lowMaterials.forEach((materialKey) => handleSendAlert(materialKey));
                                setAlertMessage("Low-stock alert(s) sent to admin.");
                                setTimeout(() => setAlertMessage(null), 2000);
                              }}
                              className="w-full mt-2 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              <BellRing size={16} /> Send Low Stock Alert
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-6">
                  <div className="bg-stone-900 text-white p-6 rounded-xl shadow-xl">
                    <h2 className="text-lg font-bold mb-1">Live Inventory</h2>
                    <p className="text-stone-400 text-xs mb-4">Updates after each sale</p>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-sm">Total Cups</span>
                        <span className="font-bold text-xl">
                          {inventory.cups12oz + inventory.cups16oz + inventory.cups22oz}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-sm">Coffee Beans</span>
                        <span className="font-bold text-xl">{inventory.coffeeBeans}g</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-sm">Milk Stock</span>
                        <span className="font-bold text-xl">{inventory.milk}ml</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-sm">Sugar Syrup</span>
                        <span className="font-bold text-xl">{inventory.sugarSyrup}ml</span>
                      </div>
                    </div>

                    {(isOwner || isAdmin) && (
                      <button
                        onClick={() => setView("STOCK")}
                        className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg text-sm font-bold transition shadow-lg"
                      >
                        Open Stock List
                      </button>
                    )}
                  </div>

                  {isOwner && (
                    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                      <h3 className="font-bold text-stone-800 mb-2 text-sm">Owner Analytics</h3>
                      <p className="text-stone-500 text-xs">Dashboard includes Sales Analytics + CSV Export.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {safeView === "STOCK" && (isOwner || isAdmin) && (
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800">Stock List</h2>
                  <p className="text-stone-500 text-sm">All raw materials with health alerts</p>
                </div>

                <button
                  onClick={downloadStockCSV}
                  className="bg-amber-900 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg text-sm transition shadow inline-flex items-center gap-2"
                >
                  <Download size={16} /> Download Stock Report (.csv)
                </button>
              </div>

              {staffAlerts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl shadow-sm p-5 mb-6">
                  <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    <BellRing size={20} /> Staff Low Stock Alerts
                  </h3>

                  <div className="space-y-3">
                    {staffAlerts.map((alert) => {
                      const material = MATERIALS_TABLE.find((m) => m.key === alert.materialKey);
                      const currentStock = inventory[alert.materialKey] ?? 0;

                      return (
                        <div key={alert.id} className="bg-red-100 p-3 rounded-lg border border-red-300 space-y-2">
                          <p className="text-red-700 text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-red-800">
                            Current stock: <strong>{currentStock}</strong>
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            {(isAdmin || isOwner) && (
                              <>
                                <input
                                  type="number"
                                  min="1"
                                  placeholder={`Restock ${material?.label || alert.materialKey}`}
                                  value={restockQty[alert.materialKey] ?? ""}
                                  onChange={(e) =>
                                    setRestockQty((prev) => ({
                                      ...prev,
                                      [alert.materialKey]: e.target.value,
                                    }))
                                  }
                                  className="w-44 px-3 py-2 rounded-lg border border-red-300 text-sm"
                                />
                                <button
                                  onClick={() => handleRestock(alert.materialKey)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold"
                                >
                                  Restock
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleClearAlert(alert.id)}
                              className="bg-red-200 hover:bg-red-300 text-red-800 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <CheckCircle size={12} /> Clear
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-100">
                  <h3 className="font-bold text-stone-800">Inventory Table</h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MATERIALS_TABLE.map((m) => {
                      const value = inventory[m.key];
                      const badge = getHealthBadge(m.key, value);

                      return (
                        <div key={m.key} className="p-4 rounded-xl border border-stone-200 bg-white shadow-sm">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-bold text-stone-800">{m.label}</div>
                              <div className="text-2xl font-extrabold text-amber-900 mt-1">
                                {value.toLocaleString()}
                              </div>
                            </div>

                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          </div>

                          {(isAdmin || isOwner) && (
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                placeholder="Qty"
                                value={restockQty[m.key] ?? ""}
                                onChange={(e) =>
                                  setRestockQty((prev) => ({ ...prev, [m.key]: e.target.value }))
                                }
                                className="w-24 px-2 py-1 rounded border border-stone-300 text-xs"
                              />
                              <button
                                onClick={() => handleRestock(m.key)}
                                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                              >
                                Restock
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {safeView === "DASHBOARD" && isOwner && (
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800">Dashboard</h2>
                  <p className="text-stone-500 text-sm">Sales Analytics + Top Selling Products + Gross Profit</p>
                </div>

                <button
                  onClick={downloadSalesCSV}
                  className="bg-amber-900 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg text-sm transition shadow inline-flex items-center gap-2"
                >
                  <Download size={16} /> Download Sales Report (.csv)
                </button>
              </div>

              {dashboardCards}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                  <div className="flex justify-between items-end mb-4 gap-3 flex-wrap">
                    <div>
                      <h3 className="font-bold text-stone-800">Sales Analytics (Income Trend)</h3>
                      <p className="text-stone-500 text-sm">Aggregated by selected range</p>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg">
                      <Calendar size={14} className="text-amber-600" />
                      <span className="text-xs font-bold text-stone-600">Range</span>
                      <select
                        value={trendRange}
                        onChange={(e) => setTrendRange(e.target.value)}
                        className="bg-stone-50 text-stone-700 text-xs font-bold outline-none"
                      >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesTrendData}>
                        <defs>
                          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#b45309" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#b45309" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `₱${Math.floor(v / 1000)}k`}
                        />
                        <Tooltip formatter={(value) => [`₱${Number(value).toLocaleString()}`, "Income"]} />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          name="Income"
                          stroke="#b45309"
                          strokeWidth={3}
                          fill="url(#salesGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                  <h3 className="font-bold text-stone-800 mb-3">Top-Selling Products</h3>
                  {topSellingProducts.length === 0 ? (
                    <div className="text-stone-500 text-sm">No sales yet. Start selling on POS.</div>
                  ) : (
                    <div className="space-y-4">
                      {topSellingProducts.map((p) => {
                        const pct = maxTopUnits > 0 ? (p.units / maxTopUnits) * 100 : 0;
                        return (
                          <div key={p.productId}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-bold text-stone-800 text-sm">{p.name}</div>
                              <div className="text-xs font-bold text-amber-700">{p.units} units</div>
                            </div>
                            <div className="h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                              <div className="h-full bg-amber-600 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="text-xs text-stone-500 mt-1">
                              Revenue: ₱{p.revenue.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <h3 className="font-bold text-stone-800 mb-3">Gross Profit (Estimated)</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <div className="text-xs text-amber-700 font-bold">Total Sales (All Time)</div>
                    <div className="text-xl font-extrabold text-amber-900 mt-1">
                      ₱{ordersAllTimeRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                    <div className="text-xs text-emerald-700 font-bold">Estimated Gross Profit</div>
                    <div className="text-xl font-extrabold text-emerald-900 mt-1">
                      ₱{Math.max(0, Math.floor(grossProfit)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                  <h3 className="font-bold text-stone-800 mb-1">Sales vs Expenses vs Net</h3>
                  <p className="text-stone-500 text-sm mb-4">Filtered by selected range</p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesVsExpenseData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip formatter={(v) => `₱${Number(v).toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="sales" fill="#b45309" name="Sales" />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                        <Bar dataKey="net" fill="#10b981" name="Net Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                  <h3 className="font-bold text-stone-800 mb-3">Profit Snapshot</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Total Supplier Expense</span>
                      <strong>₱{totalSupplierExpense.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total COGS (auto)</span>
                      <strong>₱{Math.floor(totalCogsAllTime).toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Gross Margin</span>
                      <strong>{grossMarginPercent.toFixed(1)}%</strong>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>Net Profit (Sales - Supplier Cost)</span>
                      <strong>₱{Math.floor(netProfitAfterExpenses).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 mt-6">
                <h3 className="font-bold text-stone-800 mb-1">Peak Hours Heatmap</h3>
                <p className="text-stone-500 text-sm mb-4">Orders per hour (00:00 - 23:00)</p>
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                  {hourlyHeatmapData.map((h) => {
                    const intensity = h.orders / peakHourMax;
                    const opacity = 0.15 + intensity * 0.85;
                    return (
                      <div
                        key={h.hour}
                        className="rounded-lg p-2 text-center border border-stone-200"
                        style={{ backgroundColor: `rgba(180, 83, 9, ${opacity})` }}
                      >
                        <div className="text-[10px] font-bold text-white">
                          {String(h.hour).padStart(2, "0")}:00
                        </div>
                        <div className="text-xs font-extrabold text-white">{h.orders}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                  <h3 className="font-bold text-stone-800 mb-3">Top Drinks</h3>
                  {rankedDrinks.length ? (
                    rankedDrinks.map((x, i) => (
                      <div key={x.name} className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0">
                        <span>{i + 1}. {x.name}</span>
                        <strong>{x.units}</strong>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-500 text-sm">No drink sales yet.</p>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                  <h3 className="font-bold text-stone-800 mb-3">Top Add-Ons</h3>
                  {rankedAddOns.length ? (
                    rankedAddOns.map((x, i) => (
                      <div key={x.name} className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0">
                        <span>{i + 1}. {x.name}</span>
                        <strong>{x.units}</strong>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-500 text-sm">No add-on sales yet.</p>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                  <h3 className="font-bold text-stone-800 mb-3">Seasonal Trend (Last 6 Months)</h3>
                  {monthlyTrend.map((m) => (
                    <div key={m.month} className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0">
                      <span>{m.month}</span>
                      <strong>₱{m.sales.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                  <h3 className="font-bold text-stone-800 mb-3">Loyalty Program</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Active Members</span>
                      <strong>{loyaltyStats.activeMembers}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Points Redeemed</span>
                      <strong>{loyaltyStats.pointsRedeemed}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>New This Month</span>
                      <strong>{loyaltyStats.newMembersThisMonth}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 lg:col-span-2">
                  <h3 className="font-bold text-stone-800 mb-3">Feedback Summary</h3>
                  <div className="text-sm mb-3">
                    Average Rating: <strong>{avgFeedbackRating.toFixed(1)} / 5</strong>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonSuggestions.map(([tag, count]) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-200"
                      >
                        {tag} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 mt-6">
                <h3 className="font-bold text-stone-800 mb-3">Supplier Deliveries & Purchase Cost</h3>

                <form onSubmit={handleAddDelivery} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
                  <input
                    className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    placeholder="Supplier"
                    value={deliveryForm.supplier}
                    onChange={(e) => setDeliveryForm((p) => ({ ...p, supplier: e.target.value }))}
                  />
                  <input
                    className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    placeholder="Item"
                    value={deliveryForm.item}
                    onChange={(e) => setDeliveryForm((p) => ({ ...p, item: e.target.value }))}
                  />
                  <input
                    type="number"
                    min="1"
                    className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    placeholder="Qty"
                    value={deliveryForm.qty}
                    onChange={(e) => setDeliveryForm((p) => ({ ...p, qty: e.target.value }))}
                  />
                  <input
                    type="number"
                    min="1"
                    className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
                    placeholder="Cost"
                    value={deliveryForm.cost}
                    onChange={(e) => setDeliveryForm((p) => ({ ...p, cost: e.target.value }))}
                  />
                  <button className="bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-sm font-bold px-3 py-2">
                    Add Delivery
                  </button>
                </form>

                <div className="space-y-2">
                  {supplierDeliveries.map((d) => (
                    <div key={d.id} className="flex justify-between text-sm p-3 rounded-lg border border-stone-200">
                      <span>{d.supplier} • {d.item} ({d.qty})</span>
                      <strong>₱{d.cost.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
