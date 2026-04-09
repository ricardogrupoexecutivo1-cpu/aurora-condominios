"use client";

import { CSSProperties, useState } from "react";

type PlanType = "start" | "pro" | "premium";

type ApiResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  details?: string[];
  item?: {
    id: string;
    plan: PlanType;
    status: string;
    billing_cycle: string;
    amount: number;
    checkout_url?: string | null;
  };
};

export default function PlanosPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");

  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubscribe(plan: PlanType) {
    setMessage("");
    setError("");

    const hasContact =
      customerName.trim() || customerEmail.trim() || customerWhatsapp.trim();

    if ((plan === "pro" || plan === "premium") && !hasContact) {
      setError(
        "Para planos pagos, preencha pelo menos nome, e-mail ou WhatsApp antes de continuar."
      );
      return;
    }

    setLoadingPlan(plan);

    try {
      const amount = plan === "pro" ? 29.9 : plan === "premium" ? 79.9 : 0;

      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          status: plan === "start" ? "active" : "pending",
          billing_cycle: "monthly",
          amount,
          payment_provider: plan === "start" ? "internal" : "manual",
          customer_name: customerName.trim() || null,
          customer_email: customerEmail.trim() || null,
          customer_whatsapp: customerWhatsapp.trim() || null,
          started_at: new Date().toISOString(),
          metadata: {
            source: "planos_page",
            product: "aurora_condominios",
          },
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.ok) {
        const detailText =
          data?.details && data.details.length
            ? ` ${data.details.join(" ")}`
            : "";

        throw new Error(
          data?.error || `Falha ao criar assinatura.${detailText}`
        );
      }

      if (plan === "start") {
        setMessage(
          "Plano Aurora Start ativado com sucesso. A base da assinatura já foi registrada."
        );
      } else if (plan === "pro") {
        setMessage(
          "Plano Aurora PRO Gestão registrado com sucesso. Próximo passo: conectar checkout e liberação automática."
        );
      } else {
        setMessage(
          "Plano Aurora Premium Multi registrado com sucesso. Próximo passo: conectar checkout e liberação automática."
        );
      }

      setCustomerName("");
      setCustomerEmail("");
      setCustomerWhatsapp("");
    } catch (err: any) {
      setError(err?.message || "Erro ao criar assinatura.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroBadge}>Planos Aurora Condomínios</div>
        <h1 style={styles.title}>
          Escolha o plano ideal e comece a organizar seu condomínio com gestão
          profissional.
        </h1>
        <p style={styles.subtitle}>
          Estrutura comercial pronta para evolução com assinatura, cobrança e
          liberação automática por plano.
        </p>
      </section>

      <section style={styles.formSection}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>Dados para ativação do plano</h2>
          <p style={styles.formText}>
            Para os planos pagos, informe pelo menos um dado de contato.
            O sistema está em constante atualização e pode ter momentos de
            instabilidade durante melhorias.
          </p>
        </div>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Nome do responsável</label>
            <input
              style={styles.input}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ex.: Síndico responsável"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <input
              style={styles.input}
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Ex.: contato@condominio.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>WhatsApp</label>
            <input
              style={styles.input}
              value={customerWhatsapp}
              onChange={(e) => setCustomerWhatsapp(e.target.value)}
              placeholder="Ex.: (31) 99999-9999"
            />
          </div>
        </div>

        {message ? <div style={styles.successBox}>{message}</div> : null}
        {error ? <div style={styles.errorBox}>{error}</div> : null}
      </section>

      <section style={styles.grid}>
        <article style={styles.card}>
          <div style={styles.planHeader}>
            <h2 style={styles.planTitle}>Aurora Start</h2>
            <p style={styles.priceFree}>Grátis</p>
          </div>

          <ul style={styles.list}>
            <li>Até 5 unidades</li>
            <li>Cadastro básico</li>
            <li>Energia simples</li>
            <li>Comunicação limitada</li>
          </ul>

          <button
            type="button"
            style={styles.buttonSecondary}
            onClick={() => handleSubscribe("start")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "start" ? "Ativando..." : "Começar grátis"}
          </button>
        </article>

        <article style={styles.cardFeatured}>
          <div style={styles.featuredTag}>Mais vendido</div>

          <div style={styles.planHeader}>
            <h2 style={styles.planTitle}>Aurora PRO Gestão</h2>
            <p style={styles.price}>R$ 29,90/mês</p>
          </div>

          <ul style={styles.list}>
            <li>Unidades ilimitadas</li>
            <li>Energia completa</li>
            <li>Cobranças completas</li>
            <li>Comunicação liberada</li>
            <li>Melhorias com votação</li>
          </ul>

          <button
            type="button"
            style={styles.buttonPrimary}
            onClick={() => handleSubscribe("pro")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "pro" ? "Registrando..." : "Assinar PRO"}
          </button>
        </article>

        <article style={styles.card}>
          <div style={styles.planHeader}>
            <h2 style={styles.planTitle}>Aurora Premium Multi</h2>
            <p style={styles.price}>R$ 79,90/mês</p>
          </div>

          <ul style={styles.list}>
            <li>Tudo do PRO</li>
            <li>Múltiplos condomínios</li>
            <li>Relatórios avançados</li>
            <li>Suporte prioritário</li>
          </ul>

          <button
            type="button"
            style={styles.buttonDark}
            onClick={() => handleSubscribe("premium")}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === "premium"
              ? "Registrando..."
              : "Assinar Premium"}
          </button>
        </article>
      </section>

      <section style={styles.noticeBox}>
        <h3 style={styles.noticeTitle}>Pagamento recorrente automático</h3>
        <p style={styles.noticeText}>
          Após a confirmação do pagamento, o acesso será liberado e mantido
          enquanto a assinatura estiver ativa. A integração de checkout será
          conectada na próxima etapa.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "32px 16px 56px",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #eef5ff 55%, #e8f1ff 100%)",
    color: "#0f172a",
  },

  hero: {
    maxWidth: "1100px",
    margin: "0 auto 24px auto",
    textAlign: "center",
  },

  heroBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#e0ecff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    fontSize: "13px",
    fontWeight: 800,
    marginBottom: "14px",
  },

  title: {
    margin: "0 auto 12px auto",
    maxWidth: "880px",
    fontSize: "clamp(28px, 4vw, 44px)",
    lineHeight: 1.1,
    fontWeight: 800,
    color: "#0f172a",
  },

  subtitle: {
    margin: "0 auto",
    maxWidth: "760px",
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.7,
  },

  formSection: {
    maxWidth: "1100px",
    margin: "0 auto 26px auto",
    padding: "24px",
    borderRadius: "24px",
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
  },

  formHeader: {
    marginBottom: "18px",
  },

  formTitle: {
    margin: "0 0 8px 0",
    fontSize: "24px",
    fontWeight: 800,
    color: "#0f172a",
  },

  formText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#64748b",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
  },

  input: {
    minHeight: "48px",
    borderRadius: "12px",
    border: "1px solid #dbe4f0",
    background: "#f8fbff",
    color: "#0f172a",
    padding: "0 14px",
    outline: "none",
    fontSize: "14px",
  },

  successBox: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "#ecfdf5",
    border: "1px solid #86efac",
    color: "#166534",
    fontWeight: 700,
  },

  errorBox: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#b91c1c",
    fontWeight: 700,
  },

  grid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px",
    borderRadius: "24px",
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
    minHeight: "390px",
  },

  cardFeatured: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px",
    borderRadius: "24px",
    background: "linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%)",
    border: "2px solid #93c5fd",
    boxShadow: "0 18px 40px rgba(37, 99, 235, 0.10)",
    minHeight: "390px",
  },

  featuredTag: {
    position: "absolute",
    top: "16px",
    right: "16px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: 800,
    border: "1px solid #93c5fd",
  },

  planHeader: {
    marginBottom: "18px",
  },

  planTitle: {
    margin: "0 0 8px 0",
    fontSize: "26px",
    fontWeight: 800,
    color: "#0f172a",
  },

  price: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    color: "#0f172a",
  },

  priceFree: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    color: "#16a34a",
  },

  list: {
    margin: "0 0 24px 0",
    paddingLeft: "20px",
    lineHeight: 1.9,
    color: "#334155",
    flex: 1,
  },

  buttonPrimary: {
    width: "100%",
    minHeight: "50px",
    borderRadius: "14px",
    fontWeight: 800,
    fontSize: "15px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.22)",
  },

  buttonSecondary: {
    width: "100%",
    minHeight: "50px",
    borderRadius: "14px",
    fontWeight: 800,
    fontSize: "15px",
    background: "#ffffff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    cursor: "pointer",
  },

  buttonDark: {
    width: "100%",
    minHeight: "50px",
    borderRadius: "14px",
    fontWeight: 800,
    fontSize: "15px",
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
  },

  noticeBox: {
    maxWidth: "1100px",
    margin: "26px auto 0 auto",
    padding: "22px",
    borderRadius: "22px",
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.05)",
  },

  noticeTitle: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: 800,
    color: "#0f172a",
  },

  noticeText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.7,
    fontSize: "14px",
  },
};