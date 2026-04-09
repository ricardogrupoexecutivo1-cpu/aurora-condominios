import "./globals.css";
import type { CSSProperties, ReactNode } from "react";

export const metadata = {
  title: "Aurora Condomínios",
  description: "Sistema de gestão de condomínios",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={styles.body}>
        <header style={styles.header}>
          <div style={styles.container}>
            <a href="/" style={styles.logoLink}>
              <div style={styles.logoBox}>
                <img
                  src="/logo.png"
                  alt="Aurora Condomínios"
                  style={styles.logoImg}
                />
              </div>
            </a>

            <nav style={styles.nav}>
              <a href="/dashboard" style={styles.linkMain}>
                Dashboard
              </a>

              <a href="/" style={styles.link}>
                Home
              </a>

              <a href="/condominios" style={styles.link}>
                Condomínios
              </a>

              <a href="/unidades" style={styles.link}>
                Unidades
              </a>

              <a href="/proprietarios" style={styles.link}>
                Proprietários
              </a>

              <a href="/cobrancas" style={styles.link}>
                Cobranças
              </a>

              <a href="/energia" style={styles.link}>
                Energia
              </a>

              <a href="/comunicacao" style={styles.link}>
                Comunicação
              </a>

              <a href="/melhorias" style={styles.link}>
                Melhorias
              </a>

              <a href="/fornecedores" style={styles.link}>
                Fornecedores
              </a>

              <a href="/relatorios" style={styles.link}>
                Relatórios
              </a>

              <a href="/planos" style={styles.link}>
                Planos
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}

const styles: Record<string, CSSProperties> = {
  body: {
    margin: 0,
    background: "#f8fbff",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    background: "rgba(255,255,255,0.95)",
    borderBottom: "1px solid #dbe4f0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(8px)",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },

  logoLink: {
    textDecoration: "none",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
  },

  logoImg: {
    width: "52px",
    height: "52px",
    objectFit: "contain",
    display: "block",
  },

  nav: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  link: {
    textDecoration: "none",
    color: "#334155",
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 700,
  },

  linkMain: {
    textDecoration: "none",
    color: "#ffffff",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    padding: "9px 14px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "14px",
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.22)",
  },
};