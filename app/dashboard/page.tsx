"use client";

import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [proprietarios, setProprietarios] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);

  useEffect(() => {
    setUnidades(JSON.parse(localStorage.getItem("aurora_condominios_unidades") || "[]"));
    setProprietarios(JSON.parse(localStorage.getItem("aurora_condominios_proprietarios") || "[]"));
    setFornecedores(JSON.parse(localStorage.getItem("aurora_fornecedores") || "[]"));
  }, []);

  const totalUnidades = unidades.length;
  const totalProprietarios = proprietarios.length;
  const totalFornecedores = fornecedores.length;

  const naoVinculados = useMemo(() => {
    return unidades.filter(
      (u) => !proprietarios.find((p) => p.unidade === u.codigo)
    ).length;
  }, [unidades, proprietarios]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard do Síndico</h1>

        <div style={styles.grid}>
          <Card title="Unidades" value={totalUnidades} />
          <Card title="Proprietários" value={totalProprietarios} />
          <Card title="Fornecedores" value={totalFornecedores} />
          <Card title="Sem vínculo" value={naoVinculados} />
        </div>

        <div style={styles.section}>
          <h2>Resumo da operação</h2>

          <ul>
            <li>Total de unidades cadastradas: {totalUnidades}</li>
            <li>Proprietários vinculados: {totalProprietarios}</li>
            <li>Unidades sem proprietário: {naoVinculados}</li>
            <li>Fornecedores disponíveis: {totalFornecedores}</li>
          </ul>
        </div>

        <div style={styles.alert}>
          Sistema em constante evolução. Algumas funcionalidades podem estar em atualização.
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }: any) {
  return (
    <div style={styles.card}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#f8fbff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  section: {
    marginTop: "30px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  },
  alert: {
    marginTop: "20px",
    padding: "15px",
    background: "#e0f2fe",
    borderRadius: "10px",
  },
};