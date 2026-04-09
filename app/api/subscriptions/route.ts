import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscriptionPlan = "start" | "pro" | "premium";
type SubscriptionStatus =
  | "pending"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";
type BillingCycle = "monthly" | "yearly";

type SubscriptionPayload = {
  user_id?: string | null;
  company_id?: string | null;
  condominium_id?: string | null;

  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  billing_cycle?: BillingCycle;
  amount?: number | string;

  payment_provider?: string | null;
  payment_id?: string | null;
  checkout_url?: string | null;

  customer_name?: string | null;
  customer_email?: string | null;
  customer_whatsapp?: string | null;

  started_at?: string | null;
  expires_at?: string | null;
  paid_at?: string | null;
  canceled_at?: string | null;

  metadata?: Record<string, unknown> | null;
};

const ALLOWED_PLANS: SubscriptionPlan[] = ["start", "pro", "premium"];
const ALLOWED_STATUS: SubscriptionStatus[] = [
  "pending",
  "active",
  "past_due",
  "canceled",
  "expired",
];
const ALLOWED_BILLING_CYCLES: BillingCycle[] = ["monthly", "yearly"];

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return value;
}

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_URL não configurada."
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  return clean.length ? clean : null;
}

function normalizeAmount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number(value.toFixed(2));
  }

  if (typeof value === "string") {
    const normalized = value.replace(",", ".").trim();
    const parsed = Number(normalized);

    if (Number.isFinite(parsed)) {
      return Number(parsed.toFixed(2));
    }
  }

  return 0;
}

function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

function normalizePlan(value: unknown): SubscriptionPlan {
  if (typeof value === "string" && ALLOWED_PLANS.includes(value as SubscriptionPlan)) {
    return value as SubscriptionPlan;
  }
  return "start";
}

function normalizeStatus(value: unknown): SubscriptionStatus {
  if (
    typeof value === "string" &&
    ALLOWED_STATUS.includes(value as SubscriptionStatus)
  ) {
    return value as SubscriptionStatus;
  }
  return "pending";
}

function normalizeBillingCycle(value: unknown): BillingCycle {
  if (
    typeof value === "string" &&
    ALLOWED_BILLING_CYCLES.includes(value as BillingCycle)
  ) {
    return value as BillingCycle;
  }
  return "monthly";
}

function getDefaultAmount(plan: SubscriptionPlan, billingCycle: BillingCycle): number {
  if (billingCycle === "yearly") {
    if (plan === "pro") return 299;
    if (plan === "premium") return 799;
    return 0;
  }

  if (plan === "pro") return 29.9;
  if (plan === "premium") return 79.9;
  return 0;
}

function buildPayload(body: SubscriptionPayload) {
  const plan = normalizePlan(body.plan);
  const billingCycle = normalizeBillingCycle(body.billing_cycle);
  const normalizedAmount = normalizeAmount(body.amount);
  const amount =
    normalizedAmount > 0 ? normalizedAmount : getDefaultAmount(plan, billingCycle);

  return {
    user_id: normalizeText(body.user_id),
    company_id: normalizeText(body.company_id),
    condominium_id: normalizeText(body.condominium_id),

    plan,
    status: normalizeStatus(body.status),
    billing_cycle: billingCycle,
    amount,

    payment_provider: normalizeText(body.payment_provider),
    payment_id: normalizeText(body.payment_id),
    checkout_url: normalizeText(body.checkout_url),

    customer_name: normalizeText(body.customer_name),
    customer_email: normalizeText(body.customer_email),
    customer_whatsapp: normalizeText(body.customer_whatsapp),

    started_at: normalizeDate(body.started_at),
    expires_at: normalizeDate(body.expires_at),
    paid_at: normalizeDate(body.paid_at),
    canceled_at: normalizeDate(body.canceled_at),

    metadata:
      body.metadata && typeof body.metadata === "object" ? body.metadata : {},
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const user_id = searchParams.get("user_id");
    const company_id = searchParams.get("company_id");
    const condominium_id = searchParams.get("condominium_id");
    const plan = searchParams.get("plan");
    const status = searchParams.get("status");

    let query = supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (id) query = query.eq("id", id);
    if (user_id) query = query.eq("user_id", user_id);
    if (company_id) query = query.eq("company_id", company_id);
    if (condominium_id) query = query.eq("condominium_id", condominium_id);
    if (plan && ALLOWED_PLANS.includes(plan as SubscriptionPlan)) {
      query = query.eq("plan", plan);
    }
    if (status && ALLOWED_STATUS.includes(status as SubscriptionStatus)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("ERRO AO LISTAR SUBSCRIPTIONS:", error);
      return NextResponse.json(
        {
          ok: false,
          error: error.message || "Erro ao listar subscriptions.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      items: data || [],
    });
  } catch (error: any) {
    console.error("ERRO GERAL GET /api/subscriptions:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erro interno ao buscar subscriptions.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = (await request.json()) as SubscriptionPayload;
    const payload = buildPayload(body);

    const validationErrors: string[] = [];

    if (!payload.plan) {
      validationErrors.push("Plano inválido.");
    }

    if (!payload.status) {
      validationErrors.push("Status inválido.");
    }

    if (!payload.billing_cycle) {
      validationErrors.push("Ciclo de cobrança inválido.");
    }

    if (
      payload.plan !== "start" &&
      !payload.customer_name &&
      !payload.customer_email &&
      !payload.customer_whatsapp
    ) {
      validationErrors.push(
        "Para planos pagos, informe ao menos nome, e-mail ou WhatsApp do cliente."
      );
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Falha de validação.",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      console.error("ERRO AO CRIAR SUBSCRIPTION:", error);

      return NextResponse.json(
        {
          ok: false,
          error: error.message || "Erro ao criar subscription.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        item: data,
        message: "Subscription criada com sucesso.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("ERRO GERAL POST /api/subscriptions:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erro interno ao criar subscription.",
      },
      { status: 500 }
    );
  }
}