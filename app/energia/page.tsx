"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EnergiaPage() {
  const [unidade, setUnidade] = useState("");
  const [consumo, setConsumo] = useState("");
  const [valorConta, setValorConta] = useState("");
  const [mes, setMes] = useState("");

  const [lista, setLista] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  async function carregar() {
    const { data } = await supabase.from("energia").select("*");
    setLista(data || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e: any) {
    e.preventDefault();

    if (!unidade || !consumo || !valorConta) {
      alert("Preencha todos os campos");
      return;
    }

    const valorCalculado = Number(valorConta); // depois vamos dividir automático

    const { error } = await supabase.from("energia").insert([
      {
        unidade,
        consumo: Number(consumo),
        valor_conta: Number(valorConta),
        valor_calculado: valorCalculado,
        mes,
      },
    ]);

    if (!error) {
      setMsg("Energia salva 🚀");
      setUnidade("");
      setConsumo("");
      setValorConta("");
      setMes("");
      carregar();
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Energia (Banco real)</h1>

      <form onSubmit={salvar}>
        <input
          placeholder="Unidade"
          value={unidade}
          onChange={(e) => setUnidade(e.target.value)}
        />

        <input
          placeholder="Consumo"
          value={consumo}
          onChange={(e) => setConsumo(e.target.value)}
        />

        <input
          placeholder="Valor total conta"
          value={valorConta}
          onChange={(e) => setValorConta(e.target.value)}
        />

        <input
          placeholder="Mês (Ex: 04/2026)"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        />

        <button>Salvar energia</button>
      </form>

      <div>{msg}</div>

      <h2>Histórico:</h2>

      {lista.map((e) => (
        <div key={e.id}>
          {e.unidade} - {e.mes} - Consumo: {e.consumo} - R$ {e.valor_calculado}
        </div>
      ))}
    </main>
  );
}