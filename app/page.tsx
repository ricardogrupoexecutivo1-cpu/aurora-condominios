export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Aurora Condomínios</h1>

        <p style={styles.subtitle}>
          Sistema para controle de condomínio de sítios, chácaras e pequenos condomínios.
        </p>

        <div style={styles.buttons}>
          <a href="/dashboard" style={styles.buttonMain}>
            Acessar painel do síndico
          </a>

          <a href="/condominios" style={styles.button}>
            Ir para condomínios
          </a>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fbff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  subtitle: {
    marginBottom: "20px",
    color: "#555",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  buttonMain: {
    padding: "12px 18px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  button: {
    padding: "12px 18px",
    background: "#e5e7eb",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#000",
  },
};