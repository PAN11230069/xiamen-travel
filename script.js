// ============================================
// 2026 廈金五天四夜慢旅行 — 互動邏輯
// ============================================

const STORAGE_KEYS = {
  packing: "xm-trip-packing",
  todo: "xm-trip-todo",
  budget: "xm-trip-budget"
};

function amapUrl(place) {
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(place)}&city=厦门`;
}

function pad(n) { return String(n).padStart(2, "0"); }

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ---------- Hero meta / route progress ----------
function renderHero() {
  document.getElementById("trip-title").textContent = tripInfo.title;
  document.getElementById("trip-subtitle").textContent = tripInfo.subtitle;

  const today = todayStr();
  const dayIndex = tripData.findIndex(d => d.date === today);
  const currentDayLabel = dayIndex >= 0 ? `第 ${dayIndex + 1} 天 / 共 ${tripData.length} 天` : "尚未出發";
  const highlight = dayIndex >= 0 ? tripData[dayIndex].title : "—";

  const meta = document.getElementById("hero-meta");
  meta.innerHTML = `
    <div class="meta-item"><div class="meta-label">目前行程</div><div class="meta-value">${currentDayLabel}</div></div>
    <div class="meta-item"><div class="meta-label">今日重點</div><div class="meta-value">${highlight}</div></div>
    <div class="meta-item"><div class="meta-label">集合時間</div><div class="meta-value">${tripInfo.meetingTime}</div></div>
    <div class="meta-item"><div class="meta-label">緊急聯絡人</div><div class="meta-value">${tripInfo.emergencyContact}</div></div>
  `;

  // 潮汐進度點：出發前在金門端，行程中依天數往廈門端移動，結束後回到金門端（返台）
  let progress = 0;
  const start = new Date(tripInfo.startDate);
  const end = new Date(tripInfo.endDate);
  const now = new Date();
  if (now < start) progress = 0;
  else if (now > end) progress = 100;
  else progress = ((now - start) / (end - start)) * 100;
  document.documentElement.style.setProperty("--trip-progress", `${progress}%`);
}

// ---------- 公告 ----------
function renderAnnouncement() {
  const el = document.getElementById("announcement-card");
  el.innerHTML = `<p style="margin:0">${announcement.text}</p><span class="ann-date">更新於 ${announcement.updatedAt}</span>`;
}

// ---------- 倒數 ----------
function diffParts(target) {
  const now = new Date();
  let ms = target - now;
  const past = ms < 0;
  ms = Math.abs(ms);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  return { days, hours, mins, past };
}

function formatCountdown(target) {
  const { days, hours, mins, past } = diffParts(target);
  const body = days > 0 ? `${days} 天 ${hours} 時` : `${hours} 時 ${mins} 分`;
  return past ? "已過" : body;
}

function renderCountdown() {
  const items = [
    { label: "距離出發", target: new Date(tripInfo.startDate + "T00:00:00") },
    { label: "距離搭船至廈門", target: new Date(tripInfo.ferryToXiamen) },
    { label: "距離搭船返回金門", target: new Date(tripInfo.ferryToKinmen) },
    { label: "距離返台航班", target: new Date(tripInfo.returnFlight) }
  ];
  const grid = document.getElementById("countdown-grid");
  grid.innerHTML = items.map(it => `
    <div class="countdown-card">
      <div class="cd-label">${it.label}</div>
      <div class="cd-value">${formatCountdown(it.target)}</div>
    </div>
  `).join("");
}

// ---------- 單一行程點 HTML ----------
function planItemHtml(p) {
  const badges = [];
  if (p.ticket) badges.push(`<span class="badge ticket">需門票</span>`);
  if (p.reserve) badges.push(`<span class="badge reserve">待預約</span>`);
  if (p.transport) badges.push(`<span class="badge">${p.transport}</span>`);
  if (p.duration) badges.push(`<span class="badge">${p.duration}</span>`);

  return `
    <div class="plan-item">
      <div class="plan-time">${p.time}</div>
      <div class="plan-body">
        <div class="plan-place">${p.place}</div>
        <div class="plan-activity">${p.activity}</div>
        <div class="plan-meta">${badges.join("")}</div>
        ${p.note ? `<div class="plan-note">📌 ${p.note}</div>` : ""}
        <a class="map-btn" href="${amapUrl(p.place)}" target="_blank" rel="noopener">開啟高德地圖</a>
      </div>
    </div>
  `;
}

// ---------- 今日行程 + 現在／下一站 ----------
function renderToday() {
  const container = document.getElementById("today-card");
  const today = todayStr();
  const dayIndex = tripData.findIndex(d => d.date === today);

  if (dayIndex === -1) {
    const start = new Date(tripInfo.startDate + "T00:00:00");
    const now = new Date();
    if (now < start) {
      const { days } = diffParts(start);
      container.innerHTML = `
        <div class="today-card today-empty">
          <strong>距離出發還有 ${days} 天</strong>
          出發日：${tripInfo.startDate}
        </div>`;
    } else {
      container.innerHTML = `
        <div class="today-card today-empty">
          <strong>旅程已結束</strong>
          期待下一次一起出發！
        </div>`;
    }
    return;
  }

  const day = tripData[dayIndex];
  const now = new Date();

  // 判斷現在／下一站：用 plan 的順序，若時間是 HH:MM 就比對，否則用索引順序推估
  let currentPlan = null, nextPlan = null;
  const timedPlans = day.plans.map((p, i) => ({ ...p, idx: i, t: /^\d{1,2}:\d{2}$/.test(p.time) ? p.time : null }));
  const withTime = timedPlans.filter(p => p.t);

  if (withTime.length) {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    let curIdx = -1;
    for (let i = 0; i < withTime.length; i++) {
      const [h, m] = withTime[i].t.split(":").map(Number);
      if (h * 60 + m <= nowMin) curIdx = i; else break;
    }
    if (curIdx >= 0) {
      currentPlan = withTime[curIdx];
      nextPlan = withTime[curIdx + 1] || day.plans[withTime[curIdx].idx + 1] || null;
    } else {
      nextPlan = withTime[0];
    }
  } else {
    currentPlan = day.plans[0];
    nextPlan = day.plans[1] || null;
  }

  const allDone = withTime.length && !currentPlan && false;
  const dayEnded = withTime.length && currentPlan && currentPlan.idx === day.plans.length - 1 && !nextPlan;

  container.innerHTML = `
    <div class="today-card">
      <div class="today-day">${day.day}｜${day.displayDate} ${day.week}</div>
      <div class="today-title">${day.title}</div>
      <div class="now-next-grid">
        <div class="now-next-box">
          <div class="nn-label">現在行程</div>
          <div class="nn-value">${currentPlan ? currentPlan.place : "尚未開始"}</div>
        </div>
        <div class="now-next-box next">
          <div class="nn-label">下一站</div>
          <div class="nn-value">${nextPlan ? nextPlan.place : (dayEnded ? "今日行程已結束" : "—")}</div>
        </div>
      </div>
      ${day.plans.map(planItemHtml).join("")}
    </div>
  `;
}

// ---------- 完整每日行程表（tabs） ----------
function renderSchedule() {
  const tabsEl = document.getElementById("day-tabs");
  const panelsEl = document.getElementById("day-panels");
  const today = todayStr();
  const activeIndex = Math.max(0, tripData.findIndex(d => d.date === today));

  tabsEl.innerHTML = tripData.map((d, i) => `
    <button class="day-tab ${i === activeIndex ? "active" : ""}" data-idx="${i}">
      ${d.day}　${d.displayDate}
    </button>
  `).join("");

  panelsEl.innerHTML = tripData.map((d, i) => `
    <div class="day-panel ${i === activeIndex ? "active" : ""}" data-idx="${i}">
      <div class="card">
        <div class="day-panel-head">
          <div class="day-panel-title">${d.title}</div>
          <div class="day-panel-date">${d.displayDate} ${d.week}</div>
        </div>
        ${d.plans.map(planItemHtml).join("")}
      </div>
    </div>
  `).join("");

  tabsEl.querySelectorAll(".day-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.idx;
      tabsEl.querySelectorAll(".day-tab").forEach(b => b.classList.toggle("active", b.dataset.idx === idx));
      panelsEl.querySelectorAll(".day-panel").forEach(p => p.classList.toggle("active", p.dataset.idx === idx));
    });
  });
}

// ---------- 待辦（待訂購 / 待預約） ----------
function loadTodoOverrides() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.todo)) || {}; }
  catch { return {}; }
}
function saveTodoOverrides(overrides) {
  localStorage.setItem(STORAGE_KEYS.todo, JSON.stringify(overrides));
}

function renderTodoGroup(listId, items, groupKey, overrides) {
  const el = document.getElementById(listId);
  el.innerHTML = items.map((it, i) => {
    const key = `${groupKey}-${i}`;
    const done = overrides[key] !== undefined ? overrides[key] : it.done;
    return `
      <li class="${done ? "done" : ""}" data-key="${key}">
        <span class="dot"></span>
        <span>${it.name}</span>
        ${it.note ? `<span class="todo-note">${it.note}</span>` : ""}
      </li>
    `;
  }).join("");

  el.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
      const key = li.dataset.key;
      const overrides = loadTodoOverrides();
      const currentlyDone = li.classList.contains("done");
      overrides[key] = !currentlyDone;
      saveTodoOverrides(overrides);
      li.classList.toggle("done");
    });
  });
}

function renderTodo() {
  const overrides = loadTodoOverrides();
  renderTodoGroup("todo-order", todoList.order, "order", overrides);
  renderTodoGroup("todo-reserve", todoList.reserve, "reserve", overrides);
}

// ---------- 住宿 ----------
function renderHotels() {
  const el = document.getElementById("hotel-list");
  el.innerHTML = hotels.map(h => `
    <div class="hotel-card">
      <h3>${h.name}　<span style="font-size:12px;color:var(--muted)">(${h.nights})</span></h3>
      <div class="hotel-row"><span class="k">地址</span><span>${h.address}</span></div>
      <div class="hotel-row"><span class="k">入住</span><span>${h.checkin}</span></div>
      <div class="hotel-row"><span class="k">退房</span><span>${h.checkout}</span></div>
      <div class="hotel-row"><span class="k">電話</span><span>${h.phone}</span></div>
      <div class="hotel-row"><span class="k">房型分配</span><span>${h.rooms}</span></div>
      <a class="map-btn" href="${amapUrl(h.name)}" target="_blank" rel="noopener">開啟高德地圖</a>
    </div>
  `).join("");
}

// ---------- 攜帶物品清單 ----------
function loadPacking() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.packing)) || {}; }
  catch { return {}; }
}
function savePacking(state) {
  localStorage.setItem(STORAGE_KEYS.packing, JSON.stringify(state));
}

function renderPacking() {
  const state = loadPacking();
  const el = document.getElementById("packing-list");
  el.innerHTML = packingList.map((item, i) => {
    const checked = !!state[i];
    return `
      <li class="${checked ? "checked" : ""}" data-idx="${i}">
        <input type="checkbox" ${checked ? "checked" : ""} />
        <span>${item}</span>
      </li>
    `;
  }).join("");

  el.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "INPUT") return; // 交給 change 事件處理，避免觸發兩次
      li.querySelector("input").click();
    });
    li.querySelector("input").addEventListener("change", () => {
      const idx = li.dataset.idx;
      const state = loadPacking();
      state[idx] = !state[idx];
      savePacking(state);
      li.classList.toggle("checked", state[idx]);
    });
  });
}

// ---------- 預算 ----------
function loadBudget() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.budget)) || {}; }
  catch { return {}; }
}
function saveBudget(state) {
  localStorage.setItem(STORAGE_KEYS.budget, JSON.stringify(state));
}

function renderBudget() {
  const state = loadBudget();
  const body = document.getElementById("budget-body");

  function recalc() {
    let total = 0;
    body.querySelectorAll("input").forEach(inp => { total += Number(inp.value) || 0; });
    document.getElementById("budget-total").textContent = total.toLocaleString();
    document.getElementById("budget-avg").textContent = Math.round(total / members.length).toLocaleString();
  }

  body.innerHTML = budgetItems.map((b, i) => {
    const val = state[i] !== undefined ? state[i] : b.amount;
    return `
      <tr>
        <td>${b.item}</td>
        <td><input type="number" min="0" inputmode="numeric" data-idx="${i}" value="${val}" style="width:90px;text-align:right;border:1px solid var(--line);border-radius:6px;padding:4px 6px;font-family:var(--font-mono)"></td>
      </tr>
    `;
  }).join("");

  body.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", () => {
      const state = loadBudget();
      state[inp.dataset.idx] = Number(inp.value) || 0;
      saveBudget(state);
      recalc();
    });
  });

  recalc();
}

// ---------- 美食清單 ----------
function foodCardHtml(f) {
  return `
    <div class="food-card">
      <div class="food-name">${f.name}</div>
      <div class="food-type">${f.type}</div>
      <div class="food-meta">${f.address}${f.hours ? "　｜　" + f.hours : ""}</div>
      ${f.note ? `<div class="plan-note">📌 ${f.note}</div>` : ""}
      <a class="map-btn" href="${amapUrl(f.name)}" target="_blank" rel="noopener">開啟高德地圖</a>
    </div>
  `;
}
function renderFood() {
  document.getElementById("food-must").innerHTML = foodList.mustEat.map(foodCardHtml).join("");
  document.getElementById("food-backup").innerHTML = foodList.backup.map(foodCardHtml).join("");
}

// ---------- 雨天備案 ----------
function renderRainy() {
  const el = document.getElementById("rainy-list");
  el.innerHTML = rainyDayPlans.map(r => `
    <div class="rainy-card">
      <div class="original">${r.original}</div>
      <div class="arrow">→</div>
      <div class="backup">${r.backup}</div>
    </div>
  `).join("");
}

// ---------- 成員 ----------
function renderMembers() {
  const el = document.getElementById("member-grid");
  el.innerHTML = members.map(m => `
    <div class="member-chip">
      <div class="avatar">${m.name.slice(0, 1)}</div>
      <div>${m.name}</div>
      ${m.role ? `<div style="font-size:11px;color:var(--muted)">${m.role}</div>` : ""}
    </div>
  `).join("");
}

// ---------- 初始化 ----------
function init() {
  renderHero();
  renderAnnouncement();
  renderCountdown();
  renderToday();
  renderSchedule();
  renderTodo();
  renderHotels();
  renderPacking();
  renderBudget();
  renderFood();
  renderRainy();
  renderMembers();

  // 每分鐘更新一次倒數與今日行程狀態
  setInterval(() => {
    renderCountdown();
    renderToday();
    renderHero();
  }, 60 * 1000);
}

document.addEventListener("DOMContentLoaded", init);
