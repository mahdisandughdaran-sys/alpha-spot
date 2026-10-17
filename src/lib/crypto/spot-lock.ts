import type { SpotPlan, SpotWindow } from "./spot-plan.ts";

const KEY = "alpha-spot-window-lock-v1";

type StoredWindow = SpotWindow & { issuedAt: string };

type Stored = {
  symbol: string;
  invalidation: number;
  windows: StoredWindow[];
  orderFa: string;
  orderEn: string;
};

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function read(): Record<string, Stored> {
  if (!canStore()) return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Stored>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function write(store: Record<string, Stored>) {
  if (!canStore()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* quota */
  }
}

function killPlan(plan: SpotPlan): SpotPlan {
  return {
    ...plan,
    windows: plan.windows.map((item) => ({
      ...item,
      action: "cash",
      noteFa: "هیچ ارزی نخر. حد پایین شکسته شد.",
      noteEn: "Do not buy any coin. The lower level broke.",
    })),
    orderFa: "هیچ ارزی نخر. حد پایین شکسته شد و حکم قبلی باطل است.",
    orderEn: "Do not buy any coin. The lower level broke and the earlier call is dead.",
    holdFa: null,
    holdEn: null,
  };
}

function snapshot(plan: SpotPlan, windows: SpotWindow[], issuedAtFor: (horizon: SpotWindow["horizon"]) => string): Stored {
  return {
    symbol: plan.symbol,
    invalidation: plan.invalidation,
    windows: windows.map((item) => ({ ...item, issuedAt: issuedAtFor(item.horizon) })),
    orderFa: plan.orderFa,
    orderEn: plan.orderEn,
  };
}

/** Keep each coin's day, week, and month order until that window expires. */
export function lockSpotPlan(plan: SpotPlan, now = Date.now()): SpotPlan {
  if (!canStore() || !plan.windows?.length) return plan;
  const store = read();
  const prev = store[plan.symbol];
  const nowIso = new Date(now).toISOString();
  const freshBuyAlive =
    !!prev &&
    prev.windows.some((item) => {
      const until = Date.parse(item.issuedAt) + item.validForMs;
      return item.action === "buy" && Number.isFinite(until) && now < until;
    });
  const broke = freshBuyAlive && plan.price > 0 && prev.invalidation > 0 && plan.price < prev.invalidation;
  if (!prev || broke) {
    const next = broke ? killPlan(plan) : plan;
    store[plan.symbol] = snapshot(next, next.windows, () => nowIso);
    write(store);
    return next;
  }

  let dissent = false;
  const windows = plan.windows.map((fresh) => {
    const stored = prev.windows.find((item) => item.horizon === fresh.horizon);
    const until = stored ? Date.parse(stored.issuedAt) + stored.validForMs : Number.NaN;
    if (!stored || !Number.isFinite(until) || now >= until) return fresh;
    if (stored.action !== fresh.action) dissent = true;
    return {
      horizon: stored.horizon,
      action: stored.action,
      validForMs: stored.validForMs,
      titleFa: stored.titleFa,
      titleEn: stored.titleEn,
      noteFa: stored.noteFa,
      noteEn: stored.noteEn,
    };
  });
  const next: SpotPlan = {
    ...plan,
    windows,
    orderFa: dissent ? prev.orderFa : plan.orderFa,
    orderEn: dissent ? prev.orderEn : plan.orderEn,
    holdFa: dissent
      ? "تحلیل لحظه‌ای جور دیگری می‌گوید، ولی حکم‌هایی که هنوز اعتبار دارند عوض نمی‌شوند."
      : null,
    holdEn: dissent
      ? "The live tape disagrees, but calls that are still inside their window do not change."
      : null,
  };
  store[plan.symbol] = snapshot(next, windows, (horizon) => {
    const stored = prev.windows.find((item) => item.horizon === horizon);
    const until = stored ? Date.parse(stored.issuedAt) + stored.validForMs : Number.NaN;
    const keep = stored && Number.isFinite(until) && now < until;
    return keep ? stored.issuedAt : nowIso;
  });
  write(store);
  return next;
}
