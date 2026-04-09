"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type TipoSolicitacao = "melhoria" | "reparo";
type Prioridade = "baixa" | "media" | "alta";
type StatusItem = "aberta" | "em_analise" | "aprovada" | "rejeitada" | "concluida";

type MelhoriaItem = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoSolicitacao;
  prioridade: Prioridade;
  status: StatusItem;
  autor: string;
  dataCriacao: string;
  votosConcordo: number;
  votosNaoConcordo: number;
};

const STORAGE_MELHORIAS = "aurora_condominios_melhorias";

function agoraFormatado() {
  return new Date().toLocaleString("pt-BR");
}

export default function MelhoriasPage() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoSolicitacao>("melhoria");
  const [prioridade, setPrioridade] = useState<Prioridade>("media");
  const [autor, setAutor] = useState("Síndico");
  const [itens, setItens] = useState<MelhoriaItem[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem(STORAGE_MELHORIAS) || "[]");
    if (Array.isArray(salvos)) {
      setItens(salvos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_MELHORIAS, JSON.stringify(itens));
  }, [itens]);

  function salvarItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!titulo.trim()) {
      alert("Informe o título da proposta ou reparo.");
      return;
    }

    if (!descricao.trim()) {
      alert("Informe a descrição.");
      return;
    }

    const novoItem: MelhoriaItem = {
      id: String(Date.now()),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipo,
      prioridade,
      status: "aberta",
      autor: autor.trim() || "Síndico",
      dataCriacao: agoraFormatado(),
      votosConcordo: 0,
      votosNaoConcordo: 0,
    };

    setItens((prev) => [novoItem, ...prev]);
    setTitulo("");
    setDescricao("");
    setTipo("melhoria");
    setPrioridade("media");
    setMsg("Solicitação registrada com sucesso 🚀");

    setTimeout(() => setMsg(""), 2500);
  }

  function votar(id: string, voto: "concordo" | "nao") {
    setItens((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (voto === "concordo") {
          return { ...item, votosConcordo: item.votosConcordo + 1 };
        }

        return { ...item, votosNaoConcordo: item.votosNaoConcordo + 1 };
      })
    );
  }

  function alterarStatus(id: string, status: StatusItem) {
    setItens((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  function removerItem(id: string) {
    const confirmar = window.confirm("Deseja realmente excluir esta solicitação?");
    if (!confirmar) return;

    setItens((prev) => prev.filter((item) => item.id !== id));
  }

  const resumo = useMemo(() => {
    return {
      total: itens.length,
      abertas: itens.filter((item) => item.status === "aberta").length,
      aprovadas: itens.filter((item) => item.status === "aprovada").length,
      concluidas: itens.filter((item) => item.status === "concluida").length,
    };
  }, [itens]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <p style={styles.badge}>Aurora Condomínios • Melhorias e Reparos</p>
          <h1 style={styles.title}>Propostas, reparos e votação interna</h1>
          <p style={styles.subtitle}>
            Registre melhorias, pedidos de reparo e acompanhe a opinião dos moradores,
            proprietários e inquilinos com botões de concorda e não concorda.
          </p>
        </section>

        <section style={styles.summaryGrid}>
          <ResumoCard title="Total" value={String(resumo.total)} />
          <ResumoCard title="Abertas" value={String(resumo.abertas)} />
          <ResumoCard title="Aprovadas" value={String(resumo.aprovadas)} />
          <ResumoCard title="Concluídas" value={String(resumo.concluidas)} />
        </section>

        <section style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Nova solicitação</h2>

          <form onSubmit={salvarItem} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Título</label>
              <input
                style={styles.input}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Troca da iluminação da área comum"
              />
            </div>

            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Tipo</label>
                <select
                  style={styles.input}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoSolicitacao)}
                >
                  <option value="melhoria">Melhoria</option>
                  <option value="reparo">Reparo</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Prioridade</label>
                <select
                  style={styles.input}
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value as Prioridade)}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Autor</label>
                <input
                  style={styles.input}
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  placeholder="Ex.: Síndico / Morador / Proprietário"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Descrição</label>
              <textarea
                style={styles.textarea}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva aqui a proposta de melhoria ou o reparo necessário."
              />
            </div>

            <button type="submit" style={styles.primaryButton}>
              Salvar solicitação
            </button>
          </form>

          {msg ? <div style={styles.success}>{msg}</div> : null}
        </section>

        <section style={styles.listCard}>
          <div style={styles.listHeader}>
            <h2 style={styles.sectionTitle}>Histórico de propostas e reparos</h2>
            <span style={styles.counter}>{itens.length} registro(s)</span>
          </div>

          {itens.length === 0 ? (
            <div style={styles.empty}>
              Nenhuma proposta ou reparo cadastrado ainda.
            </div>
          ) : (
            <div style={styles.list}>
              {itens.map((item) => (
                <div key={item.id} style={styles.itemCard}>
                  <div style={styles.itemTop}>
                    <div style={styles.itemTopLeft}>
                      <strong style={styles.itemTitle}>{item.titulo}</strong>

                      <div style={styles.metaRow}>
                        <span style={chipTipo(item.tipo)}>{item.tipo}</span>
                        <span style={chipPrioridade(item.prioridade)}>
                          prioridade {item.prioridade}
                        </span>
                        <span style={chipStatus(item.status)}>{item.status}</span>
                      </div>
                    </div>

                    <div style={styles.actions}>
                      <select
                        style={styles.statusSelect}
                        value={item.status}
                        onChange={(e) =>
                          alterarStatus(item.id, e.target.value as StatusItem)
                        }
                      >
                        <option value="aberta">Aberta</option>
                        <option value="em_analise">Em análise</option>
                        <option value="aprovada">Aprovada</option>
                        <option value="rejeitada">Rejeitada</option>
                        <option value="concluida">Concluída</option>
                      </select>

                      <button
                        type="button"
                        style={styles.deleteButton}
                        onClick={() => removerItem(item.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  <p style={styles.itemText}>{item.descricao}</p>

                  <div style={styles.voteRow}>
                    <button
                      type="button"
                      style={styles.voteYes}
                      onClick={() => votar(item.id, "concordo")}
                    >
                      Concordo ({item.votosConcordo})
                    </button>

                    <button
                      type="button"
                      style={styles.voteNo}
                      onClick={() => votar(item.id, "nao")}
                    >
                      Não concordo ({item.votosNaoConcordo})
                    </button>
                  </div>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoBox}>
                      <span style={styles.infoLabel}>Autor</span>
                      <strong style={styles.infoValue}>{item.autor}</strong>
                    </div>

                    <div style={styles.infoBox}>
                      <span style={styles.infoLabel}>Criado em</span>
                      <strong style={styles.infoValue}>{item.dataCriacao}</strong>
                    </div>

                    <div style={styles.infoBox}>
                      <span style={styles.infoLabel}>Resultado parcial</span>
                      <strong style={styles.infoValue}>
                        {item.votosConcordo >= item.votosNaoConcordo
                          ? "Tendência positiva"
                          : "Tendência negativa"}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div style={styles.notice}>
          O sistema está em constante atualização e pode ter momentos de instabilidade
          durante melhorias. Esta área já prepara a base para decisões internas,
          aprovações e histórico de propostas do condomínio.
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

function chipTipo(tipo: TipoSolicitacao): CSSProperties {
  const base: CSSProperties = {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  };

  if (tipo === "reparo") {
    return {
      ...base,
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    };
  }

  return {
    ...base,
    background: "#dbeafe",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  };
}

function chipPrioridade(prioridade: Prioridade): CSSProperties {
  const base: CSSProperties = {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  };

  if (prioridade === "alta") {
    return {
      ...base,
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    };
  }

  if (prioridade === "media") {
    return {
      ...base,
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fde68a",
    };
  }

  return {
    ...base,
    background: "#ecfdf5",
    color: "#166534",
    border: "1px solid #bbf7d0",
  };
}

function chipStatus(status: StatusItem): CSSProperties {
  const base: CSSProperties = {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  };

  if (status === "aprovada") {
    return {
      ...base,
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
  }

  if (status === "rejeitada") {
    return {
      ...base,
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    };
  }

  if (status === "concluida") {
    return {
      ...base,
      background: "#e0f2fe",
      color: "#0c4a6e",
      border: "1px solid #bae6fd",
    };
  }

  if (status === "em_analise") {
    return {
      ...base,
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fde68a",
    };
  }

  return {
    ...base,
    background: "#e5e7eb",
    color: "#374151",
    border: "1px solid #d1d5db",
  };
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
  subtitle: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.6,
    maxWidth: "880px",
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
  formCard: {
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
  form: {
    display: "grid",
    gap: "16px",
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
  textarea: {
    width: "100%",
    minHeight: "140px",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
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
  list: {
    display: "grid",
    gap: "16px",
  },
  itemCard: {
    background: "#fcfdff",
    padding: "18px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    display: "grid",
    gap: "16px",
  },
  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  itemTopLeft: {
    display: "grid",
    gap: "10px",
  },
  itemTitle: {
    fontSize: "20px",
    color: "#0f172a",
  },
  metaRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  itemText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
    whiteSpace: "pre-wrap",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  statusSelect: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    fontSize: "14px",
  },
  deleteButton: {
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "10px 14px",
    background: "#fff1f2",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  voteRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  voteYes: {
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "12px 16px",
    background: "#ecfdf5",
    color: "#166534",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  voteNo: {
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "12px 16px",
    background: "#fef2f2",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },
  infoBox: {
    background: "#f8fbff",
    border: "1px solid #dbe4f0",
    borderRadius: "14px",
    padding: "14px",
    display: "grid",
    gap: "6px",
  },
  infoLabel: {
    fontSize: "13px",
    color: "#64748b",
  },
  infoValue: {
    fontSize: "15px",
    color: "#0f172a",
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