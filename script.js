
// ============================================================
// PULSEMETRICS — SAAS ANALYTICS DASHBOARD
// PART 3: FUNCTIONAL JAVASCRIPT
// Fictional portfolio data. No external business data is used.
// ============================================================

"use strict";

// 01. DOM UTILITIES
// ------------------------------------------------------------

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const number = new Intl.NumberFormat("en-US");

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// 02. APPLICATION STATE
// ------------------------------------------------------------

const state = {
  dateRange: 30,
  metric: "revenue",
  campaignSearch: "",
  globalSearch: "",
  status: "all",
  page: 1,
  pageSize: 5,
  currentPage: "overview",
  chartsReady: false,
  notificationsRead: false,
  exportBusy: false,
  loading: true,
  error: null,
  previousFocus: null
};

// 03. FICTIONAL DATASET
// ------------------------------------------------------------

const campaignData = [
  {
    id: "CMP-001",
    name: "Summer Collection",
    channel: "Paid social",
    status: "Active",
    visitors: 28450,
    conversions: 1284,
    revenue: 12480,
    avatar: "S",
    color: "purple"
  },
  {
    id: "CMP-002",
    name: "Organic Growth",
    channel: "Organic search",
    status: "Active",
    visitors: 41280,
    conversions: 1846,
    revenue: 16820,
    avatar: "O",
    color: "green
