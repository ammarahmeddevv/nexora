/* All the page's real content in one place. */

/** px per trace lane — shared by the 3D canvas and the HTML label column
 *  so their rows line up. */
export const TRACE_ROW = 52;

export type StepState = "done" | "retry" | "sleeping" | "running";

export interface TraceStep {
  name: string;
  /** fraction of the total run the step starts at (0–1) */
  start: number;
  /** fraction of the total run the step occupies (0–1) */
  span: number;
  state: StepState;
  note?: string;
}

/** The `order.fulfil` run shown in the hero. */
export const HERO_RUN = {
  id: "run_8f2c41",
  workflow: "order.fulfil",
  duration: "2m 41s",
  steps: [
    { name: "validate-cart", start: 0.0, span: 0.12, state: "done" },
    {
      name: "charge-card",
      start: 0.12,
      span: 0.3,
      state: "retry",
      note: "retry 2 · backoff 8s",
    },
    {
      name: "reserve-stock",
      start: 0.44,
      span: 0.24,
      state: "sleeping",
      note: "sleeping 30s",
    },
    { name: "schedule-pickup", start: 0.6, span: 0.16, state: "done" },
    { name: "notify-customer", start: 0.78, span: 0.22, state: "running" },
  ] satisfies TraceStep[],
};

