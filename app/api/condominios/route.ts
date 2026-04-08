import { NextResponse } from "next/server";

type ModuloKey =
  | "energia_individual"
  | "agua_bomba"
  | "luz_externa"
  | "gas_enganado"
  | "taxa_condominio"
  | "taxas_extras"
  | "campos_personalizados";

type CadastroCondominioPayload = {
  nomeCondominio?: string;
  cidade?: string;
  estado?: string;
  nomeSindico?: string;
  telefone?: string;
  quantidadeUnidades?: string | number;
  observacoes?: string;
  modulos?: Partial<Record<ModuloKey, boolean>>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeQuantidade(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d]/g, "");
    const parsed = Number(cleaned);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function normalizeModulos(
  modulos: CadastroCondominioPayload["modulos"],
): Record<ModuloKey, boolean> {
  return {
    energia_individual: Boolean(modulos?.energia_individual),
    agua_bomba: Boolean(modulos?.agua_bomba),
    luz_externa: Boolean(modulos?.luz_externa),
    gas_enganado: Boolean(modulos?.gas_enganado),
    taxa_condominio: Boolean(modulos?.taxa_condominio),
    taxas_extras: Boolean(modulos?.taxas_extras),
    campos_personalizados: Boolean(modulos?.campos_personalizados),
  };
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      message: "API de condomínios ativa.",
      endpoints: {
        post: "/api/condominios",
      },
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CadastroCondominioPayload;

    const nomeCondominio = normalizeText(body?.nomeCondominio);
    const cidade = normalizeText(body?.cidade);
    const estado = normalizeText(body?.estado).toUpperCase();
    const nomeSindico = normalizeText(body?.nomeSindico);
    const telefone = normalizeText(body?.telefone);
    const observacoes = normalizeText(body?.observacoes);
    const quantidadeUnidades = normalizeQuantidade(body?.quantidadeUnidades);
    const modulos = normalizeModulos(body?.modulos);

    const errors: string[] = [];

    if (!nomeCondominio) {
      errors.push("Informe o nome do condomínio.");
    }

    if (!cidade) {
      errors.push("Informe a cidade.");
    }

    if (!estado) {
      errors.push("Informe o estado.");
    }

    if (!nomeSindico) {
      errors.push("Informe o nome do síndico.");
    }

    if (!telefone) {
      errors.push("Informe o telefone ou WhatsApp.");
    }

    if (!quantidadeUnidades || quantidadeUnidades <= 0) {
      errors.push("Informe uma quantidade de unidades válida.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Existem campos obrigatórios pendentes.",
          errors,
        },
        { status: 400 },
      );
    }

    const payloadNormalizado = {
      nomeCondominio,
      cidade,
      estado,
      nomeSindico,
      telefone,
      quantidadeUnidades,
      observacoes,
      modulos,
      createdAt: new Date().toISOString(),
    };

    console.log("API CONDOMINIOS - CADASTRO RECEBIDO:", payloadNormalizado);

    return NextResponse.json(
      {
        ok: true,
        message: "Cadastro base recebido com sucesso.",
        data: payloadNormalizado,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API CONDOMINIOS - ERRO AO PROCESSAR POST:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Não foi possível processar o cadastro do condomínio.",
      },
      { status: 500 },
    );
  }
}