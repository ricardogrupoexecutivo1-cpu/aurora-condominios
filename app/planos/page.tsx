"use client";

import { useMemo, useState } from "react";

type PlanCode = "start" | "pro" | "premium_multi";

type ApiSuccess = {
  ok: true;
  message?: string;
  checkoutUrl?: string | null;
  redirectTo?: string | null;
  nextAction?: "activated" | "checkout" | "configure_checkout";
  subscription?: {
    id: string;
    plan: PlanCode;
    status: string;
    amount: number;
    checkout_url?: string | null;
    customer_name?: string | null;
    customer_email?: string | null;
    customer_whatsapp?: string | null;
  };
};

type ApiError = {
  ok: false;
  error?: string;
  details?: string[];
};

type PlanCard = {
  code: PlanCode;
  title: string;
  price: string;
  badge?: string;
  description: string[];
  buttonLabel: string;
  paid: boolean;
};

const PLANS: PlanCard[] = [
  {
    code: "start",
    title: "Aurora Start",
    price: "Grátis",
    description: [
      "Até 5 unidades",
      "Cadastro básico",
      "Energia simples",
      "Comunicação limitada",
    ],
    buttonLabel: "Começar grátis",
    paid: false,
  },
  {
    code: "pro",
    title: "Aurora PRO Gestão",
    price: "R$ 29,90/mês",
    badge: "Mais vendido",
    description: [
      "Unidades ilimitadas",
      "Energia completa",
      "Cobranças completas",
      "Comunicação liberada",
      "Melhorias com votação",
    ],
    buttonLabel: "Assinar PRO",
    paid: true,
  },
  {
    code: "premium_multi",
    title: "Aurora Premium Multi",
    price: "R$ 79,90/mês",
    description: [
      "Tudo do PRO",
      "Múltiplos condomínios",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
    buttonLabel: "Assinar Premium",
    paid: true,
  },
];

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default function PlanosPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [loadingPlan, setLoadingPlan] = useState<PlanCode | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const normalizedWhatsapp = useMemo(
    () => onlyDigits(customerWhatsapp),
    [customerWhatsapp]
  );

  async function handleSubscribe(plan: PlanCode) {
    const selectedPlan = PLANS.find((item) => item.code === plan);
    if (!selectedPlan) return;

    const isPaidPlan = selectedPlan.paid;

    if (isPaidPlan && !normalizedWhatsapp) {
      setFeedback({
        type: "error",
        text: "Para assinar os planos pagos, informe um WhatsApp válido antes de continuar.",
      });
      return;
    }

    setLoadingPlan(plan);
    setFeedback({
      type: "info",
      text: isPaidPlan
        ? "Registrando seu plano e preparando o checkout..."
        : "Ativando seu plano gratuito...",
    });

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          customerName,
          customerEmail,
          customerWhatsapp: normalizedWhatsapp,
        }),
      });

      const result = (await response.json()) as ApiSuccess | ApiError;

      if (!response.ok || !result?.ok) {
        const errorMessage =
          (result as ApiError)?.details?.join(" ") ||
          (result as ApiError)?.error ||
          "Não foi possível registrar o plano agora.";
        setFeedback({
          type: "error",
          text: errorMessage,
        });
        return;
      }

      const success = result as ApiSuccess;

      setFeedback({
        type: "success",
        text:
          success.message ||
          "Plano registrado com sucesso. Aguarde o próximo passo.",
      });

      if (success.nextAction === "checkout" && success.redirectTo) {
        window.location.href = success.redirectTo;
        return;
      }
    } catch (error) {
      console.error("ERRO AO REGISTRAR PLANO:", error);
      setFeedback({
        type: "error",
        text: "O sistema está em constante atualização e pode ter momentos de instabilidade durante melhorias.",
      });
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.wrapper}>
        <div style={styles.hero}>
          <div style={styles.heroBadge}>Planos</div>
          <h1 style={styles.heroTitle}>Planos Aurora Condomínios</h1>
          <p style={styles.heroText}>
            Escolha o plano ideal e comece a organizar seu condomínio com gestão
            profissional.
          </p>
          <p style={styles.heroSubtext}>
            Estrutura comercial pronta para evolução com assinatura, cobrança e
            liberação automática por plano.
          </p>
        </div>

        <section style={styles.formCard}>
          <div style={styles.formCardHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Dados para ativação do plano</h2>
              <p style={styles.sectionText}>
                Para os planos pagos, informe seu WhatsApp para continuar com a
                assinatura. Nome e e-mail ajudam no cadastro e no suporte.
              </p>
            </div>
          </div>

          <div style={styles.formGrid}>
            <label style={styles.label}>
              <span style={styles.labelText}>Nome do responsável</span>
              <input
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Ex.: Síndico responsável"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>E-mail</span>
              <input
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="Ex.: contato@condominio.com"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span style={styles.labelText}>WhatsApp</span>
              <input
                type="text"
                value={customerWhatsapp}
                onChange={(event) => setCustomerWhatsapp(event.target.value)}
                placeholder="Ex.: (31) 99999-9999"
                style={styles.input}
              />
            </label>
          </div>

          <p style={styles.helperText}>
            Planos pagos exigem WhatsApp válido. O plano grátis pode ser iniciado
            imediatamente.
          </p>

          {feedback ? (
            <div
              style={{
                ...styles.feedback,
                ...(feedback.type === "success"
                  ? styles.feedbackSuccess
                  : feedback.type === "error"
                    ? styles.feedbackError
                    : styles.feedbackInfo),
              }}
            >
              {feedback.text}
            </div>
          ) : null}
        </section>

        <section style={styles.cardsGrid}>
          {PLANS.map((plan) => {
            const isLoading = loadingPlan === plan.code;
            const isFeatured = plan.code === "pro";

            return (
              <article
                key={plan.code}
                style={{
                  ...styles.card,
                  ...(isFeatured ? styles.cardFeatured : null),
                }}
              >
                {plan.badge ? <div style={styles.badge}>{plan.badge}</div> : null}

                <h2 style={styles.cardTitle}>{plan.title}</h2>
                <div style={styles.cardPrice}>{plan.price}</div>

                <ul style={styles.featureList}>
                  {plan.description.map((item) => (
                    <li key={item} style={styles.featureItem}>
                      <span style={styles.featureDot}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleSubscribe(plan.code)}
                  disabled={Boolean(loadingPlan)}
                  style={{
                    ...styles.button,
                    ...(plan.code === "start"
                      ? styles.buttonGhost
                      : styles.buttonPrimary),
                    ...(isLoading ? styles.buttonDisabled : null),
                  }}
                >
                  {isLoading ? "Processando..." : plan.buttonLabel}
                </button>
              </article>
            );
          })}
        </section>

        <section style={styles.footerCard}>
          <h3 style={styles.footerTitle}>Pagamento recorrente automático</h3>
          <p style={styles.footerText}>
            Após a confirmação do pagamento, o acesso será liberado e mantido
            enquanto a assinatura estiver ativa. O sistema está em constante
            atualização e pode ter momentos de instabilidade durante melhorias.
          </p>
        </section>
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
  heroBadge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(24, 119, 242, 0.08)",
    border: "1px solid rgba(24, 119, 242, 0.16)",
    color: "#1565c0",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 42px)",
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#102030",
  },
  heroText: {
    marginTop: 14,
    marginBottom: 8,
    color: "#31485d",
    fontSize: 17,
    lineHeight: 1.6,
    maxWidth: 760,
  },
  heroSubtext: {
    margin: 0,
    color: "#567086",
    fontSize: 15,
    lineHeight: 1.6,
    maxWidth: 780,
  },
  formCard: {
    background: "#ffffff",
    border: "1px solid rgba(66, 124, 171, 0.14)",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 18px 50px rgba(31, 80, 124, 0.06)",
    marginBottom: 24,
  },
  formCardHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
    color: "#102030",
  },
  sectionText: {
    marginTop: 10,
    marginBottom: 0,
    color: "#5b7287",
    lineHeight: 1.6,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 800,
    color: "#1e3447",
  },
  input: {
    height: 50,
    borderRadius: 14,
    border: "1px solid #d6e3ef",
    background: "#f9fcff",
    color: "#173042",
    padding: "0 14px",
    outline: "none",
    fontSize: 15,
    boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.03)",
  },
  helperText: {
    marginTop: 14,
    marginBottom: 0,
    color: "#6c8398",
    fontSize: 14,
    fontWeight: 700,
  },
  feedback: {
    marginTop: 16,
    borderRadius: 14,
    padding: "14px 16px",
    fontWeight: 800,
    lineHeight: 1.5,
  },
  feedbackSuccess: {
    background: "#edf9f0",
    border: "1px solid #bfe8c8",
    color: "#1f6f35",
  },
  feedbackError: {
    background: "#fff1f1",
    border: "1px solid #f2c6c6",
    color: "#a02b2b",
  },
  feedbackInfo: {
    background: "#eef6ff",
    border: "1px solid #c8def7",
    color: "#1d5f9d",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },
  card: {
    position: "relative",
    background: "#ffffff",
    border: "1px solid rgba(66, 124, 171, 0.14)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 18px 50px rgba(31, 80, 124, 0.06)",
  },
  cardFeatured: {
    border: "1px solid rgba(43, 149, 255, 0.35)",
    boxShadow: "0 22px 60px rgba(33, 111, 177, 0.12)",
    transform: "translateY(-2px)",
  },
  badge: {
    display: "inline-flex",
    marginBottom: 14,
    padding: "6px 12px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #1ea7ff 0%, #1572ff 100%)",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.35,
  },
  cardTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 900,
    color: "#102030",
  },
  cardPrice: {
    marginTop: 12,
    marginBottom: 18,
    fontSize: 30,
    fontWeight: 900,
    color: "#1565c0",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: 10,
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    color: "#486175",
    lineHeight: 1.5,
  },
  featureDot: {
    color: "#1e88e5",
    fontWeight: 900,
    minWidth: 16,
  },
  button: {
    width: "100%",
    marginTop: 22,
    height: 50,
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 15,
    transition: "transform 0.15s ease, opacity 0.15s ease",
  },
  buttonPrimary: {
    border: "none",
    background: "linear-gradient(135deg, #24b0ff 0%, #156ef5 100%)",
    color: "#ffffff",
    boxShadow: "0 12px 24px rgba(21, 110, 245, 0.18)",
  },
  buttonGhost: {
    border: "1px solid #d7e4ef",
    background: "#f8fbff",
    color: "#163045",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  footerCard: {
    marginTop: 24,
    background: "#ffffff",
    border: "1px solid rgba(66, 124, 171, 0.14)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 18px 50px rgba(31, 80, 124, 0.06)",
  },
  footerTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
    color: "#102030",
  },
  footerText: {
    marginTop: 10,
    marginBottom: 0,
    color: "#5b7287",
    lineHeight: 1.6,
  },
};