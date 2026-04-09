"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type CobrancaStatus = "pendente" | "pago" | "vencido";

type Cobranca = {
  id: string;
  unidade: string;
  proprietario: string;
  competencia: string;
  vencimento: string;
  taxaCondominio: number;
  energia: number;
  outros: number;
  valorTotal: number;
  status: CobrancaStatus;
};

type Unidade = {
  codigo: string;
  [key: string]: any;
};

type Proprietario = {
  nome: string;
  unidade: string;
  [key: string]: any;
};

const STORAGE_UNIDADES = "aurora_condominios_unidades";
const STORAGE_PROPRIETARIOS = "aurora_condominios_proprietarios";
const STORAGE_COBRANCAS = "aurora_condominios_cobrancas";

function gerarCompetenciaAtual() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = String(agora.getFullYear());
  return `${mes}/${ano}`;
}

function gerarVencimentoPadrao() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth() + 1;
  return `${ano}-${String(mes).padStart(2, "0")}-10`;
}

export default function CobrancasPage() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [taxaPadrao, setTaxaPadrao] = useState("0");
  const [competenciaPadrao, setCompetenciaPadrao] = useState(gerarCompetenciaAtual());
  const [vencimentoPadrao, setVencimentoPadrao] = useState(gerarVencimentoPadrao());
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem(STORAGE_COBRANCAS) || "[]");

    if (Array.isArray(salvas) && salvas.length > 0) {
      setCobrancas(salvas);
      return;
    }

    const unidades: Unidade[] = JSON.parse(
      localStorage.getItem(STORAGE_UNIDADES) || "[]"
    );
    const proprietarios: Proprietario[] = JSON.parse(
      localStorage.getItem(STORAGE_PROPRIETARIOS) || "[]"
    );

    const lista: Cobranca[] = unidades.map((u) => {
      const dono = proprietarios.find((p) => p.unidade === u.codigo);

      return {
        id: `${u.codigo}-${gerarCompetenciaAtual()}`,
        unidade: u.codigo,
        proprietario: dono?.nome || "Não vinculado",
        competencia: gerarCompetenciaAtual(),
        vencimento: gerarVencimentoPadrao(),
        taxaCondominio: 0,
        energia: 0,
        outros: 0,
        valorTotal: 0,
        status: "pendente",
      };
    });

    setCobrancas(lista);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_COBRANCAS, JSON.stringify(cobrancas));
  }, [cobrancas]);

  function recalcular(item: Cobranca) {
    const valorTotal =
      Number(item.taxaCondominio || 0) +
      Number(item.energia || 0) +
      Number(item.outros || 0);

    return {
      ...item,
      valorTotal: Number(valorTotal.toFixed(2)),
    };
  }

  function atualizarCampo<K extends keyof Cobranca>(
    id: string,
    campo: K,
    valor: Cobranca[K]
  ) {
    setCobrancas((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return recalcular({ ...c, [campo]: valor });
      })
    );
  }

  function aplicarTaxaParaTodos() {
    const taxa = Number(taxaPadrao || 0);

    setCobrancas((prev) =>
      prev.map((c) =>
        recalcular({
          ...c,
          competencia: competenciaPadrao,
          vencimento: vencimentoPadrao,
          taxaCondominio: taxa,
        })
      )
    );

    setMsg("Taxa de condomínio aplicada para todas as unidades 🚀");
    setTimeout(() => setMsg(""), 2500);
  }

  const resumo = useMemo(() => {
    const total = cobrancas.reduce((acc, item) => acc + Number(item.valorTotal || 0), 0);
    const pagos = cobrancas
      .filter((item) => item.status === "pago")
      .reduce((acc, item) => acc + Number(item.valorTotal || 0), 0);
    const pendentes = cobrancas
      .filter((item) => item.status === "pendente")
      .reduce((acc, item) => acc + Number(item.valorTotal || 0), 0);
    const vencidos = cobrancas
      .filter((item) => item.status === "vencido")
      .reduce((acc, item) => acc + Number(item.valorTotal || 0), 0);

    return {
      total,
      pagos,
      pendentes,
      vencidos,
      quantidade: cobrancas.length,
    };
  }, [cobrancas]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <div>
            <p style={styles.badge}>Aurora Condomínios • Cobranças</p>
            <h1 style={styles.title}>Cobrança mensal do condomínio</h1>
            <p style={styles.description}>
              Defina a taxa mensal, some energia e outros valores por unidade e
              acompanhe o total previsto, pago e pendente de forma simples.
            </p>
          </div>
        </div>

        <section style={styles.topCard}>
          <h2 style={styles.sectionTitle}>Lançamento rápido da taxa mensal</h2>

          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Competência</label>
              <input
                style={styles.input}
                value={competenciaPadrao}
                onChange={(e) => setCompetenciaPadrao(e.target.value)}
                placeholder="Ex.: 04/2026"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Vencimento padrão</label>
              <input
                type="date"
                style={styles.input}
                value={vencimentoPadrao}
                onChange={(e) => setVencimentoPadrao(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Taxa de condomínio (R$)</label>
              <input
                type="number"
                style={styles.input}
                value={taxaPadrao}
                onChange={(e) => setTaxaPadrao(e.target.value)}
                placeholder="Ex.: 250"
              />
            </div>
          </div>

          <button style={styles.primaryButton} onClick={aplicarTaxaParaTodos}>
            Aplicar taxa para todas as unidades
          </button>

          {msg ? <div style={styles.success}>{msg}</div> : null}
        </section>

        <section style={styles.summaryGrid}>
          <ResumoCard title="Total previsto" value={`R$ ${resumo.total.toFixed(2)}`} />
          <ResumoCard title="Total pago" value={`R$ ${resumo.pagos.toFixed(2)}`} />
          <ResumoCard title="Pendentes" value={`R$ ${resumo.pendentes.toFixed(2)}`} />
          <ResumoCard title="Vencidos" value={`R$ ${resumo.vencidos.toFixed(2)}`} />
        </section>

        <section style={styles.infoCard}>
          <h2 style={styles.sectionTitle}>Resumo financeiro</h2>
          <ul style={styles.list}>
            <li>Total de cobranças geradas: {resumo.quantidade}</li>
            <li>Taxa mensal configurável por condomínio</li>
            <li>Energia individual pode ser somada por unidade</li>
            <li>Outros lançamentos permitem água, manutenção ou rateios extras</li>
          </ul>
        </section>

        <section style={styles.listCard}>
          <div style={styles.listHeader}>
            <h2 style={styles.sectionTitle}>Cobranças por unidade</h2>
            <span style={styles.counter}>{cobrancas.length} unidade(s)</span>
          </div>

          {cobrancas.length === 0 ? (
            <div style={styles.empty}>
              Nenhuma cobrança encontrada. Cadastre unidades e proprietários para iniciar.
            </div>
          ) : (
            <div style={styles.cardsGrid}>
              {cobrancas.map((c) => (
                <div key={c.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <strong style={styles.cardTitle}>Unidade: {c.unidade}</strong>
                    <span style={statusStyle(c.status)}>{c.status}</span>
                  </div>

                  <div style={styles.owner}>Proprietário: {c.proprietario}</div>

                  <div style={styles.formGrid}>
                    <div style={styles.field}>
                      <label style={styles.label}>Competência</label>
                      <input
                        style={styles.input}
                        value={c.competencia}
                        onChange={(e) =>
                          atualizarCampo(c.id, "competencia", e.target.value)
                        }
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Vencimento</label>
                      <input
                        type="date"
                        style={styles.input}
                        value={c.vencimento}
                        onChange={(e) =>
                          atualizarCampo(c.id, "vencimento", e.target.value)
                        }
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Taxa condomínio (R$)</label>
                      <input
                        type="number"
                        style={styles.input}
                        value={c.taxaCondominio}
                        onChange={(e) =>
                          atualizarCampo(
                            c.id,
                            "taxaCondominio",
                            Number(e.target.value || 0)
                          )
                        }
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Energia (R$)</label>
                      <input
                        type="number"
                        style={styles.input}
                        value={c.energia}
                        onChange={(e) =>
                          atualizarCampo(
                            c.id,
                            "energia",
                            Number(e.target.value || 0)
                          )
                        }
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Outros (R$)</label>
                      <input
                        type="number"
                        style={styles.input}
                        value={c.outros}
                        onChange={(e) =>
                          atualizarCampo(
                            c.id,
                            "outros",
                            Number(e.target.value || 0)
                          )
                        }
                      />
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>Status</label>
                      <select
                        style={styles.input}
                        value={c.status}
                        onChange={(e) =>
                          atualizarCampo(c.id, "status", e.target.value as CobrancaStatus)
                        }
                      >
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                        <option value="vencido">Vencido</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.totalBox}>
                    <span style={styles.totalLabel}>Valor total da cobrança</span>
                    <strong style={styles.totalValue}>
                      R$ {Number(c.valorTotal || 0).toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div style={styles.notice}>
          O sistema está em constante atualização e pode ter momentos de instabilidade
          durante melhorias. Esta tela já prepara a base para inadimplência, recibos,
          histórico mensal e cobrança profissional.
        </div>
      </div>
    </main>
  );
}

function ResumoCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={styles.summaryCard}>
      <span style={styles.summaryLabel}>{title}</span>
      <strong style={styles.summaryValue}>{value}</strong>
    </div>
  );
}

function statusStyle(status: CobrancaStatus): CSSProperties {
  const base: CSSProperties = {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  };

  if (status === "pago") {
    return {
      ...base,
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
  }

  if (status === "vencido") {
    return {
      ...base,
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    };
  }

  return {
    ...base,
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
  };
}

const styles: Record<string, CSSProperties> = {
  page: {
    background:
      "linear-gradient(180deg, #f4f8ff 0%, #eef4ff 45%, #f8fbff 100%)",
    minHeight: "100vh",
    padding: "24px 16px 40px",
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
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
  },
  badge: {
    margin: 0,
    color: "#2563eb",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  title: {
    margin: "10px 0 8px",
    fontSize: "32px",
    lineHeight: 1.15,
    color: "#0f172a",
  },
  description: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.6,
    maxWidth: "880px",
  },
  topCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "16px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#0f172a",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
  },
  field: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#334155",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    fontSize: "15px",
    outline: "none",
  },
  primaryButton: {
    border: "none",
    borderRadius: "14px",
    padding: "15px 18px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.28)",
    width: "fit-content",
  },
  success: {
    background: "#ecfdf5",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "14px 16px",
    borderRadius: "12px",
    fontWeight: 700,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
  },
  summaryCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "8px",
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: "14px",
  },
  summaryValue: {
    color: "#0f172a",
    fontSize: "24px",
  },
  infoCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "16px",
  },
  list: {
    margin: 0,
    paddingLeft: "18px",
    color: "#475569",
    lineHeight: 1.8,
  },
  listCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "18px",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  counter: {
    background: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 700,
  },
  empty: {
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "22px",
    textAlign: "center",
    color: "#64748b",
    background: "#f8fbff",
  },
  cardsGrid: {
    display: "grid",
    gap: "16px",
  },
  card: {
    background: "#fcfdff",
    padding: "18px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    display: "grid",
    gap: "16px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  cardTitle: {
    fontSize: "18px",
    color: "#0f172a",
  },
  owner: {
    color: "#475569",
    fontSize: "15px",
  },
  totalBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    borderRadius: "16px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    flexWrap: "wrap",
  },
  totalLabel: {
    color: "#1e3a8a",
    fontWeight: 700,
  },
  totalValue: {
    color: "#1d4ed8",
    fontSize: "24px",
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