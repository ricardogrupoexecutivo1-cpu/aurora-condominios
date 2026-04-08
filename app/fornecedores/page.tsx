"use client";

import { useEffect, useState } from "react";

type Fornecedor = {
  id: string;
  nome: string;
  tipo: string;
  telefone: string;
  cidade: string;
  observacoes: string;
};

const STORAGE_KEY = "aurora_fornecedores";

export default function FornecedoresPage() {
  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    telefone: "",
    cidade: "",
    observacoes: "",
  });

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) setFornecedores(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fornecedores));
  }, [fornecedores]);

  function salvar() {
    if (!form.nome) return;

    const novo: Fornecedor = {
      id: Date.now().toString(),
      ...form,
    };

    setFornecedores((prev) => [novo, ...prev]);
    setForm({
      nome: "",
      tipo: "",
      telefone: "",
      cidade: "",
      observacoes: "",
    });

    setMsg("Fornecedor cadastrado com sucesso.");
  }

  function remover(id: string) {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Arquivo 15 · Fornecedores</h1>

        <div style={styles.card}>
          <input
            placeholder="Nome do fornecedor"
            style={styles.input}
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <input
            placeholder="Tipo (energia, manutenção, etc)"
            style={styles.input}
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          />

          <input
            placeholder="Telefone"
            style={styles.input}
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />

          <input
            placeholder="Cidade"
            style={styles.input}
            value={form.cidade}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
          />

          <textarea
            placeholder="Observações"
            style={styles.input}
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          />

          <button style={styles.button} onClick={salvar}>
            Salvar fornecedor
          </button>

          {msg && <div style={styles.success}>{msg}</div>}
        </div>

        {fornecedores.map((f) => (
          <div key={f.id} style={styles.card}>
            <strong>{f.nome}</strong>
            <div>{f.tipo}</div>
            <div>{f.telefone}</div>
            <div>{f.cidade}</div>
            <div>{f.observacoes}</div>

            <button style={styles.remove} onClick={() => remover(f.id)}>
              Remover
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#f8fbff",
    minHeight: "100vh",
    padding: "20px",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "26px",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
  },
  input: {
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  success: {
    marginTop: "10px",
    color: "green",
  },
  remove: {
    marginTop: "10px",
    background: "#fee2e2",
    border: "none",
    padding: "8px",
    cursor: "pointer",
  },
};