import "./globals.css";

export const metadata = {
  title: "Aurora Condomínios",
  description: "Sistema de gestão de condomínios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body style={styles.body}>
        <header style={styles.header}>
          <div style={styles.container}>
            <div style={styles.logo}>Aurora Condomínios</div>

            <nav style={styles.nav}>
              <a href="/dashboard" style={styles.linkMain}>
                Dashboard
              </a>

              <a href="/" style={styles.link}>Home</a>
              <a href="/condominios" style={styles.link}>Condomínios</a>
              <a href="/unidades" style={styles.link}>Unidades</a>
              <a href="/proprietarios" style={styles.link}>Proprietários</a>
              <a href="/cobrancas" style={styles.link}>Cobranças</a>
              <a href="/energia" style={styles.link}>Energia</a>
              <a href="/fornecedores" style={styles.link}>Fornecedores</a>
              <a href="/relatorios" style={styles.link}>Relatórios</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    background: "#f8fbff",
    fontFamily: "Arial",
  },

  header: {
    background: "#fff",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  logo: {
    fontWeight: "bold",
    color: "#2563eb",
  },

  nav: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  link: {
    textDecoration: "none",
    color: "#333",
  },

  linkMain: {
    textDecoration: "none",
    color: "#fff",
    background: "#2563eb",
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};