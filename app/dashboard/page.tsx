"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type UnidadeItem = {
  codigo?: string;
  [key: string]: any;
};

type ProprietarioItem = {
  unidade?: string;
  [key: string]: any;
};

type EnergiaItem = {
  consumo?: number | string;
  valor_calculado?: number | string;
  [key: string]: any;
};

type ComunicacaoItem = {
  status?: string;
  prioridade?: string;
  [key: string]: any;
};

type MelhoriaItem = {
  status?: string;
  votosConcordo?: number;
  votosNaoConcordo?: number;
  [key: string]: any;
};

export default function DashboardPage() {
  const [unidades, setUnidades] = useState<UnidadeItem[]>([]);
  const [proprietarios, setProprietarios] = useState<ProprietarioItem[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [energia, setEnergia] = useState<EnergiaItem[]>([]);
  const [comunicacoes, setComunicacoes] = useState<ComunicacaoItem[]>([]);
  const [melhorias, setMelhorias] = useState<MelhoriaItem[]>([]);

  useEffect(() => {
    setUnidades(
      JSON.parse(localStorage.getItem("aurora_condominios_unidades") || "[]")
    );
    setProprietarios(
      JSON.parse(localStorage.getItem("aurora_condominios_proprietarios") || "[]")
    );
    setFornecedores(
      JSON.parse(localStorage.getItem("aurora_fornecedores") || "[]")
    );
    setEnergia(JSON.parse(localStorage.getItem("aurora_energia") || "[]"));
    setComunicacoes(
      JSON.parse(localStorage.getItem("aurora_condominios_comunicacao") || "[]")
    );
    setMelhorias(
      JSON.parse(localStorage.getItem("aurora_condominios_melhorias") || "[]")
    );
  }, []);

  const totalUnidades = unidades.length;
  const totalProprietarios = proprietarios.length;
  const totalFornecedores = fornecedores.length;

  const naoVinculados = useMemo(() => {
    return unidades.filter(
      (u) => !proprietarios.find((p) => p.unidade === u.codigo)
    ).length;
  }, [unidades, proprietarios]);

  const totalConsumo = useMemo(() => {
    return energia.reduce((acc, e) => acc + Number(e.consumo || 0), 0);
  }, [energia]);

  const totalEnergia = useMemo(() => {
    return energia.reduce((acc, e) => acc + Number(e.valor_calculado || 0), 0);
  }, [energia]);

  const comunicacoesAtivas = useMemo(() => {
    return comunicacoes.filter((item) => item.status === "ativa").length;
  }, [comunicacoes]);

  const comunicacoesAltaPrioridade = useMemo(() => {
    return comunicacoes.filter((item) => item.prioridade === "alta").length;
  }, [comunicacoes]);

  const melhoriasAbertas = useMemo(() => {
    return melhorias.filter((item) => item.status === "aberta").length;
  }, [melhorias]);

  const melhoriasAprovadas = useMemo(() => {
    return melhorias.filter((item) => item.status === "aprovada").length;
  }, [melhorias]);

  const votosConcordo = useMemo(() => {
    return melhorias.reduce((acc, item) => acc + Number(item.votosConcordo || 0), 0);
  }, [melhorias]);

  const votosNaoConcordo = useMemo(() => {
    return melhorias.reduce((acc, item) => acc + Number(item.votosNaoConcordo || 0), 0);
  }, [melhorias]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <p style={styles.badge}>Aurora Condomínios • Dashboard</p>
          <h1 style={styles.title}>Painel do Síndico</h1>
          <p style={styles.subtitle}>
            Visão geral da operação do condomínio com unidades, energia,
            comunicação, melhorias, fornecedores e acompanhamento da base atual.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Visão operacional</h2>
          </div>

          <div style={styles.grid}>
            <Card title="Unidades" value={String(totalUnidades)} />
            <Card title="Proprietários" value={String(totalProprietarios)} />
            <Card title="Fornecedores" value={String(totalFornecedores)} />
            <Card title="Sem vínculo" value={String(naoVinculados)} />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Energia do condomínio ⚡</h2>
          </div>

          <div style={styles.grid}>
            <Card title="Consumo total (kWh)" value={totalConsumo.toFixed(2)} />
            <Card title="Total energia (R$)" value={`R$ ${totalEnergia.toFixed(2)}`} />
            <Card title="Lançamentos" value={String(energia.length)} />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Comunicação interna 📢</h2>
          </div>

          <div style={styles.grid}>
            <Card title="Mensagens" value={String(comunicacoes.length)} />
            <Card title="Ativas" value={String(comunicacoesAtivas)} />
            <Card title="Alta prioridade" value={String(comunicacoesAltaPrioridade)} />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Melhorias e reparos 🛠️</h2>
          </div>

          <div style={styles.grid}>
            <Card title="Solicitações" value={String(melhorias.length)} />
            <Card title="Abertas" value={String(melhoriasAbertas)} />
            <Card title="Aprovadas" value={String(melhoriasAprovadas)} />
            <Card title="Votos concordo" value={String(votosConcordo)} />
            <Card title="Votos não" value={String(votosNaoConcordo)} />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Resumo da operação</h2>
          </div>

          <ul style={styles.list}>
            <li>Total de unidades: {totalUnidades}</li>
            <li>Proprietários vinculados: {totalProprietarios}</li>
            <li>Unidades sem proprietário: {naoVinculados}</li>
            <li>Fornecedores cadastrados: {totalFornecedores}</li>
            <li>Consumo total de energia: {totalConsumo.toFixed(2)} kWh</li>
            <li>Valor total de energia: R$ {totalEnergia.toFixed(2)}</li>
            <li>Mensagens cadastradas: {comunicacoes.length}</li>
            <li>Mensagens ativas: {comunicacoesAtivas}</li>
            <li>Solicitações de melhorias/reparos: {melhorias.length}</li>
            <li>Solicitações abertas: {melhoriasAbertas}</li>
          </ul>
        </section>

        <div style={styles.quickLinks}>
          <a href="/cobrancas" style={styles.quickLink}>
            Cobranças
          </a>
          <a href="/energia" style={styles.quickLink}>
            Energia
          </a>
          <a href="/comunicacao" style={styles.quickLink}>
            Comunicação
          </a>
          <a href="/melhorias" style={styles.quickLink}>
            Melhorias
          </a>
          <a href="/relatorios" style={styles.quickLink}>
            Relatórios
          </a>
        </div>

        <div style={styles.alert}>
          O sistema está em constante evolução. Algumas funcionalidades podem estar
          em atualização enquanto novas áreas são integradas com mais profundidade.
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={styles.card}>
      <span style={styles.cardTitle}>{title}</span>
      <strong style={styles.cardValue}>{value}</strong>
    </div>
  );
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
    fontSize: "32px",
    margin: "10px 0 8px",
    color: "#0f172a",
    lineHeight: 1.15,
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.6,
    maxWidth: "880px",
  },
  section: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid #dbe4f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
    display: "grid",
    gap: "16px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    fontSize: "22px",
    margin: 0,
    color: "#0f172a",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "15px",
  },
  card: {
    background: "#fcfdff",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    display: "grid",
    gap: "8px",
  },
  cardTitle: {
    display: "block",
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 700,
  },
  cardValue: {
    fontSize: "24px",
    color: "#0f172a",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: 1.9,
    fontSize: "15px",
  },
  quickLinks: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  quickLink: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
    border: "1px solid #bfdbfe",
  },
  alert: {
    padding: "15px 16px",
    background: "#e0f2fe",
    borderRadius: "14px",
    color: "#0c4a6e",
    lineHeight: 1.7,
    border: "1px solid #bae6fd",
  },
};