export const NAV_LINKS = [
  { label: "Docs", href: "#quickstart" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#changelog" },
];

export const QUICKSTART_TABS = [
  {
    id: "define",
    label: "Define",
    file: "workflows/welcome.ts",
    code: `import { workflow } from "nexora";

export const welcome = workflow("welcome", async (step, { user }) => {
  await step.run("create-account", () => db.users.create(user));

  await step.sleep("wait-a-day", "24h");

  await step.run("send-tips", () =>
    email.send(user.email, "getting-started")
  );
});`,
  },
  {
    id: "schedule",
    label: "Schedule",
    file: "workflows/digest.ts",
    code: `import { workflow, cron } from "nexora";

export const digest = workflow(
  "weekly-digest",
  cron("0 9 * * MON", "Europe/London"),
  async (step) => {
    const teams = await step.run("active-teams", listActiveTeams);
    await step.forEach("send", teams, (t) => sendDigest(t));
  }
);`,
  },
  {
    id: "deploy",
    label: "Deploy",
    file: "terminal",
    code: `$ npx nexora deploy

  ✓ bundled 12 workflows
  ✓ registered welcome, weekly-digest, order.fulfil …
  ✓ live at run.nexora.dev/acme

  workflows are now handling events. view runs:
  → nexora runs --follow`,
  },
];

export interface RunPhase {
  key: StepState | "queued";
  label: string;
  title: string;
  body: string;
}

export const RUN_PHASES: RunPhase[] = [
  {
    key: "queued",
    label: "Queued",
    title: "An event arrives and a run is created",
    body: "Every trigger — an HTTP call, a cron tick, an event from your app — creates a run with a durable ID. If nothing is free to pick it up yet, it waits in line, not in memory.",
  },
  {
    key: "running",
    label: "Running",
    title: "Steps execute one at a time, and each result is saved",
    body: "A worker claims the run and executes the first step. The return value is persisted before the next step starts, so the function can be replayed from any point without repeating work.",
  },
  {
    key: "retry",
    label: "Retrying",
    title: "A step throws, so Nexora backs off and tries again",
    body: "charge-card fails on a timeout. The run doesn't crash — the step is retried on an exponential backoff, up to the policy you set. Completed steps before it are never re-run.",
  },
  {
    key: "sleeping",
    label: "Sleeping",
    title: "The run sleeps for 30 seconds without holding a worker",
    body: "step.sleep releases the worker and schedules a wake-up. A run can sleep for seconds or for months; it costs nothing while it waits and resumes exactly where it left off.",
  },
  {
    key: "done",
    label: "Complete",
    title: "The last step returns and the run is sealed",
    body: "The full history — inputs, every step output, timings, retries — is kept. You can inspect it, replay it against new code, or cancel runs that are still in flight.",
  },
];

export const FEATURES = [
  {
    title: "Automatic retries",
    body: "Per-step retry policies with exponential backoff and jitter. Completed steps are never repeated on a retry.",
    kind: "retry" as const,
  },
  {
    title: "Cron and schedules",
    body: "Attach a cron expression and a timezone to any workflow. Schedules are versioned with your code, not clicked into a dashboard.",
    kind: "cron" as const,
  },
  {
    title: "Concurrency and rate limits",
    body: "Cap a workflow to N runs at once, or key the limit by customer so one tenant can't starve the rest.",
    kind: "concurrency" as const,
  },
  {
    title: "Full run history",
    body: "Every run keeps its inputs, step outputs and timings. Replay a past run against new code to check a fix before you ship it.",
    kind: "history" as const,
  },
  {
    title: "Local dev parity",
    body: "nexora dev runs the same engine on your machine against your real workflow files. No emulator, no drift.",
    kind: "local" as const,
  },
  {
    title: "Type-safe SDK",
    body: "Event payloads and step return types flow through end to end. Rename an event and the compiler finds every handler.",
    kind: "types" as const,
  },
];

export const SHOWCASE_CODE = `import { workflow, NonRetriable } from "nexora";
import { charge, reserve, dispatch } from "./services";

export const fulfil = workflow(
  "order.fulfil",
  { concurrency: { limit: 50, key: (e) => e.data.warehouseId } },
  async (step, { data }) => {
    const cart = await step.run("validate-cart", () =>
      validate(data.cartId)
    );

    // step.run checkpoints the result — a retry after this
    // point never charges the customer twice
    const payment = await step.run("charge-card", () =>
      charge(cart.total, data.token)
    );

    const stock = await step.run("reserve-stock", () =>
      reserve(cart.lines)
    );

    if (!stock.ok) {
      await step.run("refund", () => charge.refund(payment.id));
      throw new NonRetriable("out of stock");
    }

    await step.sleep("hold-for-pick", "30s");
    await step.run("dispatch", () => dispatch(cart, stock.bin));

    return { order: cart.id, shipped: true };
  }
);`;

export const SHOWCASE_ANNOTATION = {
  line: 18,
  text: "Idempotency comes from step.run, not from you. Anything already checkpointed is skipped on replay.",
};

export interface RunRow {
  id: string;
  workflow: string;
  trigger: string;
  duration: string;
  state: StepState | "queued";
  when: string;
}

export const DASHBOARD_RUNS: RunRow[] = [
  { id: "run_8f2c41", workflow: "order.fulfil", trigger: "order.placed", duration: "2m 41s", state: "running", when: "just now" },
  { id: "run_8f2c40", workflow: "order.fulfil", trigger: "order.placed", duration: "3.10s", state: "done", when: "12s ago" },
  { id: "run_8f2c3e", workflow: "weekly-digest", trigger: "cron", duration: "1m 04s", state: "done", when: "40s ago" },
  { id: "run_8f2c3b", workflow: "order.fulfil", trigger: "order.placed", duration: "18.4s", state: "retry", when: "1m ago" },
  { id: "run_8f2c37", workflow: "welcome", trigger: "user.signup", duration: "—", state: "sleeping", when: "4m ago" },
  { id: "run_8f2c31", workflow: "invoice.send", trigger: "cron", duration: "2.02s", state: "done", when: "6m ago" },
];

export const DASHBOARD_STATS = [
  { label: "Runs today", value: "48,210" },
  { label: "Success rate", value: "99.94%", state: "ok" as const },
  { label: "Retry rate", value: "0.7%", state: "retry" as const },
  { label: "p99 step latency", value: "41ms" },
];

export const SCALE_FIGURES = [
  {
    value: "40ms",
    label: "p99 dispatch latency",
    note: "from event received to first step running, measured at the 99th percentile across all regions.",
  },
  {
    value: "12B",
    label: "steps run last month",
    note: "each one checkpointed, so any run can be replayed or resumed after a deploy.",
  },
  {
    value: "9",
    label: "regions",
    note: "runs execute close to your data; schedules fire on the region's own clock.",
  },
];

export interface Tier {
  name: string;
  price: string;
  cadence?: string;
  blurb: string;
  cta: string;
  featured?: boolean;
  includes: string[];
}

export const TIERS: Tier[] = [
  {
    name: "Hobby",
    price: "$0",
    blurb: "For side projects and trying Nexora in a real app.",
    cta: "Start building",
    includes: [
      "100k step-runs / month",
      "7-day run history",
      "1 environment",
      "Community support",
    ],
  },
  {
    name: "Team",
    price: "$24",
    cadence: "per developer / month",
    blurb: "For teams running Nexora in production.",
    cta: "Start a trial",
    featured: true,
    includes: [
      "5M step-runs / month, then usage",
      "90-day run history and replay",
      "Unlimited environments",
      "Concurrency and rate-limit keys",
      "Email and Slack support",
    ],
  },
  {
    name: "Enterprise",
    price: "Talk to us",
    blurb: "For scale, compliance and dedicated regions.",
    cta: "Contact sales",
    includes: [
      "Volume pricing",
      "Unlimited history and audit export",
      "SSO, SCIM, and per-region isolation",
      "SLA and a named engineer",
    ],
  },
];

export const CHANGELOG = [
  { date: "Apr 2", text: "Replay a past run against the current deploy" },
  { date: "Mar 19", text: "Concurrency keys — scope a limit to a tenant or resource" },
  { date: "Mar 4", text: "nexora dev now hot-reloads workflow files" },
];
