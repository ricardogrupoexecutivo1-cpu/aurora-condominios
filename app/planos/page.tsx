import type { CSSProperties } from "react";

export default function PlanosPage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Planos Aurora Condomínios</h1>

        <p style={styles.subtitle}>
          Escolha o plano ideal e comece a organizar seu condomínio com gestão profissional.
        </p>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.planTitle}>Aurora Start</h2>
            <p style={styles.price}>Grátis</p>

            <ul style={styles.list}>
              <li>Até 5 unidades</li>
              <li>Cadastro básico</li>
              <li>Energia simples</li>
              <li>Comunicação limitada</li>
            </ul>

            <a href="/dashboard" style={styles.button}>
              Começar grátis
            </a>
          </div>

          <div style={styles.cardHighlight}>
            <div style={styles.badge}>Mais vendido</div>

            <h2 style={styles.planTitle}>Aurora PRO Gestão</h2>
            <p style={styles.price}>R$ 29,90/mês</p>

            <ul style={styles.list}>
              <li>Unidades ilimitadas</li>
              <li>Energia completa</li>
              <li>Cobranças completas</li>
              <li>Comunicação liberada</li>
              <li>Melhorias com votação</li>
            </ul>

            <a
              href="https://www.asaas.com/c/blz52keognqz163o"
              target="_blank"
              rel="noreferrer"
              style={styles.buttonMain}
            >
              Assinar PRO
            </a>
          </div>

          <div style={styles.card}>
            <h2 style={styles.planTitle}>Aurora Premium Multi</h2>
            <p style={styles.price}>R$ 79,90/mês</p>

            <ul style={styles.list}>
              <li>Tudo do PRO</li>
              <li>Múltiplos condomínios</li>
              <li>Relatórios avançados</li>
              <li>Suporte prioritário</li>
            </ul>

            <a
              href="https://www.asaas.com/c/ztcdn5e9iebyg984"
              target="_blank"
              rel="noreferrer"
              style={styles.button}
            >
              Assinar Premium
            </a>
          </div>
        </div>

        <div style={styles.notice}>
          Pagamento recorrente automático. Após a confirmação, o acesso será liberado e mantido enquanto a assinatura estiver ativa.
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fbff",
    padding: "30px",
    fontFamily: "Arial",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },

  title: {
    fontSize: "32px",
  },

  subtitle: {
    color: "#555",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },

  cardHighlight: {
    background: "#eef4ff",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #2563eb",
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: "-10px",
    right: "10px",
    background: "#2563eb",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  planTitle: {
    fontSize: "22px",
  },

  price: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "10px 0",
  },

  list: {
    textAlign: "left",
    marginBottom: "20px",
  },

  button: {
    display: "block",
    padding: "10px",
    background: "#e5e7eb",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#000",
  },

  buttonMain: {
    display: "block",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  notice: {
    marginTop: "30px",
    background: "#e0f2fe",
    padding: "15px",
    borderRadius: "10px",
  },
};