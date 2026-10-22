// HidroHub - Controle Diário de Hidratação

// ===== Dados e constantes =====
const META_POR_REGISTRO_ML = 250;   // number: meta fictícia por registro
const ML_POR_COPO = 250;            // number: equivalência de 1 copo
const LIMITE_QUASE_LA = 0.6;        // number: 60% da meta
const ESCALA_MINIMA_GRAFICO = 500;  // number: altura máxima mínima do gráfico
const periodos = ["Manhã", "Meio da manhã", "Almoço", "Tarde", "Fim da tarde", "Noite"]; // array de strings
const consumosIniciais = [300, 200, 250, 400, 150, 300]; // array de numbers (mL)

// ===== Funções de cálculo =====
function converterParaMl(quantidade, unidade) {
  if (unidade === "copos") {
    return quantidade * ML_POR_COPO;
  }
  return quantidade;
}

function calcularTotal(consumosMl) {
  let total = 0;
  for (const consumo of consumosMl) {
    total += consumo;
  }
  return total;
}

function calcularMedia(total, quantidade) {
  return quantidade > 0 ? total / quantidade : 0;
}

function contarRegistrosNaMeta(consumosMl, meta) {
  let contador = 0;
  for (let i = 0; i < consumosMl.length; i++) {
    if (consumosMl[i] >= meta) {
      contador++;
    }
  }
  return contador;
}

function classificarAcompanhamento(media, meta) {
  if (media >= meta) {
    return "Meta atingida";
  } else if (media >= meta * LIMITE_QUASE_LA) {
    return "Quase lá";
  } else {
    return "Atenção à hidratação";
  }
}

function gerarMensagem(classificacao) {
  if (classificacao === "Meta atingida") {
    return "Parabéns! A média do seu consumo alcançou a meta definida para cada período. Continue mantendo esse hábito.";
  } else if (classificacao === "Quase lá") {
    return "Você está indo bem! Seu consumo está próximo da meta, mas ainda pode melhorar em alguns períodos do dia.";
  } else {
    return "Seu consumo está abaixo do esperado para esta atividade. Tente beber pequenas quantidades de água ao longo do dia.";
  }
}

// ===== Funções de formatação e de tela =====
function formatarNumero(valor, casas = 0) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

function mostrarTexto(id, texto) {
  document.getElementById(id).textContent = texto;
}

function preencherCampos() {
  for (let i = 0; i < consumosIniciais.length; i++) {
    document.getElementById(`consumo-${i + 1}`).value = consumosIniciais[i];
    document.getElementById(`unidade-${i + 1}`).value = "mL";
  }
}

function lerConsumosEmMl() {
  const consumosMl = [];
  for (let i = 0; i < periodos.length; i++) {
    const quantidade = Number(document.getElementById(`consumo-${i + 1}`).value);
    const unidade = document.getElementById(`unidade-${i + 1}`).value;
    const valorValido = Number.isFinite(quantidade) && quantidade >= 0;
    consumosMl.push(converterParaMl(valorValido ? quantidade : 0, unidade));
  }
  return consumosMl;
}

function atualizarGrafico(consumosMl) {
  const maior = Math.max(ESCALA_MINIMA_GRAFICO, ...consumosMl);
  for (let i = 0; i < consumosMl.length; i++) {
    mostrarTexto(`valor-barra-${i + 1}`, formatarNumero(consumosMl[i]));
    document.getElementById(`barra-${i + 1}`).style.height = `${(consumosMl[i] / maior) * 100}%`;
  }
}

// ===== Fluxo principal =====
function calcularEExibirResultados() {
  const consumosMl = lerConsumosEmMl();
  const total = calcularTotal(consumosMl);
  const media = calcularMedia(total, consumosMl.length);
  const registrosNaMeta = contarRegistrosNaMeta(consumosMl, META_POR_REGISTRO_ML);
  const percentual = Math.round((registrosNaMeta / consumosMl.length) * 100);
  const classificacao = classificarAcompanhamento(media, META_POR_REGISTRO_ML);
  const metaAtingida = classificacao === "Meta atingida"; // boolean

  mostrarTexto("resultado-total", formatarNumero(total));
  mostrarTexto("resultado-litros", formatarNumero(total / 1000, 1));
  mostrarTexto("resultado-media", formatarNumero(media));
  mostrarTexto("resultado-metas", String(registrosNaMeta));
  mostrarTexto("resultado-percentual", String(percentual));
  mostrarTexto("resultado-classificacao", classificacao);
  mostrarTexto("resultado-mensagem", gerarMensagem(classificacao));
  atualizarGrafico(consumosMl);

  console.log(`Consumo por período (mL): ${consumosMl.join(", ")}`);
  console.log(`Consumo total: ${total} mL`);
  console.log(`Média por período: ${media.toFixed(1)} mL`);
  console.log(`Registros que atingiram a meta: ${registrosNaMeta} de ${consumosMl.length} (${percentual}%)`);
  console.log(`Classificação: ${classificacao} | Meta atingida? ${metaAtingida}`);
}

preencherCampos();
calcularEExibirResultados();
document.getElementById("botao-calcular").addEventListener("click", calcularEExibirResultados);