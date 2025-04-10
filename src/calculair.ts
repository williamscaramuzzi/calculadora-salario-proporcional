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
  