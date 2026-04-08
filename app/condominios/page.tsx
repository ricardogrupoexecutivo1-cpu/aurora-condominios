"use client";

import { useEffect, useMemo, useState } from "react";

type ModuloKey =
  | "energia_individual"
  | "agua_bomba"
  | "luz_externa"
  | "gas_enganado"
  | "taxa_condominio"
  | "taxas_extras"
  | "campos_personalizados";

type FormData = {
  nomeCondominio: string;
  cidade: string;
  estado: string;
  nomeSindico: string;
  telefone: string;
  quantidadeUnidades: string;
  observacoes: string;
  modulos: Record<ModuloKey, boolean>;
};

type ApiSuccessResponse = {
  ok: true;
  message: string;
  data: {
    nomeCondominio: string;
    cidade: string;
    estado: string;
    nomeSindico: string;
    telefone: string;
    quantidadeUnidades: number;
    observacoes: string;
    modulos: Record<ModuloKey, boolean>;
    createdAt: string;
  };
};

type ApiErrorResponse = {
  ok: false;
  message: string;
  errors?: string[];
};

const MODULOS: Array<{ key: ModuloKey; label: string; description: string }> = [
  {
    key: "energia_individual",
    label: "Energia individual",
    description: "Leitura por unidade e cálculo proporcional da conta.",
  },
  {
    key: "agua_bomba",
    label: "Água / bomba",
    description: "Rateio da bomba d’água e custos relacionados.",
  },
  {
    key: "luz_externa",
    label: "Luz externa",
    description: "Divisão da iluminação pública ou área comum.",
  },
  {
    key: "gas_enganado",
    label: "Gás encanado",
    description: "Controle opcional de leitura ou rateio do gás.",
  },
  {
    key: "taxa_condominio",
    label: "Taxa de condomínio",
    description: "Cobrança fixa mensal por unidade.",
  },
  {
    key: "taxas_extras",
    label: "Taxas extras",
    description: "Manutenção, obras, fundo de reserva e outras cobranças.",
  },
  {
    key: "campos_personalizados",
    label: "Campos personalizados",
    description: "Novas necessidades e informações extras por condomínio.",
  },
];

const INITIAL_FORM: FormData = {
  nomeCondominio: "",
  cidade: "",
  estado: "MG",
  nomeSindico: "",
  telefone: "",
  quantidadeUnidades: "",
  observacoes: "",
  modulos: {
    energia_individual: true,
    agua_bomba: true,
    luz_externa: true,
    gas_enganado: false,
    taxa_condominio: true,
    taxas_extras: true,
    campos_personalizados: true,
  },
};

function useIsMobile(breakpoint = 980) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function update() {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= breakpoint);
      }
    }

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return isMobile;
}

