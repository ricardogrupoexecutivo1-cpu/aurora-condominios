"use client";

import { useEffect, useState } from "react";

type Cobranca = {
  id: string;
  unidade: string;
  proprietario: string;
  valor: number;
  status: "pendente" | "pago" | "vencido";
};

const STORAGE_UNIDADES = "aurora_condominios_unidades";
const STORAGE_PROPRIETARIOS = "aurora_condominios_proprietarios";

export default function CobrancasPage() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);

  useEffect(() => {
    const unidades = JSON.parse(localStorage.getItem(STORAGE_UNIDADES) || "[]");
    const proprietarios = JSON.parse(localStorage.getItem(STORAGE_PROPRIETARIOS) || "[]");

    const lista = unidades.map((u: any) => {
      const dono = proprietarios.find((p: any) => p.unidade === u.codigo);

      return {
        id: `${Date.now()}-${u.codigo}`,
        unidade: u.codigo,
        proprietario: dono?.nome || "Não vinculado",
        valor: 0,
        status: "pendente",
      };
    });

    setCobrancas(lista);
  }, []);

  function atualizarValor(id: string, valor: number) {
    setCobrancas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, valor } : c))
    );
  }

  function atualizarStatus(id: string, status: Cobranca["status"]) {
    setCobrancas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Arquivo 14 · Cobranças</h1>

        {cobrancas.map((c) => (
          <div key={c.id} style={styles.card}>
            <strong>Unidade: {c.unidade}</strong>
            <div>Proprietário: {c.proprietario}</div>

            <input
              type="number"
              placeholder="Valor"
              style={styles.input}
              onChange={(e) => atualizarValor(c.id, Number(e.target.value))}
            />

            <select
              style={styles.input}
              onChange={(e) =>
                atualizarStatus(c.id, e.target.value as any)
              }
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="vencido">Vencido</option>
            </select>
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
    marginTop: "10px",
    padding: "10px",
  },
};