import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanCode = "start" | "pro" | "premium_multi";

type SubscriptionRow = {
  id: string;
  user_id: string | null;
  company_id: string | null;
  condominium_id: string | null;
  plan: PlanCode;
  status: string;
  billing_cycle: string;
  amount: number;
  payment_provider: string | null;
  payment_id: string | null;
  checkout_url: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_whatsapp: string | null;
  started_at: string | null;
  expires_at: string | null;
  paid_at: string | null;
  canceled_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type CreateSubscriptionBody = {
  plan?: PlanCode;
  customerName?: string;
  customerEmail?: string;
  customerWhatsapp?: string;
};

const PLAN_CONFIG: Record<
  PlanCode,
  {
    code: PlanCode;
    label: string;
    amount: number;
    billingCycle: "monthly";
    statusOnCreate: "active" | "pending_payment";
    paymentProvider: "internal" | "asaas";
    checkoutUrlEnv?: string;
    requiresWhatsapp: boolean;
    metadata: Record<string, unknown>;
  }
> = {
  start: {
    code: "start",
    label: "Aurora Start",
    amount: 0,
    billingCycle: "monthly",
    statusOnCreate: "active",
    paymentProvider: "internal",
    requiresWhatsapp: false,
    metadata: {
      source: "planos_page",
      product: "aurora_condominios",
      tier: "free",
    },
  },
  pro: {
    code: "pro",
    label: "Aurora PRO Gestão",
    amount: 29.9,
    billingCycle: "monthly",
    statusOnCreate: "pending_payment",
    paymentProvider: "asaas",
    checkoutUrlEnv: "ASAAS_PRO_CHECKOUT_URL",
    requiresWhatsapp: true,
    metadata: {
      source: "planos_page",
      product: "aurora_condominios",
      tier: "paid",
    },
  },
  premium_multi: {
    code: "premium_multi",
    label: "Aurora Premium Multi",
    amount: 79.9,
    billingCycle: "monthly",
    statusOnCreate: "pending_payment",
    paymentProvider: "asaas",
    checkoutUrlEnv: "ASAAS_PREMIUM_CHECKOUT_URL",
    requiresWhatsapp: true,
    metadata: {
      source: "planos_page",
      product: "aurora_condominios",
      tier: "paid",
    },
  },
};

function getEnv(name: string): string {
  return (process.env[name] || "").trim();
}

function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl =
    getEnv("SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL não configurada.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeWhatsapp(value?: string): string | null {
  const onlyDigits = (value || "").replace(/\D/g, "");
  return onlyDigits ? onlyDigits : null;
}

function normalizeEmail(value?: string): string | null {
  const clean = (value || "").trim().toLowerCase();
  return clean || null;
}

function normalizeName(value?: string): string | null {
  const clean = (value || "").trim();
  return clean || null;
}

function getCheckoutUrl(plan: PlanCode): string | null {
  const config = PLAN_CONFIG[plan];

  if (!config.checkoutUrlEnv) {
    return null;
  }

  const value = getEnv(config.checkoutUrlEnv);
  return value || null;
}

function getSuccessMessage(plan: PlanCode, checkoutUrl: string | null): string {
  const config = PLAN_CONFIG[plan];

  if (plan === "start") {
    return `Plano ${config.label} ativado com sucesso.`;
  }

  if (checkoutUrl) {
    return `Plano ${config.label} registrado com sucesso. Próximo passo: seguir para o checkout.`;
  }

  return `Plano ${config.label} registrado com sucesso. Próximo passo: conectar checkout e liberação automática.`;
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      items: (data || []) as SubscriptionRow[],
    });
  } catch (error: any) {
    console.error("ERRO GERAL GET /api/subscriptions:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erro ao buscar subscriptions.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateSubscriptionBody;

    const plan = body?.plan;
    if (!plan || !PLAN_CONFIG[plan]) {
      return NextResponse.json(
        {
          ok: false,
          error: "Plano inválido.",
        },
        { status: 400 }
      );
    }

    const config = PLAN_CONFIG[plan];
    const customerName = normalizeName(body?.customerName);
    const customerEmail = normalizeEmail(body?.customerEmail);
    const customerWhatsapp = normalizeWhatsapp(body?.customerWhatsapp);

    if (config.requiresWhatsapp && !customerWhatsapp) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Para planos pagos, informe um WhatsApp válido antes de continuar.",
        },
        { status: 400 }
      );
    }

    const checkoutUrl = getCheckoutUrl(plan);
    const startedAt = new Date().toISOString();

    const payload = {
      user_id: null,
      company_id: null,
      condominium_id: null,
      plan: config.code,
      status: config.statusOnCreate,
      billing_cycle: config.billingCycle,
      amount: config.amount,
      payment_provider: config.paymentProvider,
      payment_id: null,
      checkout_url: checkoutUrl,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_whatsapp: customerWhatsapp,
      started_at: startedAt,
      expires_at: null,
      paid_at: null,
      canceled_at: null,
      metadata: {
        ...config.metadata,
        checkout_configured: Boolean(checkoutUrl),
      },
    };

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("subscriptions")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      message: getSuccessMessage(plan, checkoutUrl),
      subscription: data as SubscriptionRow,
      checkoutUrl,
      redirectTo: checkoutUrl,
      nextAction: plan === "start" ? "activated" : checkoutUrl ? "checkout" : "configure_checkout",
    });
  } catch (error: any) {
    console.error("ERRO GERAL POST /api/subscriptions:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erro ao registrar subscription.",
      },
      { status: 500 }
    );
  }
}