"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "@/lib/supabase";

type ProprietarioItem = {
  id: string;
  nome: string;
  unidade: string;
  created_at?: string;
};

export default function ProprietariosPage() {
  const [nome, setNome] = useState("");
  const [unidade, setUnidade] = useState("");
  const [lista, setLista] = useState<ProprietarioItem[]>([]);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  async function carregar() {
    const { data, error } = await supabase
      .from("proprietarios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ERRO AO CARREGAR PROPRIETARIOS:", error);
      setErro("Erro ao carregar proprietários.");
      return;
    }

    setLista((data as ProprietarioItem[]) || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setErro("");

    if (!nome.trim()) {
      setErro("Informe o nome.");
      return;
    }

    if (!unidade.trim()) {
      setErro("Informe a unidade.");
      return;
    }

    const { error } = await supabase.from("proprietarios").insert([
      {
        nome: nome.trim(),
        unidade: unidade.trim(),
      },
    ]);

    if (error) {
      console.error("ERRO AO SALVAR PROPRIETARIO:", error);
      setErro("Erro ao salvar no banco.");
      return;
    }

    setMsg("Salvo no banco 🚀");
    setNome("");
    setUnidade("");
    carregar();
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Proprietários (Banco real)</h1>

        <form onSubmit={salvar} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Unidade"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          />

          <button type="submit" style={styles.button}>
            Salvar
          </button>
        </form>

        {msg ? <div style={styles.success}>{msg}</div> : null}
        {erro ? <div style={styles.error}>{erro}</div> : null}

        <h2 style={styles.subtitle}>Lista:</h2>

        <div style={styles.list}>
          {lista.map((p) => (
            <div key={p.id} style={styles.card}>
              {p.nome} - Unidade {p.unidade}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fbff",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  subtitle: {
    marginTop: "24px",
    marginBottom: "12px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
  },
  success: {
    marginTop: "12px",
    color: "green",
  },
  error: {
    marginTop: "12px",
    color: "red",
  },
  list: {
    display: "grid",
    gap: "10px",
  },
  card: {
    background: "#fff",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
};