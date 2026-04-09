import type { CSSProperties } from "react";

export default function RelatoriosPage() {
  const cards = [
    {
      title: "Condomínios monitoráveis",
      value: "1+",
      description:
        "Base iniciada com estrutura preparada para múltiplos condomínios, sítios, chácaras e pequenos residenciais.",
    },
    {
      title: "Módulos ativos",
      value: "7+",
      description:
        "Energia, cobranças, unidades, proprietários, fornecedores, dashboard e relatórios em evolução contínua.",
    },
    {
      title: "Gestão financeira",
      value: "Base pronta",
      description:
        "Estrutura preparada para relatórios de cobrança, energia, inadimplência, valores pagos e pendentes.",
    },
    {
      title: "Privacidade",
      value: "Protegida",
      description:
        "Dados internos do condomínio devem ficar restritos à administração, com foco em segurança e transparência controlada.",
    },
  ];

  const relatorios = [
    {
      title: "Relatório geral do condomínio",
      desc: "Visão ampla da operação, com unidades, proprietários, cobranças, energia e fornecedores.",
    },
    {
      title: "Relatório por unidade",
      desc: "Consulta individual com histórico de consumo, cobranças e situação operacional de cada unidade.",
    },
    {
      title: "Relatório financeiro",
      desc: "Resumo das cobranças, valores previstos, valores pagos, pendências e visão do caixa do condomínio.",
    },
    {
      title: "Relatório de energia",
      desc: "Leituras, consumo por unidade, média mensal, valor do kWh e base para identificar perdas.",
    },
    {
      title: "Relatório de rateio",
      desc: "Acompanhamento dos valores distribuídos entre unidades conforme consumo ou regra definida.",
    },
    {
      title: "Relatório de pagamentos",
      desc: "Controle de quem pagou, quem está pendente e quem está vencido no período selecionado.",
    },
    {
      title: "Relatório de inadimplência",
      desc: "Lista de cobranças em aberto e vencidas, preparada para gestão profissional do condomínio.",
    },
    {
      title: "Relatório de fornecedores",
      desc: "Base para acompanhar prestadores, fornecedores cadastrados e histórico de apoio operacional.",
    },
    {
      title: "Relatório de comunicação",
      desc: "Estrutura futura para avisos do síndico, mensagens para moradores e histórico de integração.",
    },
    {
      title: "Relatório de melhorias e reparos",
      desc: "Base futura para propostas, solicitações de manutenção, aprovações e votos dos moradores.",
    },
  ];

  const proximosPassos = [
    "Comunicação direta entre síndico, moradores, proprietários e inquilinos",
    "Área para propostas de melhorias e pedidos de reparo",
    "Botões de concorda / não concorda para decisões internas",
    "Histórico mensal de energia com média de consumo por unidade",
    "Relatórios conectados a dados reais do sistema e banco de dados",
    "Evolução para recibos, gestão de inadimplência e operação profissional",
  ];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.badge}>Aurora Condomínios • Relatórios</div>
          <h1 style={styles.title}>Central de Relatórios</h1>
          <p style={styles.subtitle}>
            Estrutura preparada para transformar dados do condomínio em visão
            clara de operação, consumo, cobrança, comunicação e crescimento com
            segurança.
          </p>
        </div>
      </section>

      <section style={styles.container}>
        <div style={styles.grid}>
          {cards.map((card) => (
            <div key={card.title} style={styles.card}>
              <span style={styles.cardTitle}>{card.title}</span>
              <strong style={styles.cardValue}>{card.value}</strong>
              <p style={styles.cardDesc}>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.container}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Relatórios planejados</h2>
            <span style={styles.counter}>{relatorios.length} itens</span>
          </div>

          <div style={styles.reportGrid}>
            {relatorios.map((item) => (
              <div key={item.title} style={styles.reportCard}>
                <strong style={styles.reportTitle}>{item.title}</strong>
                <p style={styles.reportDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.container}>
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Próximos relatórios estratégicos</h2>

          <div style={styles.list}>
            {proximosPassos.map((item) => (
              <div key={item} style={styles.item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.container}>
        <div style={styles.alert}>
          O sistema está em constante evolução e pode ter momentos de
          instabilidade durante melhorias. Esta central está sendo preparada
          para receber dados reais do banco, relatórios financeiros, consumo,
          comunicação interna e histórico de decisões do condomínio.
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f4f8ff 0%, #eef4ff 45%, #f8fbff 100%)",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "40px",
  },
  hero: {
    padding: "36px 16px 10px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px 16px",
  },
  badge: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "999px",
    display: "inline-block",
    marginBottom: "12px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "36px",
    margin: "0 0 10px",
    color: "#0f172a",
    lineHeight: 1.15,
  },
  subtitle: {
    color: "#475569",
    fontSize: "17px",
    lineHeight: 1.7,
    maxWidth: "900px",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    padding: "22px",
    borderRadius: "18px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "10px",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#2563eb",
    fontWeight: 700,
  },
  cardValue: {
    fontSize: "28px",
    display: "block",
    color: "#0f172a",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.7,
    margin: 0,
  },
  panel: {
    background: "#fff",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "18px",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  panelTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a",
  },
  counter: {
    background: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 700,
  },
  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
  },
  reportCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px",
    background: "#fcfdff",
    display: "grid",
    gap: "8px",
  },
  reportTitle: {
    color: "#0f172a",
    fontSize: "16px",
  },
  reportDesc: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  list: {
    display: "grid",
    gap: "10px",
  },
  item: {
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "#f8fbff",
    color: "#334155",
    lineHeight: 1.6,
    fontSize: "15px",
  },
  alert: {
    background: "#e0f2fe",
    padding: "16px 18px",
    borderRadius: "14px",
    color: "#0c4a6e",
    lineHeight: 1.7,
    border: "1px solid #bae6fd",
  },
};