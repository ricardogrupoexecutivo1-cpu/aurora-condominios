export default function RelatoriosPage() {
  const cards = [
    {
      title: "Condomínios monitoráveis",
      value: "1+",
      description:
        "Base iniciada com o Condomínio Boa Esperança e preparada para múltiplos condomínios.",
    },
    {
      title: "Módulos ativos",
      value: "7",
      description:
        "Energia, água, luz externa, gás, taxa fixa, extras e campos personalizados.",
    },
    {
      title: "Relatórios",
      value: "Base pronta",
      description:
        "Estrutura preparada para relatórios financeiros, consumo, unidades e pagamentos.",
    },
    {
      title: "Privacidade",
      value: "Protegida",
      description:
        "Dados sensíveis e inadimplência visíveis apenas para o síndico.",
    },
  ];

  const relatorios = [
    "Relatório geral do condomínio",
    "Relatório por unidade",
    "Relatório financeiro",
    "Relatório de energia",
    "Relatório de rateio",
    "Relatório de pagamentos",
    "Relatório de inadimplência",
    "Relatório de fornecedores",
  ];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.badge}>Aurora Condomínios • Relatórios</div>
          <h1 style={styles.title}>Central de Relatórios</h1>
          <p style={styles.subtitle}>
            Base inicial de relatórios do sistema. Estrutura pensada para gestão real e expansão futura.
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
          <h2 style={styles.panelTitle}>Relatórios planejados</h2>

          <div style={styles.list}>
            {relatorios.map((item) => (
              <div key={item} style={styles.item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.container}>
        <div style={styles.alert}>
          Sistema em constante evolução. Relatórios completos serão integrados com dados reais e banco de dados.
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fbff",
    fontFamily: "Arial, sans-serif",
  },
  hero: {
    padding: "40px 20px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px",
  },
  badge: {
    background: "#2563eb",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "8px",
    display: "inline-block",
    marginBottom: "10px",
  },
  title: {
    fontSize: "32px",
    margin: 0,
  },
  subtitle: {
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#2563eb",
  },
  cardValue: {
    fontSize: "24px",
    display: "block",
    margin: "8px 0",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#555",
  },
  panel: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },
  panelTitle: {
    marginBottom: "16px",
  },
  list: {
    display: "grid",
    gap: "10px",
  },
  item: {
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "8px",
  },
  alert: {
    background: "#e0f2fe",
    padding: "16px",
    borderRadius: "10px",
    color: "#0369a1",
  },
};