async function salvar(e: any) {
  e.preventDefault();

  if (!nome.trim()) {
    alert("Informe o nome");
    return;
  }

  if (!unidade.trim()) {
    alert("Informe a unidade");
    return;
  }

  const { error } = await supabase.from("proprietarios").insert([
    { nome, unidade }
  ]);

  if (!error) {
    setMsg("Salvo no banco 🚀");
    setNome("");
    setUnidade("");
    carregar();
  }
}