
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
    color: "green", 
  }, 
  ];
// ============================================================
// PULSEMETRICS — CAMPAIGN TABLE FUNCTIONALITY
// Add this BELOW the existing campaignData array.
// ============================================================

const campaignTableState = {
  search: "",
  status: "all",
  page: 1,
  pageSize: 5
};

const campaignNumberFormat = new Intl.NumberFormat("en-US");
const campaignCurrencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function campaignEscape(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderCampaignTable() {
  const tableBody = document.querySelector("#campaignTableBody");
  const tableCount = document.querySelector("#tableCount");
  const pageIndicator = document.querySelector("#pageIndicator");
  const previousButton = document.querySelector("#prevPage");
  const nextButton = document.querySelector("#nextPage");

  if (!tableBody) {
    console.error(
      "PulseMetrics: #campaignTableBody was not found in index.html."
    );
    return;
  }

  const searchTerm = campaignTableState.search.toLowerCase();

  const filteredCampaigns = campaignData.filter(campaign => {
    const matchesSearch = [
      campaign.name,
      campaign.channel,
      campaign.status,
      campaign.id
    ].some(value => String(value).toLowerCase().includes(searchTerm));

    const matchesStatus =
      campaignTableState.status === "all" ||
      campaign.status.toLowerCase() === campaignTableState.status.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / campaignTableState.pageSize)
  );

  campaignTableState.page = Math.min(campaignTableState.page, totalPages);

  const startIndex =
    (campaignTableState.page - 1) * campaignTableState.pageSize;

  const visibleCampaigns = filteredCampaigns.slice(
    startIndex,
    startIndex + campaignTableState.pageSize
  );

  if (filteredCampaigns.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="campaign-empty-state">
          No campaigns match your filters.
          Try another search or select a different status.
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = visibleCampaigns.map(campaign => {
      const statusClass = campaign.status.toLowerCase();

      return `
        <tr>
          <td>
            <div class="campaign-name-cell">
              <span class="campaign-avatar ${campaignEscape(campaign.color)}">
                ${campaignEscape(campaign.avatar)}
              </span>
              <div class="campaign-copy">
                <strong>${campaignEscape(campaign.name)}</strong>
                <small>${campaignEscape(campaign.id)}</small>
              </div>
            </div>
          </td>
          <td>${campaignEscape(campaign.channel)}</td>
          <td>
            <span class="status-pill status-${campaignEscape(statusClass)}">
              ${campaignEscape(campaign.status)}
            </span>
          </td>
          <td>${campaignNumberFormat.format(campaign.visitors)}</td>
          <td>${campaignNumberFormat.format(campaign.conversions)}</td>
          <td>${campaignCurrencyFormat.format(campaign.revenue)}</td>
          <td>
            <button
              type="button"
              class="table-action-button"
              data-campaign-action="view"
              data-campaign-id="${campaignEscape(campaign.id)}"
              aria-label="View ${campaignEscape(campaign.name)}"
            >
              View
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  if (tableCount) {
    tableCount.textContent =
      `${filteredCampaigns.length} campaign${filteredCampaigns.length === 1 ? "" : "s"}`;
  }

  if (pageIndicator) {
    pageIndicator.textContent =
      `Page ${campaignTableState.page} of ${totalPages}`;
  }

  if (previousButton) {
    previousButton.disabled =
      campaignTableState.page <= 1 || filteredCampaigns.length === 0;
  }

  if (nextButton) {
    nextButton.disabled =
      campaignTableState.page >= totalPages || filteredCampaigns.length === 0;
  }
}

// Campaign search
document.querySelector("#tableSearch")?.addEventListener("input", event => {
  campaignTableState.search = event.target.value.trim();
  campaignTableState.page = 1;
  renderCampaignTable();
});

// Status dropdown
document.querySelector("#statusFilter")?.addEventListener("change", event => {
  campaignTableState.status = event.target.value;
  campaignTableState.page = 1;
  renderCampaignTable();
});

// Previous page
document.querySelector("#prevPage")?.addEventListener("click", () => {
  if (campaignTableState.page > 1) {
    campaignTableState.page--;
    renderCampaignTable();
  }
});

// Next page
document.querySelector("#nextPage")?.addEventListener("click", () => {
  campaignTableState.page++;
  renderCampaignTable();
});

// Campaign action buttons
document.querySelector("#campaignTableBody")?.addEventListener("click", event => {
  const button = event.target.closest("[data-campaign-action='view']");

  if (!button) return;

  const campaign = campaignData.find(
    item => item.id === button.dataset.campaignId
  );

  if (!campaign) return;

  alert(
    `Campaign: ${campaign.name}\n` +
    `ID: ${campaign.id}\n` +
    `Channel: ${campaign.channel}\n` +
    `Status: ${campaign.status}\n` +
    `Visitors: ${campaignNumberFormat.format(campaign.visitors)}\n` +
    `Conversions: ${campaignNumberFormat.format(campaign.conversions)}\n` +
    `Demo revenue: ${campaignCurrencyFormat.format(campaign.revenue)}`
  );
});

// Display the campaigns when the page loads.
renderCampaignTable();

console.log(
  `PulseMetrics: ${campaignData.length} demo campaigns loaded.`
);

