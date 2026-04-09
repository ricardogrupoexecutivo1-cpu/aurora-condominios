"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type EnergiaItem = {
  id: string;
  unidade: string;
  consumo: number;
  valor_conta: number;
  valor_calculado: number;
  mes: string;
  created_at?: string;
};

export default function EnergiaPage() {
  const [unidade, setUnidade] = useState("");
  const [mes, setMes] = useState("");

  const [leituraAnterior, setLeituraAnterior] = useState("");
  const [leituraAtual, setLeituraAtual] = useState("");

  const [valorContaOperadora, setValorContaOperadora] = useState("");
  const [consumoTotalOperadora, setConsumoTotalOperadora] = useState("");

  const [lista, setLista] = useState<EnergiaItem[]>([]);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setErro("");

    const { data, error } = await supabase
      .from("energia")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ERRO AO CARREGAR ENERGIA:", error);
      setErro("Erro ao carregar histórico de energia.");
      return;
    }

    setLista((data as EnergiaItem[]) || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  const leituraAnteriorNumero = Number(leituraAnterior || 0);
  const leituraAtualNumero = Number(leituraAtual || 0);
  const valorContaOperadoraNumero = Number(valorContaOperadora || 0);
  const consumoTotalOperadoraNumero = Number(consumoTotalOperadora || 0);

  const consumoCalculado = useMemo(() => {
    if (!leituraAnterior || !leituraAtual) return 0;

    const consumo = leituraAtualNumero - leituraAnteriorNumero;
    return consumo > 0 ? consumo : 0;
  }, [leituraAnterior, leituraAtual, leituraAnteriorNumero, leituraAtualNumero]);

  const valorKwhCalculado = useMemo(() => {
    if (!valorContaOperadora || !consumoTotalOperadora) return 0;
    if (consumoTotalOperadoraNumero <= 0) return 0;

    return valorContaOperadoraNumero / consumoTotalOperadoraNumero;
  }, [
    valorContaOperadora,
    consumoTotalOperadora,
    valorContaOperadoraNumero,
    consumoTotalOperadoraNumero,
  ]);

  const valorIndividualCalculado = useMemo(() => {
    if (!consumoCalculado || !valorKwhCalculado) return 0;
    return consumoCalculado * valorKwhCalculado;
  }, [consumoCalculado, valorKwhCalculado]);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setErro("");

    if (!unidade.trim()) {
      setErro("Informe a unidade.");
      return;
    }

    if (!mes.trim()) {
      setErro("Informe o mês/competência.");
      return;
    }

    if (!leituraAnterior.trim()) {
      setErro("Informe a leitura anterior.");
      return;
    }

    if (!leituraAtual.trim()) {
      setErro("Informe a leitura atual.");
      return;
    }

    if (leituraAtualNumero < leituraAnteriorNumero) {
      setErro("A leitura atual não pode ser menor que a leitura anterior.");
      return;
    }

    if (!valorContaOperadora.trim()) {
      setErro("Informe o valor total da conta da operadora.");
      return;
    }

    if (!consumoTotalOperadora.trim()) {
      setErro("Informe o consumo total em kWh da operadora.");
      return;
    }

    if (consumoTotalOperadoraNumero <= 0) {
      setErro("O consumo total da operadora deve ser maior que zero.");
      return;
    }

    if (consumoCalculado <= 0) {
      setErro("O consumo da unidade deve ser maior que zero.");
      return;
    }

    setSalvando(true);

    const payload = {
      unidade: unidade.trim(),
      consumo: Number(consumoCalculado.toFixed(2)),
      valor_conta: Number(valorContaOperadoraNumero.toFixed(2)),
      valor_calculado: Number(valorIndividualCalculado.toFixed(2)),
      mes: mes.trim(),
    };

    const { error } = await supabase.from("energia").insert([payload]);

    setSalvando(false);

    if (error) {
      console.error("ERRO AO SALVAR ENERGIA:", error);
      setErro("Erro ao salvar energia no banco.");
      return;
    }

    setMsg("Energia salva com cálculo automático 🚀");
    setUnidade("");
    setMes("");
    setLeituraAnterior("");
    setLeituraAtual("");
    setValorContaOperadora("");
    setConsumoTotalOperadora("");
    carregar();
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerCard}>
          <p style={styles.badge}>Aurora Condomínios • Energia</p>
          <h1 style={styles.title}>Controle de energia com cálculo automático</h1>
          <p style={styles.description}>
            Lance a conta da operadora, informe as leituras da unidade e deixe o
            sistema calcular o consumo mensal e o valor individual automaticamente.
          </p>
        </div>

        <div style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Lançamento de energia</h2>

            <form onSubmit={salvar} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Unidade</label>
                <input
                  style={styles.input}
                  placeholder="Ex.: Casa 01 / Ap 302 / Lote 08"
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Competência</label>
                <input
                  style={styles.input}
                  placeholder="Ex.: 04/2026"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                />
              </div>

              <div style={styles.twoColumns}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Leitura anterior</label>
                  <input
                    style={styles.input}
                    inputMode="decimal"
                    placeholder="Ex.: 100"
                    value={leituraAnterior}
                    onChange={(e) => setLeituraAnterior(e.target.value)}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Leitura atual</label>
                  <input
                    style={styles.input}
                    inputMode="decimal"
                    placeholder="Ex.: 350"
                    value={leituraAtual}
                    onChange={(e) => setLeituraAtual(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.twoColumns}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Valor total da conta (operadora)</label>
                  <input
                    style={styles.input}
                    inputMode="decimal"
                    placeholder="Ex.: 2000"
                    value={valorContaOperadora}
                    onChange={(e) => setValorContaOperadora(e.target.value)}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Consumo total da conta (kWh)</label>
                  <input
                    style={styles.input}
                    inputMode="decimal"
                    placeholder="Ex.: 2500"
                    value={consumoTotalOperadora}
                    onChange={(e) => setConsumoTotalOperadora(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.previewBox}>
                <h3 style={styles.previewTitle}>Prévia automática</h3>

                <div style={styles.previewGrid}>
                  <div style={styles.metricCard}>
                    <span style={styles.metricLabel}>Consumo da unidade</span>
                    <strong style={styles.metricValue}>
                      {consumoCalculado.toFixed(2)} kWh
                    </strong>
                  </div>

                  <div style={styles.metricCard}>
                    <span style={styles.metricLabel}>Valor do kWh</span>
                    <strong style={styles.metricValue}>
                      R$ {valorKwhCalculado.toFixed(4)}
                    </strong>
                  </div>

                  <div style={styles.metricCard}>
                    <span style={styles.metricLabel}>Valor individual</span>
                    <strong style={styles.metricValue}>
                      R$ {valorIndividualCalculado.toFixed(2)}
                    </strong>
                  </div>
                </div>

                <p style={styles.previewText}>
                  Fórmula usada: <strong>valor do kWh = valor total da conta ÷ consumo total</strong>.
                  Depois o sistema calcula: <strong>valor da unidade = consumo da unidade × valor do kWh</strong>.
                </p>
              </div>

              <button type="submit" style={styles.button} disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar energia"}
              </button>
            </form>

            {msg ? <div style={styles.success}>{msg}</div> : null}
            {erro ? <div style={styles.error}>{erro}</div> : null}
          </section>

          <aside style={styles.sideCard}>
            <h2 style={styles.sectionTitle}>Resumo operacional</h2>

            <div style={styles.sideList}>
              <div style={styles.sideItem}>
                <span style={styles.sideLabel}>Leitura anterior</span>
                <strong style={styles.sideValue}>
                  {leituraAnteriorNumero.toFixed(2)}
                </strong>
              </div>

              <div style={styles.sideItem}>
                <span style={styles.sideLabel}>Leitura atual</span>
                <strong style={styles.sideValue}>
                  {leituraAtualNumero.toFixed(2)}
                </strong>
              </div>

              <div style={styles.sideItem}>
                <span style={styles.sideLabel}>Conta operadora</span>
                <strong style={styles.sideValue}>
                  R$ {valorContaOperadoraNumero.toFixed(2)}
                </strong>
              </div>

              <div style={styles.sideItem}>
                <span style={styles.sideLabel}>Consumo total operadora</span>
                <strong style={styles.sideValue}>
                  {consumoTotalOperadoraNumero.toFixed(2)} kWh
                </strong>
              </div>
            </div>

            <div style={styles.notice}>
              O sistema está em constante atualização e pode ter momentos de
              instabilidade durante melhorias. Esta etapa já prepara a base para
              histórico completo, média de consumo e alertas futuros.
            </div>
          </aside>
        </div>

        <section style={styles.historyCard}>
          <div style={styles.historyHeader}>
            <h2 style={styles.sectionTitle}>Histórico salvo</h2>
            <span style={styles.historyCount}>{lista.length} registro(s)</span>
          </div>

          {lista.length === 0 ? (
            <div style={styles.emptyState}>
              Nenhum lançamento encontrado ainda.
            </div>
          ) : (
            <div style={styles.historyList}>
              {lista.map((item) => (
                <div key={item.id} style={styles.historyRow}>
                  <div style={styles.historyMain}>
                    <strong style={styles.historyUnit}>{item.unidade}</strong>
                    <span style={styles.historyMonth}>{item.mes}</span>
                  </div>

                  <div style={styles.historyMetrics}>
                    <span style={styles.historyMetric}>
                      Consumo: <strong>{Number(item.consumo || 0).toFixed(2)} kWh</strong>
                    </span>
                    <span style={styles.historyMetric}>
                      Conta: <strong>R$ {Number(item.valor_conta || 0).toFixed(2)}</strong>
                    </span>
                    <span style={styles.historyMetric}>
                      Valor unidade:{" "}
                      <strong>R$ {Number(item.valor_calculado || 0).toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    padding: "24px 16px 40px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gap: "20px",
  },
  headerCard: {
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
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
  },
  sideCard: {
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #1e293b",
    boxShadow: "0 18px 44px rgba(15, 23, 42, 0.16)",
    height: "fit-content",
  },
  sectionTitle: {
    margin: "0 0 18px",
    fontSize: "22px",
    color: "inherit",
  },
  form: {
    display: "grid",
    gap: "16px",
  },
  fieldGroup: {
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
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },
  previewBox: {
    background: "#f8fbff",
    border: "1px solid #dbe4f0",
    borderRadius: "18px",
    padding: "18px",
    display: "grid",
    gap: "14px",
  },
  previewTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#0f172a",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },
  metricCard: {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: "14px",
    padding: "14px",
    display: "grid",
    gap: "8px",
  },
  metricLabel: {
    fontSize: "13px",
    color: "#64748b",
  },
  metricValue: {
    fontSize: "18px",
    color: "#0f172a",
  },
  previewText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#475569",
  },
  button: {
    border: "none",
    borderRadius: "14px",
    padding: "15px 18px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.28)",
  },
  success: {
    marginTop: "16px",
    background: "#ecfdf5",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "14px 16px",
    borderRadius: "12px",
    fontWeight: 700,
  },
  error: {
    marginTop: "16px",
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "14px 16px",
    borderRadius: "12px",
    fontWeight: 700,
  },
  sideList: {
    display: "grid",
    gap: "12px",
  },
  sideItem: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "14px",
    display: "grid",
    gap: "6px",
  },
  sideLabel: {
    fontSize: "13px",
    color: "#cbd5e1",
  },
  sideValue: {
    fontSize: "18px",
    color: "#ffffff",
  },
  notice: {
    marginTop: "18px",
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  historyCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },
  historyCount: {
    background: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: 700,
  },
  emptyState: {
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "22px",
    textAlign: "center",
    color: "#64748b",
    background: "#f8fbff",
  },
  historyList: {
    display: "grid",
    gap: "14px",
  },
  historyRow: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px",
    display: "grid",
    gap: "10px",
    background: "#fcfdff",
  },
  historyMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  historyUnit: {
    fontSize: "17px",
    color: "#0f172a",
  },
  historyMonth: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 700,
  },
  historyMetrics: {
    display: "flex",
    gap: "18px",
    flexWrap: "wrap",
  },
  historyMetric: {
    color: "#475569",
    fontSize: "14px",
  },
};