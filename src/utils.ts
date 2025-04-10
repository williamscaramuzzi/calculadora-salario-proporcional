export function calcularIR(salarioBruto: number, numeroDependentes: number): number {
  const deducaoPorDependente = 189.59;
  const baseCalculo = salarioBruto - (numeroDependentes * deducaoPorDependente);

  if (baseCalculo <= 2259.20) return 0;

  let imposto = 0;

  // Faixa 2: 7.5% de 2.259,21 a 2.826,65
  if (baseCalculo > 2259.20) {
    const limite = Math.min(baseCalculo, 2826.65);
    imposto += (limite - 2259.20) * 0.075;
  }

  // Faixa 3: 15% de 2.826,66 a 3.751,05
  if (baseCalculo > 2826.65) {
    const limite = Math.min(baseCalculo, 3751.05);
    imposto += (limite - 2826.65) * 0.15;
  }

  // Faixa 4: 22.5% de 3.751,06 a 4.664,68
  if (baseCalculo > 3751.05) {
    const limite = Math.min(baseCalculo, 4664.68);
    imposto += (limite - 3751.05) * 0.225;
  }

  // Faixa 5: 27.5% acima de 4.664,68
  if (baseCalculo > 4664.68) {
    imposto += (baseCalculo - 4664.68) * 0.275;
  }

  return imposto;
}

export function diasAteHoje(data: string): number {
  const partes = data.split("/");
  if (partes.length !== 3) {
    throw new Error("Formato inválido. Use dd/mm/aaaa");
  }

  const [diaStr, mesStr, anoStr] = partes;
  const dia = parseInt(diaStr, 10);
  const mes = parseInt(mesStr, 10) - 1; // Mês em JavaScript começa do 0
  const ano = parseInt(anoStr, 10);

  const dataInformada = new Date(ano, mes, dia);
  const hoje = new Date();

  // Zera as horas para comparar apenas datas
  dataInformada.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);

  const diffEmMs = hoje.getTime() - dataInformada.getTime();

  // 1 dia = 1000ms * 60s * 60min * 24h
  const dias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

  return dias;
}

export function tempoMilitarAteDezembro(inclusao: string): number {
  /**
   * Calcula o tempo trabalhado até o dia 31 de dezembro de 2021 que é a data referência para a nova lei da previdência militar do MS
   */
  const DIAS_EM_30_ANOS = 10957;
  const DIAS_EM_25_ANOS = 9131;
  const partes = inclusao.split("/");
  if (partes.length !== 3) {
    throw new Error("Formato inválido. Use dd/mm/aaaa");
  }

  const [diaStr, mesStr, anoStr] = partes;
  const dia = parseInt(diaStr, 10);
  const mes = parseInt(mesStr, 10) - 1; // Mês em JavaScript começa do 0
  const ano = parseInt(anoStr, 10);

  const dataInformada = new Date(ano, mes, dia);
  const trintaEUmDeDezembro = new Date(2021, 11, 31); //mês começa em 0, portanto dezembro é 11


  // Zera as horas para comparar apenas datas
  dataInformada.setHours(0, 0, 0, 0);
  trintaEUmDeDezembro.setHours(0, 0, 0, 0);

  const diffEmMs = trintaEUmDeDezembro.getTime() - dataInformada.getTime();

  // 1 dia = 1000ms * 60s * 60min * 24h
  const diasTrabalhados = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

  return diasTrabalhados;
}
