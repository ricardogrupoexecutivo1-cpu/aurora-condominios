import type { CSSProperties } from "react";

export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.logoHero}>
            <img src="/logo.png" alt="Aurora Condomínios" style={styles.logoHeroImg} />
          </div>

          <h1 style={styles.title}>
            Gestão moderna para condomínios, sítios, chácaras e pequenos residenciais
          </h1>

          <p style={styles.subtitle}>
            Organize unidades, proprietários, cobranças, energia, fornecedores,
            comunicação com moradores e propostas de melhorias em um só sistema.
            Plataforma em evolução contínua, criada para facilitar a operação do
            síndico e melhorar a transparência do condomínio.
          </p>

          <div style={styles.buttons}>
            <a href="/dashboard" style={styles.buttonMain}>
              Acessar painel do síndico
            </a>

            <a href="/cobrancas" style={styles.button}>
              Ver cobranças
            </a>

            <a href="/energia" style={styles.button}>
              Ver energia
            </a>

            <a href="/comunicacao" style={styles.button}>
              Comunicação
            </a>

            <a href="/melhorias" style={styles.button}>
              Melhorias e reparos
            </a>
          </div>
        </section>

        <section style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Controle financeiro</h2>
            <p style={styles.cardText}>
              Lance taxa de condomínio, energia, valores extras e acompanhe
              cobranças pendentes, pagas e vencidas de forma simples.
            </p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Energia com cálculo automático</h2>
            <p style={styles.cardText}>
              Informe a conta da operadora, registre leituras das unidades e
              calcule automaticamente o valor individual por consumo real.
            </p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Gestão de unidades e proprietários</h2>
            <p style={styles.cardText}>
              Organize os cadastros do condomínio, acompanhe vínculos e mantenha
              a base operacional sempre atualizada.
            </p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Comunicação com moradores</h2>
            <p style={styles.cardText}>
              Registre avisos, comunicados, cobranças internas e mensagens de
              manutenção para moradores, proprietários e inquilinos.
            </p>
            <a href="/comunicacao" style={styles.linkInline}>
              Abrir módulo de comunicação
            </a>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Sugestões, melhorias e reparos</h2>
            <p style={styles.cardText}>
              Receba propostas de melhoria, pedidos de reparo e acompanhe a
              votação com botões de concorda e não concorda.
            </p>
            <a href="/melhorias" style={styles.linkInline}>
              Abrir módulo de melhorias
            </a>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Expansão profissional</h2>
            <p style={styles.cardText}>
              O sistema está sendo preparado para crescer com relatórios,
              histórico, inadimplência, comunicação e operação completa de
              condomínio.
            </p>
          </div>
        </section>

        <section style={styles.bottomCard}>
          <h2 style={styles.bottomTitle}>Próximos recursos estratégicos</h2>

          <ul style={styles.list}>
            <li>Canal de comunicação do síndico com moradores e proprietários</li>
            <li>Área de propostas de melhoria e reparos com votação</li>
            <li>Botão de concorda / não concorda para decisões internas</li>
            <li>Histórico mensal de energia e consumo por unidade</li>
            <li>Evolução da cobrança para gestão profissional completa</li>
            <li>Maior integração entre síndico, moradores e operação</li>
          </ul>

          <div style={styles.quickLinks}>
            <a href="/dashboard" style={styles.quickLink}>
              Dashboard
            </a>
            <a href="/cobrancas" style={styles.quickLink}>
              Cobranças
            </a>
            <a href="/energia" style={styles.quickLink}>
              Energia
            </a>
            <a href="/comunicacao" style={styles.quickLink}>
              Comunicação
            </a>
            <a href="/melhorias" style={styles.quickLink}>
              Melhorias
            </a>
            <a href="/relatorios" style={styles.quickLink}>
              Relatórios
            </a>
          </div>

          <div style={styles.notice}>
            O sistema está em constante atualização e pode ter momentos de
            instabilidade durante melhorias. A proposta é evoluir com segurança,
            um passo por vez, sem perder o que já está funcionando.
          </div>
        </section>
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
    gap: "20px",
  },
  hero: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px 24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
    textAlign: "center",
  },
  logoHero: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "14px",
  },
  logoHeroImg: {
    width: "110px",
    height: "110px",
    objectFit: "contain",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "38px",
    lineHeight: 1.15,
    color: "#0f172a",
  },
  subtitle: {
    margin: "0 auto",
    maxWidth: "900px",
    fontSize: "17px",
    lineHeight: 1.7,
    color: "#475569",
  },
  buttons: {
    marginTop: "24px",
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  buttonMain: {
    padding: "14px 20px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 700,
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.25)",
  },
  button: {
    padding: "14px 20px",
    background: "#e5e7eb",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#111827",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "22px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
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
  linkInline: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
  },
  bottomCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "16px",
  },
  bottomTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: 1.9,
    fontSize: "15px",
  },
  quickLinks: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  quickLink: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
    border: "1px solid #bfdbfe",
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