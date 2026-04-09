import type { CSSProperties } from "react";

export default function VendasPage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.logoWrap}>
            <img src="/logo.png" alt="Aurora Condomínios" style={styles.logo} />
          </div>

          <p style={styles.badge}>Aurora Condomínios • Página Comercial</p>

          <h1 style={styles.title}>
            Organize seu condomínio com mais controle, transparência e praticidade
          </h1>

          <p style={styles.subtitle}>
            Um sistema moderno para síndicos, administradores, condomínios de
            sítios, chácaras e pequenos residenciais. Controle cobranças,
            energia, comunicação, melhorias e operação em um só lugar.
          </p>

          <div style={styles.heroButtons}>
            <a
              href="https://wa.me/5531997490074?text=Olá,%20quero%20saber%20mais%20sobre%20o%20Aurora%20Condomínios"
              target="_blank"
              style={styles.buttonMain}
            >
              Falar no WhatsApp
            </a>

            <a href="/planos" style={styles.buttonSecondary}>
              Ver planos
            </a>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>O que o Aurora Condomínios resolve</h2>

          <div style={styles.grid3}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Cobrança organizada</h3>
              <p style={styles.cardText}>
                Lance taxa de condomínio, energia, valores extras e acompanhe
                status de pagamento de forma simples.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Energia com cálculo automático</h3>
              <p style={styles.cardText}>
                Registre leituras, acompanhe consumo e tenha base para divisão
                justa e transparente.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Comunicação centralizada</h3>
              <p style={styles.cardText}>
                Avise moradores, proprietários e inquilinos em um canal único,
                com histórico organizado.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Melhorias e reparos</h3>
              <p style={styles.cardText}>
                Registre propostas, acompanhe solicitações e organize decisões
                internas com votação.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Mais transparência</h3>
              <p style={styles.cardText}>
                O síndico acompanha a operação com visão mais clara e o
                condomínio ganha organização.
              </p>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Base para crescer</h3>
              <p style={styles.cardText}>
                Sistema preparado para evoluir com relatórios, histórico,
                inadimplência privada e operação profissional.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.sectionHighlight}>
          <div style={styles.highlightLeft}>
            <h2 style={styles.sectionTitle}>Ideal para</h2>
            <ul style={styles.list}>
              <li>Condomínios pequenos</li>
              <li>Condomínios de sítios</li>
              <li>Chácaras e loteamentos</li>
              <li>Síndicos que querem mais controle</li>
              <li>Operações que ainda fazem tudo no improviso</li>
            </ul>
          </div>

          <div style={styles.highlightRight}>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Plano mais procurado</span>
              <strong style={styles.metricValue}>PRO — R$ 29/mês</strong>
            </div>

            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Começo rápido</span>
              <strong style={styles.metricValue}>Implantação simples</strong>
            </div>

            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Atendimento inicial</span>
              <strong style={styles.metricValue}>Direto no WhatsApp</strong>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Planos</h2>

          <div style={styles.grid3}>
            <div style={styles.planCard}>
              <h3 style={styles.planTitle}>Básico</h3>
              <p style={styles.planPrice}>Grátis</p>
              <ul style={styles.list}>
                <li>Até 5 unidades</li>
                <li>Cadastro básico</li>
                <li>Energia simples</li>
                <li>Comunicação limitada</li>
              </ul>
              <a href="/planos" style={styles.planButtonLight}>
                Começar
              </a>
            </div>

            <div style={styles.planCardFeatured}>
              <div style={styles.featuredBadge}>Mais vendido</div>
              <h3 style={styles.planTitle}>PRO</h3>
              <p style={styles.planPrice}>R$ 29/mês</p>
              <ul style={styles.list}>
                <li>Unidades ilimitadas</li>
                <li>Energia completa</li>
                <li>Cobranças completas</li>
                <li>Comunicação liberada</li>
                <li>Melhorias com votação</li>
              </ul>
              <a
                href="https://wa.me/5531997490074?text=Olá,%20quero%20assinar%20o%20Plano%20PRO%20do%20Aurora%20Condomínios"
                target="_blank"
                style={styles.planButtonMain}
              >
                Assinar PRO
              </a>
            </div>

            <div style={styles.planCard}>
              <h3 style={styles.planTitle}>Premium</h3>
              <p style={styles.planPrice}>R$ 79/mês</p>
              <ul style={styles.list}>
                <li>Tudo do PRO</li>
                <li>Múltiplos condomínios</li>
                <li>Relatórios avançados</li>
                <li>Suporte prioritário</li>
              </ul>
              <a
                href="https://wa.me/5531997490074?text=Olá,%20quero%20assinar%20o%20Plano%20Premium%20do%20Aurora%20Condomínios"
                target="_blank"
                style={styles.planButtonLight}
              >
                Assinar Premium
              </a>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Quer começar a organizar seu condomínio agora?</h2>
          <p style={styles.ctaText}>
            Fale diretamente no WhatsApp, veja os planos e comece a implantação
            com uma solução prática, moderna e em evolução constante.
          </p>

          <div style={styles.heroButtons}>
            <a
              href="https://wa.me/5531997490074?text=Olá,%20quero%20implantar%20o%20Aurora%20Condomínios"
              target="_blank"
              style={styles.buttonMain}
            >
              Quero implantar agora
            </a>

            <a href="/dashboard" style={styles.buttonSecondary}>
              Ver sistema
            </a>
          </div>
        </section>

        <div style={styles.notice}>
          O sistema está em constante atualização e pode ter momentos de
          instabilidade durante melhorias. A proposta é evoluir com segurança,
          sem perder o que já está funcionando.
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f4f8ff 0%, #eef4ff 45%, #f8fbff 100%)",
    padding: "32px 16px 48px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gap: "22px",
  },
  hero: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "34px 24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
    textAlign: "center",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "12px",
  },
  logo: {
    width: "110px",
    height: "110px",
    objectFit: "contain",
  },
  badge: {
    margin: 0,
    color: "#2563eb",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  title: {
    margin: "12px auto",
    maxWidth: "920px",
    fontSize: "40px",
    lineHeight: 1.1,
    color: "#0f172a",
  },
  subtitle: {
    margin: "0 auto",
    maxWidth: "900px",
    fontSize: "17px",
    lineHeight: 1.7,
    color: "#475569",
  },
  heroButtons: {
    marginTop: "24px",
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  buttonMain: {
    padding: "14px 22px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 700,
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.25)",
  },
  buttonSecondary: {
    padding: "14px 22px",
    background: "#e5e7eb",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#111827",
    fontWeight: 700,
  },
  section: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "18px",
  },
  sectionHighlight: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%)",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #bfdbfe",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "20px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fcfdff",
    borderRadius: "20px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    display: "grid",
    gap: "10px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#0f172a",
  },
  cardText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  highlightLeft: {
    display: "grid",
    gap: "14px",
  },
  highlightRight: {
    display: "grid",
    gap: "14px",
    alignContent: "start",
  },
  metricCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid #dbe4f0",
    display: "grid",
    gap: "6px",
  },
  metricLabel: {
    color: "#64748b",
    fontSize: "14px",
  },
  metricValue: {
    color: "#0f172a",
    fontSize: "22px",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: 1.9,
    fontSize: "15px",
    textAlign: "left",
  },
  planCard: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "20px",
    border: "1px solid #dbe4f0",
    display: "grid",
    gap: "12px",
  },
  planCardFeatured: {
    background: "#eef4ff",
    padding: "22px",
    borderRadius: "20px",
    border: "2px solid #2563eb",
    display: "grid",
    gap: "12px",
    position: "relative",
  },
  featuredBadge: {
    position: "absolute",
    top: "-12px",
    right: "16px",
    background: "#2563eb",
    color: "#ffffff",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },
  planTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a",
  },
  planPrice: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    color: "#1d4ed8",
  },
  planButtonMain: {
    display: "block",
    textAlign: "center",
    padding: "12px 16px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 700,
  },
  planButtonLight: {
    display: "block",
    textAlign: "center",
    padding: "12px 16px",
    background: "#e5e7eb",
    color: "#111827",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 700,
  },
  ctaSection: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px 24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    textAlign: "center",
  },
  ctaTitle: {
    margin: 0,
    fontSize: "30px",
    color: "#0f172a",
  },
  ctaText: {
    margin: "12px auto 0",
    maxWidth: "840px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "16px",
  },
  notice: {
    padding: "14px 16px",
    borderRadius: "14px",
    background: "#e0f2fe",
    color: "#0c4a6e",
    lineHeight: 1.7,
    fontSize: "14px",
  },
};