import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AffiliateSummary = {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  ref_code: string;
  is_active: boolean;
  commissions: {
    total_count: number;
    pending_count: number;
    paid_count: number;
    approved_count: number;
    canceled_count: number;
    total_amount: number;
    pending_amount: number;
    paid_amount: number;
  };
};

function getEnv(name: string) {
  return (process.env[name] || "").trim();
}

function getSupabaseAdmin() {
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

function toCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

async function getAffiliateSummaries(): Promise<AffiliateSummary[]> {
  const supabase = getSupabaseAdmin();

  const { data: affiliates, error: affiliatesError } = await supabase
    .from("affiliates")
    .select("id, name, email, whatsapp, ref_code, is_active")
    .order("created_at", { ascending: false });

  if (affiliatesError) {
    throw affiliatesError;
  }

  const { data: commissions, error: commissionsError } = await supabase
    .from("affiliate_commissions")
    .select("affiliate_id, commission_amount, status");

  if (commissionsError) {
    throw commissionsError;
  }

  const commissionMap = new Map<string, AffiliateSummary["commissions"]>();

  for (const row of commissions || []) {
    const affiliateId = row.affiliate_id as string;
    const amount = Number(row.commission_amount || 0);
    const status = String(row.status || "pending");

    if (!commissionMap.has(affiliateId)) {
      commissionMap.set(affiliateId, {
        total_count: 0,
        pending_count: 0,
        paid_count: 0,
        approved_count: 0,
        canceled_count: 0,
        total_amount: 0,
        pending_amount: 0,
        paid_amount: 0,
      });
    }

    const current = commissionMap.get(affiliateId)!;
    current.total_count += 1;
    current.total_amount += amount;

    if (status === "pending") {
      current.pending_count += 1;
      current.pending_amount += amount;
    }

    if (status === "paid") {
      current.paid_count += 1;
      current.paid_amount += amount;
    }

    if (status === "approved") {
      current.approved_count += 1;
    }

    if (status === "canceled") {
      current.canceled_count += 1;
    }
  }

  return (affiliates || []).map((affiliate) => ({
    ...(affiliate as Omit<AffiliateSummary, "commissions">),
    commissions:
      commissionMap.get(affiliate.id as string) || {
        total_count: 0,
        pending_count: 0,
        paid_count: 0,
        approved_count: 0,
        canceled_count: 0,
        total_amount: 0,
        pending_amount: 0,
        paid_amount: 0,
      },
  }));
}

export default async function AfiliadosPage() {
  const affiliates = await getAffiliateSummaries();

  return (
    <main style={styles.page}>
      <section style={styles.wrapper}>
        <div style={styles.hero}>
          <div style={styles.badge}>Afiliados</div>
          <h1 style={styles.title}>Painel simples de afiliados</h1>
          <p style={styles.subtitle}>
            Acompanhe códigos de indicação, quantidade de vendas e comissões da
            Aurora Condomínios.
          </p>
        </div>

        <div style={styles.cardsGrid}>
          {affiliates.length === 0 ? (
            <div style={styles.emptyCard}>
              Nenhum afiliado encontrado ainda.
            </div>
          ) : (
            affiliates.map((affiliate) => (
              <article key={affiliate.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <h2 style={styles.cardTitle}>{affiliate.name}</h2>
                    <p style={styles.cardRef}>ref: {affiliate.ref_code}</p>
                  </div>
                  <div
                    style={{
                      ...styles.statusPill,
                      ...(affiliate.is_active
                        ? styles.statusActive
                        : styles.statusInactive),
                    }}
                  >
                    {affiliate.is_active ? "Ativo" : "Inativo"}
                  </div>
                </div>

                <div style={styles.metaBlock}>
                  <div style={styles.metaItem}>
                    <strong>E-mail:</strong> {affiliate.email || "não informado"}
                  </div>
                  <div style={styles.metaItem}>
                    <strong>WhatsApp:</strong>{" "}
                    {affiliate.whatsapp || "não informado"}
                  </div>
                </div>

                <div style={styles.statsGrid}>
                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>Vendas / comissões</div>
                    <div style={styles.statValue}>
                      {affiliate.commissions.total_count}
                    </div>
                  </div>

                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>Total gerado</div>
                    <div style={styles.statValue}>
                      {toCurrency(affiliate.commissions.total_amount)}
                    </div>
                  </div>

                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>Pendente</div>
                    <div style={styles.statValue}>
                      {toCurrency(affiliate.commissions.pending_amount)}
                    </div>
                  </div>

                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>Pago</div>
                    <div style={styles.statValue}>
                      {toCurrency(affiliate.commissions.paid_amount)}
                    </div>
                  </div>
                </div>

                <div style={styles.breakdown}>
                  <div style={styles.breakdownItem}>
                    Pendentes: {affiliate.commissions.pending_count}
                  </div>
                  <div style={styles.breakdownItem}>
                    Aprovadas: {affiliate.commissions.approved_count}
                  </div>
                  <div style={styles.breakdownItem}>
                    Pagas: {affiliate.commissions.paid_count}
                  </div>
                  <div style={styles.breakdownItem}>
                    Canceladas: {affiliate.commissions.canceled_count}
                  </div>
                </div>

                <div style={styles.linkBox}>
                  Link do afiliado:
                  <br />
                  <strong>
                    {`https://nextjs-boilerplate-wtke.vercel.app/planos?ref=${affiliate.ref_code}`}
                  </strong>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f4f8fc 0%, #eef4fb 45%, #e8f1fb 100%)",
    padding: "32px 16px 56px",
    color: "#142433",
  },
  wrapper: {
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
  },
  hero: {
    background: "linear-gradient(135deg, #ffffff 0%, #f4f9ff 100%)",
    border: "1px solid rgba(66, 124, 171, 0.14)",
    borderRadius: 28,
    padding: "28px 24px",
    boxShadow: "0 18px 50px rgba(31, 80, 124, 0.08)",
    marginBottom: 24,
  },
  badge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(24, 119, 242, 0.08)",
    border: "1px solid rgba(24, 119, 242, 0.16)",
    color: "#1565c0",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 900,
    color: "#102030",
  },
  subtitle: {
    marginTop: 14,
    marginBottom: 0,
    color: "#567086",
    fontSize: 16,
    lineHeight: 1.6,
    maxWidth: 760,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 18,
  },
  emptyCard: {
    background: "#ffffff",
    border: "1px solid rgba(66, 124, 171, 0.14)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 18px 50px rgba(31, 80, 124, 0.06)",
    fontWeight: 700,
    color: "#486175",
  },
  card: {
    background: "#ffffff",
    border: "1px solid rgba(66, 124, 171, 0.14)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 18px 50px rgba(31, 80, 124, 0.06)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  cardTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    color: "#102030",
  },
  cardRef: {
    marginTop: 6,
    marginBottom: 0,
    color: "#1565c0",
    fontWeight: 800,
  },
  statusPill: {
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  statusActive: {
    background: "#edf9f0",
    border: "1px solid #bfe8c8",
    color: "#1f6f35",
  },
  statusInactive: {
    background: "#fff1f1",
    border: "1px solid #f2c6c6",
    color: "#a02b2b",
  },
  metaBlock: {
    marginTop: 16,
    display: "grid",
    gap: 8,
    color: "#486175",
  },
  metaItem: {
    lineHeight: 1.5,
  },
  statsGrid: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  statBox: {
    borderRadius: 16,
    background: "#f8fbff",
    border: "1px solid #d8e6f2",
    padding: 14,
  },
  statLabel: {
    fontSize: 13,
    color: "#5b7287",
    fontWeight: 700,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 900,
    color: "#102030",
  },
  breakdown: {
    marginTop: 18,
    display: "grid",
    gap: 8,
    color: "#486175",
    fontWeight: 700,
  },
  breakdownItem: {
    lineHeight: 1.5,
  },
  linkBox: {
    marginTop: 18,
    borderRadius: 16,
    background: "#eef6ff",
    border: "1px solid #c8def7",
    padding: 14,
    color: "#1d5f9d",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
};