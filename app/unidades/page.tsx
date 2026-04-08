"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type UnidadeStatus = "ativa" | "inativa" | "manutencao";

type UnidadeForm = {
  codigo: string;
  nome: string;
  proprietario: string;
  telefone: string;
  status: UnidadeStatus;
  observacoes: string;
};

export type UnidadeItem = UnidadeForm & {
  id: string;
  createdAt: string;
};

const INITIAL_FORM: UnidadeForm = {
  codigo: "",
  nome: "",
  proprietario: "",
  telefone: "",
  status: "ativa",
  observacoes: "",
};

export default function UnidadesPage() {
  const [form, setForm] = useState<UnidadeForm>(INITIAL_FORM);
  const [unidades, setUnidades] = useState<UnidadeItem[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  // 🔥 CARREGAR DO BANCO
  async function carregarUnidades() {
    const { data, error } = await supabase.from("unidades").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setUnidades(data || []);
  }

  useEffect(() => {
    carregarUnidades();
  }, []);

  function updateField<K extends keyof UnidadeForm>(field: K, value: UnidadeForm[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMensagem("");
    setErro("");
  }

  function limparFormulario() {
    setForm(INITIAL_FORM);
    setMensagem("");
    setErro("");
  }

  // 🔥 SALVAR NO BANCO
  async function salvarUnidade(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    if (!form.codigo.trim()) {
      setErro("Informe o código da unidade.");
      return;
    }

    if (!form.nome.trim()) {
      setErro("Informe o nome da unidade.");
      return;
    }

    const { error } = await supabase.from("unidades").insert([
      {
        codigo: form.codigo,
        nome: form.nome,
        proprietario: form.proprietario,
        telefone: form.telefone,
        status: form.status,
        observacoes: form.observacoes,
      },
    ]);

    if (error) {
      console.error(error);
      setErro("Erro ao salvar no banco");
      return;
    }

    setMensagem("Unidade salva no banco com sucesso 🚀");
    setForm(INITIAL_FORM);

    carregarUnidades();
  }

  function removerUnidade(id: string) {
    setUnidades((current) => current.filter((item) => item.id !== id));
  }

  const totais = useMemo(() => {
    const total = unidades.length;
    const ativas = unidades.filter((item) => item.status === "ativa").length;
    const inativas = unidades.filter((item) => item.status === "inativa").length;
    const manutencao = unidades.filter((item) => item.status === "manutencao").length;

    return {
      total,
      ativas,
      inativas,
      manutencao,
    };
  }, [unidades]);

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <h1 style={styles.title}>Unidades (Banco real)</h1>

        <form onSubmit={salvarUnidade} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Código"
            value={form.codigo}
            onChange={(e) => updateField("codigo", e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => updateField("nome", e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Proprietário"
            value={form.proprietario}
            onChange={(e) => updateField("proprietario", e.target.value)}
          />

          <button style={styles.button}>Salvar no banco</button>

          {mensagem && <div style={styles.success}>{mensagem}</div>}
          {erro && <div style={styles.error}>{erro}</div>}
        </form>

        <h2>Total: {totais.total}</h2>

        {unidades.map((u) => (
          <div key={u.id} style={styles.card}>
            <strong>{u.codigo}</strong> - {u.nome}
          </div>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "20px",
    background: "#f8fbff",
    minHeight: "100vh",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
  },
  card: {
    background: "#fff",
    padding: "10px",
    marginBottom: "10px",
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
};