export default function CondominiosPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [listaErros, setListaErros] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const totalModulosAtivos = useMemo(() => {
    return Object.values(form.modulos).filter(Boolean).length;
  }, [form.modulos]);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMensagemSucesso("");
    setMensagemErro("");
    setListaErros([]);
  }

  function toggleModulo(modulo: ModuloKey) {
    setForm((current) => ({
      ...current,
      modulos: {
        ...current.modulos,
        [modulo]: !current.modulos[modulo],
      },
    }));

    setMensagemSucesso("");
    setMensagemErro("");
    setListaErros([]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSalvando(true);
    setMensagemSucesso("");
    setMensagemErro("");
    setListaErros([]);

    try {
      const response = await fetch("/api/condominios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as ApiSuccessResponse | ApiErrorResponse;

      if (!response.ok || !result.ok) {
        setMensagemErro(result.message || "Não foi possível salvar a base inicial.");
        setListaErros(result.ok ? [] : result.errors || []);
        return;
      }

      setMensagemSucesso(
        `Base inicial salva com sucesso para ${result.data.nomeCondominio}.`,
      );
      setMensagemErro("");
      setListaErros([]);

      console.log("CADASTRO SALVO VIA API:", result.data);
    } catch (error) {
      console.error("ERRO AO ENVIAR CADASTRO:", error);
      setMensagemErro("Erro de conexão ao tentar salvar o cadastro.");
      setListaErros([]);
    } finally {
      setSalvando(false);
    }
  }

  function handleLimparFormulario() {
    setForm(INITIAL_FORM);
    setMensagemSucesso("");
    setMensagemErro("");
    setListaErros([]);
  }

  return (
    <main style={styles.page}>
      <section
        style={{
          ...styles.hero,
          padding: isMobile ? "34px 16px 14px" : "56px 20px 22px",
        }}
      >
        <div style={styles.heroContent}>
          <div style={styles.badge}>Arquivo 5 · PC + celular ajustados</div>

          <h1
            style={{
              ...styles.title,
              fontSize: isMobile ? "32px" : "clamp(2rem, 4.2vw, 3.2rem)",
            }}
          >
            Cadastro inicial do condomínio
          </h1>

          <p
            style={{
              ...styles.description,
              fontSize: isMobile ? "15px" : "17px",
            }}
          >
            Esta etapa já envia os dados para a API local do sistema, valida os campos principais
            e prepara a base para a próxima ligação com banco de dados real, relatórios e módulos
            avançados do produto.
          </p>
        </div>
      </section>

      <section
        style={{
          ...styles.section,
          padding: isMobile ? "14px 16px 40px" : "20px 20px 70px",
        }}
      >
        <div
          style={{
            ...styles.grid,
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "minmax(0, 1.5fr) minmax(300px, 0.8fr)",
            gap: isMobile ? "16px" : "20px",
          }}
        >
          <div
            style={{
              ...styles.formCard,
              padding: isMobile ? "18px" : "26px",
              borderRadius: isMobile ? "22px" : "28px",
            }}
          >
            <div style={styles.cardHeader}>
              <span style={styles.kicker}>Dados principais</span>
              <h2
                style={{
                  ...styles.cardTitle,
                  fontSize: isMobile ? "24px" : "28px",
                }}
              >
                Informações do condomínio
              </h2>
              <p style={styles.cardText}>
                Preencha a base inicial do condomínio. Os dados serão usados para estruturar a
                operação administrativa.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div
                style={{
                  ...styles.fieldGrid,
                  gridTemplateColumns: isMobile
                    ? "minmax(0, 1fr)"
                    : "repeat(2, minmax(0, 1fr))",
                }}
              >
                <div style={styles.field}>
                  <label style={styles.label}>Nome do condomínio</label>
                  <input
                    style={{
                      ...styles.input,
                      padding: isMobile ? "13px 12px" : "14px 14px",
                    }}
                    value={form.nomeCondominio}
                    onChange={(e) => updateField("nomeCondominio", e.target.value)}
                    placeholder="Ex.: Condomínio Boa Esperança"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Quantidade de unidades</label>
                  <input
                    style={{
                      ...styles.input,
                      padding: isMobile ? "13px 12px" : "14px 14px",
                    }}
                    value={form.quantidadeUnidades}
                    onChange={(e) => updateField("quantidadeUnidades", e.target.value)}
                    placeholder="Ex.: 22"
                  />
                </div>
              </div>

              <div
                style={{
                  ...styles.fieldGrid,
                  gridTemplateColumns: isMobile
                    ? "minmax(0, 1fr)"
                    : "repeat(2, minmax(0, 1fr))",
                }}
              >
                <div style={styles.field}>
                  <label style={styles.label}>Cidade</label>
                  <input
                    style={{
                      ...styles.input,
                      padding: isMobile ? "13px 12px" : "14px 14px",
                    }}
                    value={form.cidade}
                    onChange={(e) => updateField("cidade", e.target.value)}
                    placeholder="Ex.: Felixlândia"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Estado</label>
                  <input
                    style={{
                      ...styles.input,
                      padding: isMobile ? "13px 12px" : "14px 14px",
                    }}
                    value={form.estado}
                    onChange={(e) => updateField("estado", e.target.value)}
                    placeholder="Ex.: MG"
                  />
                </div>
              </div>

              <div
                style={{
                  ...styles.fieldGrid,
                  gridTemplateColumns: isMobile
                    ? "minmax(0, 1fr)"
                    : "repeat(2, minmax(0, 1fr))",
                }}
              >
                <div style={styles.field}>
                  <label style={styles.label}>Nome do síndico</label>
                  <input
                    style={{
                      ...styles.input,
                      padding: isMobile ? "13px 12px" : "14px 14px",
                    }}
                    value={form.nomeSindico}
                    onChange={(e) => updateField("nomeSindico", e.target.value)}
                    placeholder="Ex.: Nome do responsável"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Telefone / WhatsApp</label>
                  <input
                    style={{
                      ...styles.input,
                      padding: isMobile ? "13px 12px" : "14px 14px",
                    }}
                    value={form.telefone}
                    onChange={(e) => updateField("telefone", e.target.value)}
                    placeholder="Ex.: (31) 99999-9999"
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Observações iniciais</label>
                <textarea
                  style={{
                    ...styles.textarea,
                    minHeight: isMobile ? "110px" : "120px",
                    padding: isMobile ? "13px 12px" : "14px 14px",
                  }}
                  value={form.observacoes}
                  onChange={(e) => updateField("observacoes", e.target.value)}
                  placeholder="Ex.: condomínio de sítios, cobrança por unidade, estrutura modular, observações do síndico..."
                />
              </div>

              <div style={styles.moduleBlock}>
                <div style={styles.moduleHeader}>
                  <h3 style={styles.moduleTitle}>Módulos desejados</h3>
                  <p style={styles.moduleText}>
                    Marque o que este condomínio realmente precisa usar.
                  </p>
                </div>

                <div
                  style={{
                    ...styles.moduleGrid,
                    gridTemplateColumns: isMobile
                      ? "minmax(0, 1fr)"
                      : "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: isMobile ? "12px" : "14px",
                  }}
                >
                  {MODULOS.map((modulo) => {
                    const ativo = form.modulos[modulo.key];

                    return (
                      <button
                        key={modulo.key}
                        type="button"
                        onClick={() => toggleModulo(modulo.key)}
                        style={{
                          ...styles.moduleCard,
                          ...(ativo ? styles.moduleCardActive : {}),
                          padding: isMobile ? "14px" : "16px",
                        }}
                      >
                        <div style={styles.moduleStatus}>{ativo ? "Ativo" : "Inativo"}</div>
                        <strong style={styles.moduleCardTitle}>{modulo.label}</strong>
                        <p style={styles.moduleCardText}>{modulo.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  ...styles.actionRow,
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <button
                  type="submit"
                  style={{
                    ...styles.primaryButton,
                    width: isMobile ? "100%" : "auto",
                  }}
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar base inicial"}
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.secondaryButton,
                    width: isMobile ? "100%" : "auto",
                  }}
                  onClick={handleLimparFormulario}
                  disabled={salvando}
                >
                  Limpar formulário
                </button>
              </div>

              {mensagemSucesso ? (
                <div style={styles.successBox}>{mensagemSucesso}</div>
              ) : null}

              {mensagemErro ? <div style={styles.errorBox}>{mensagemErro}</div> : null}

              {listaErros.length > 0 ? (
                <div style={styles.errorListBox}>
                  <strong style={styles.errorListTitle}>Revise estes pontos:</strong>
                  <ul style={styles.errorList}>
                    {listaErros.map((erro) => (
                      <li key={erro}>{erro}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </form>
          </div>

          <aside
            style={{
              ...styles.sideCard,
              position: isMobile ? "relative" : "sticky",
              top: isMobile ? "auto" : "20px",
              padding: isMobile ? "18px" : "24px",
              borderRadius: isMobile ? "22px" : "28px",
            }}
          >
            <span style={styles.kicker}>Resumo atual</span>
            <h2
              style={{
                ...styles.cardTitle,
                fontSize: isMobile ? "24px" : "28px",
              }}
            >
              Prévia da estrutura
            </h2>

            <div style={styles.summaryBlock}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Condomínio</span>
                <strong style={styles.summaryValue}>
                  {form.nomeCondominio || "Ainda não informado"}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Localidade</span>
                <strong style={styles.summaryValue}>
                  {form.cidade || "Cidade"} / {form.estado || "Estado"}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Síndico</span>
                <strong style={styles.summaryValue}>
                  {form.nomeSindico || "Ainda não informado"}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Unidades</span>
                <strong style={styles.summaryValue}>
                  {form.quantidadeUnidades || "0"}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Módulos ativos</span>
                <strong style={styles.summaryValue}>{totalModulosAtivos}</strong>
              </div>
            </div>

            <div style={styles.noteBox}>
              <strong style={styles.noteTitle}>Observação estratégica</strong>
              <p style={styles.noteText}>
                Estamos criando uma base modular para servir ao Condomínio Boa Esperança e também a
                outros condomínios no futuro, sem misturar dados e sem travar a operação. Relatórios
                completos farão parte da base vendável do sistema.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #eef5ff 42%, #ffffff 100%)",
    color: "#0f172a",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  hero: {
    padding: "56px 20px 22px",
  },
  heroContent: {
    maxWidth: "1180px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "18px",
  },
  title: {
    fontSize: "clamp(2rem, 4.2vw, 3.2rem)",
    lineHeight: 1.08,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    maxWidth: "820px",
    margin: 0,
  },
  description: {
    fontSize: "17px",
    lineHeight: 1.75,
    color: "#475569",
    maxWidth: "820px",
    marginTop: "18px",
    marginBottom: 0,
  },
  section: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "20px 20px 70px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(300px, 0.8fr)",
    gap: "20px",
    alignItems: "start",
  },
  formCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "28px",
    padding: "26px",
    boxShadow: "0 18px 44px rgba(15, 23, 42, 0.06)",
  },
  sideCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    border: "1px solid #dbeafe",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 18px 44px rgba(37, 99, 235, 0.08)",
    position: "sticky",
    top: "20px",
    alignSelf: "start",
  },
  cardHeader: {
    marginBottom: "22px",
  },
  kicker: {
    display: "inline-block",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "10px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
    lineHeight: 1.15,
  },
  cardText: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.75,
    fontSize: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#0f172a",
  },
  input: {
    width: "100%",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    padding: "14px 14px",
    fontSize: "15px",
    outline: "none",
    background: "#ffffff",
    color: "#0f172a",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    padding: "14px 14px",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    background: "#ffffff",
    color: "#0f172a",
    boxSizing: "border-box",
  },
  moduleBlock: {
    marginTop: "6px",
  },
  moduleHeader: {
    marginBottom: "12px",
  },
  moduleTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
  },
  moduleText: {
    marginTop: "8px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  moduleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  moduleCard: {
    textAlign: "left",
    borderRadius: "18px",
    border: "1px solid #dbe4f0",
    background: "#ffffff",
    padding: "16px",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },
  moduleCardActive: {
    border: "1px solid #93c5fd",
    background: "#eff6ff",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.10)",
  },
  moduleStatus: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: 800,
    color: "#1d4ed8",
    background: "#dbeafe",
    borderRadius: "999px",
    padding: "6px 10px",
    marginBottom: "12px",
  },
  moduleCardTitle: {
    display: "block",
    fontSize: "16px",
    color: "#0f172a",
    marginBottom: "8px",
  },
  moduleCardText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.65,
    fontSize: "14px",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "6px",
  },
  primaryButton: {
    border: "none",
    borderRadius: "14px",
    padding: "14px 20px",
    background: "linear-gradient(135deg, #2563eb 0%, #0f172a 100%)",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 20px 40px rgba(37, 99, 235, 0.18)",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    padding: "14px 20px",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
  },
  successBox: {
    marginTop: "4px",
    borderRadius: "16px",
    padding: "14px 16px",
    background: "#ecfdf5",
    border: "1px solid #86efac",
    color: "#166534",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  errorBox: {
    marginTop: "4px",
    borderRadius: "16px",
    padding: "14px 16px",
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#991b1b",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  errorListBox: {
    borderRadius: "16px",
    padding: "14px 16px",
    background: "#fff7ed",
    border: "1px solid #fdba74",
    color: "#9a3412",
  },
  errorListTitle: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
  },
  errorList: {
    margin: 0,
    paddingLeft: "18px",
    lineHeight: 1.8,
    fontSize: "14px",
  },
  summaryBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "18px",
    marginBottom: "24px",
  },
  summaryItem: {
    padding: "14px 16px",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #dbeafe",
  },
  summaryLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: 800,
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "8px",
  },
  summaryValue: {
    fontSize: "16px",
    lineHeight: 1.5,
    color: "#0f172a",
  },
  noteBox: {
    borderRadius: "22px",
    padding: "18px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
  },
  noteTitle: {
    display: "block",
    color: "#1d4ed8",
    fontSize: "14px",
    marginBottom: "8px",
  },
  noteText: {
    margin: 0,
    color: "#1e3a8a",
    lineHeight: 1.75,
    fontSize: "14px",
  },
};