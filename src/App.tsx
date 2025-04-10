import { useState } from 'react';
import { calcularIR, diasAteHoje, tempoMilitarAteDezembro } from './utils';
import logo from './assets/logopmms.svg';

function App() {
  const [tempoAtual, setTempoAtual] = useState<number>(0);
  const [tempoTotal, setTempoTotal] = useState<number>(0);
  const [salario, setSalario] = useState<number>(0);
  const [descontoSaude, setDescontoSaude] = useState<number>(0);
  const [dependentes, setDependentes] = useState<number>(0);
  const [tempoMilitarFora, setTempoMilitarFora] = useState<number>(0);
  const [tempoCivilFora, setTempoCivilFora] = useState<number>(0);
  const [sexo, setSexo] = useState<"masculino" | "feminino">("masculino");
  const [dataInclusao, setDataInclusao] = useState<string>("");

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 8) valor = valor.slice(0, 8);
    let formatada = valor;
    if (valor.length > 4) {
      formatada = valor.slice(0, 2) + "/" + valor.slice(2, 4) + "/" + valor.slice(4);
    } else if (valor.length > 2) {
      formatada = valor.slice(0, 2) + "/" + valor.slice(2);
    }
    setDataInclusao(formatada);
  };



  // Lembrando que toda vez que usa um setState, a página inteira é reconstruída
  // e o valor do estado é atualizado, então não precisa usar useEffect para isso
  const fracao = tempoTotal > 0 ? tempoAtual / tempoTotal : 0;
  const salarioProporcionalBruto = fracao * salario;
  const descontoPrev = salarioProporcionalBruto * 0.105;
  const descontoIR = calcularIR(salarioProporcionalBruto - descontoPrev, dependentes);
  const salarioProporcionalLiquido = salarioProporcionalBruto - descontoPrev - descontoIR - descontoSaude;


  const handleCalcularTempo = () => {
    const DIAS_EM_30_ANOS = 10957;
    const DIAS_EM_25_ANOS = 9131;
    let diasEfetivoServicoAteDezembro = tempoMilitarAteDezembro(dataInclusao);
    let diasComAverbMilitar = diasEfetivoServicoAteDezembro + tempoMilitarFora; //esse tempo militar é até 31 de dezembro de 2021

    //Aqui calcula o tempo de serviço militar mínimo, que deve ser pelo menos 25 anos e mais um pedágio de 120 dias por ano faltante conforme art. 90-B I b) da Lei 053
    let tempoFaltanteMilitar = DIAS_EM_25_ANOS - diasComAverbMilitar - tempoCivilFora;
    console.log("tempoFaltanteMilitar", tempoFaltanteMilitar)
    let anosFaltantesMilitar = tempoFaltanteMilitar / 365;
    console.log("anosFaltantesMilitar", anosFaltantesMilitar)
    let diasParaAcrescentar = Math.floor(anosFaltantesMilitar * 120);
    if (diasParaAcrescentar > 1825) diasParaAcrescentar = 1825; //limite de 5 anos para pedagio militar
    console.log("diasparaAcrescentar", diasParaAcrescentar)
    let diasDeServicoMilitarMinimoTotais = Math.floor(DIAS_EM_25_ANOS + diasParaAcrescentar);

    //Aqui calcula o tempo faltante de contribuição geral, a contar de 31 de dezembro de 2021, art. 90-B I a) 17% , mas por questões de arredondamento do javascript, to fazendo 16,9%
    let tempoTotalDeServicoAteDezembro = diasComAverbMilitar + tempoCivilFora;
    let tempoFaltanteComPedagioCivil = 0;
    if (sexo === "feminino") {
      tempoFaltanteComPedagioCivil = (DIAS_EM_25_ANOS - tempoTotalDeServicoAteDezembro) * 1.169;
    } else {
      tempoFaltanteComPedagioCivil = (DIAS_EM_30_ANOS - tempoTotalDeServicoAteDezembro) * 1.169;
    }
    let diasDeServicoMinimoTotais = Math.floor(tempoTotalDeServicoAteDezembro + tempoFaltanteComPedagioCivil)
    let diasTrabalhadosAteHoje = diasAteHoje(dataInclusao) + tempoMilitarFora + tempoCivilFora;

    if (diasDeServicoMilitarMinimoTotais > diasDeServicoMinimoTotais) {
      let efetivoServicoHoje = diasAteHoje(dataInclusao) + tempoMilitarFora;
      console.log("entrou no if")
      console.log("diasDeServicoMilitarMinimoTotais", diasDeServicoMilitarMinimoTotais)
      console.log("efetivoServicoHoje", efetivoServicoHoje)
      console.log("diasTrabalhadosAteHoje", diasTrabalhadosAteHoje)
      setTempoTotal(diasDeServicoMilitarMinimoTotais)
      setTempoAtual(diasTrabalhadosAteHoje);
    }
    else {
      console.log("entrou no else")
      console.log("diasDeServicoMilitarMinimoTotais", diasDeServicoMilitarMinimoTotais)
      console.log("diasTrabalhadosAteHoje", diasTrabalhadosAteHoje)
      setTempoTotal(diasDeServicoMinimoTotais)
      setTempoAtual(diasTrabalhadosAteHoje);
    }

  }

  return (
    <div id="app" className="app">
      <div id="cabecalho" className="cabecalho">
        <img id='logo-pmms' src={logo} alt="Logo PMMS" />
        <h1 className="titulo">Calculadora de Proventos Proporcionais</h1>
      </div>

      <div className="calculadora-tempo-servico">
        <h2 className="subtitulo">1º Passo: Calcule seu tempo de serviço</h2>
        <p>
          Se precisar de um cálculo mais detalhado, visite a <a
            href="https://sites.google.com/view/calculadora-rr"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Calculadora de Reserva Remunerada
          </a>{' '} criada pelo Sargento BM Kleyton Ribeiro.
        </p>
        <div className="formulario-dados">
          <div className="campo">
            <label>Averbação de tempo militar (dias)</label>
            <input
              type="number"
              min={0}
              value={tempoMilitarFora}

              onFocus={(e) => e.target.select()}
              onChange={(e) => setTempoMilitarFora(Number(e.target.value))}
            />
          </div>

          <div className="campo">
            <label>Averbação de tempo civil (em dias, máx 1825 que totalizam 5 anos)</label>
            <input
              type="number"
              min={0}
              value={tempoCivilFora}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setTempoCivilFora(Number(e.target.value) > 1825 ? 1825 : Number(e.target.value))}
            />
          </div>

          <div className="divSexo">
            <label>Sexo</label>
            <div className="radio-group-sexo">
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="masculino"
                  checked={sexo === "masculino"}
                  onChange={() => setSexo("masculino")}
                />
                Masculino
              </label>
              <label>
                <input
                  type="radio"
                  name="sexo"
                  value="feminino"
                  checked={sexo === "feminino"}
                  onChange={() => setSexo("feminino")}
                />
                Feminino
              </label>
            </div>
          </div>

          <div className="divDataInclusao">
            <label>Data de inclusão (dd/mm/aaaa)</label>
            <input
              type="text"
              maxLength={10}
              value={dataInclusao}
              onFocus={(e) => e.target.select()}
              onChange={handleDataChange}
              placeholder="dd/mm/aaaa"
            />
          </div>
          <button id='botao-calcular' onClick={handleCalcularTempo}>Calcular tempo</button>
          <p>Prossiga abaixo para calcular o salário proporcional</p>
        </div>
      </div>

      <div className="formulario">
        <form className="form">
        <h2 className="subtitulo">2º Passo: Simule o salário proporcional</h2>
          <div className="campo">
            <label>Tempo de serviço atual (dias)</label>
            <input
              type="number"
              value={tempoAtual}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setTempoAtual(Number(e.target.value))}
            />
          </div>

          <div className="campo">
            <label>Tempo total com pedágios (dias)</label>
            <input
              type="number"
              value={tempoTotal}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setTempoTotal(Number(e.target.value))}
            />
          </div>

          <div className="campo">
            <label>Salário atual (R$)</label>
            <input
              type="number"
              value={salario}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setSalario(Number(e.target.value))}
            />
          </div>

          <div className="campo">
            <label>Desconto do plano de saúde (R$)</label>
            <input
              type="number"
              value={descontoSaude}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setDescontoSaude(Number(e.target.value))}
            />
          </div>

          <div className="campo">
            <label>Dependentes que abatem IR</label>
            <input
              type="number"
              value={dependentes}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setDependentes(Number(e.target.value))}
            />
          </div>

          <div className="resultado">
            <p>
              <strong>Fração de tempo:</strong> {(fracao * 100).toFixed(2)}%
            </p>
            <p>
              <strong>Salário proporcional bruto:</strong> R${' '}
              {salarioProporcionalBruto.toFixed(2)}
            </p>
            <p>
              <strong>Desconto da previdência 10,5% (R$):</strong> R${' '}
              {descontoPrev.toFixed(2)}
            </p>
            <p>
              <strong>Desconto do Imposto de Renda (R$):</strong> R${' '}
              {descontoIR.toFixed(2)}
            </p>
            <br />
            <p>
              💰 <strong>Salário proporcional líquido estimado:</strong> R${' '}
              {salarioProporcionalLiquido.toFixed(2)}
            </p>
          </div>
        </form>
      </div>

      <br />

      <div id="rodape" className="rodape">
        <p className="creditos">
          <strong>
            © Desenvolvida por: Major QOPM William Scaramuzzi Teixeira
          </strong>
        </p>
        <p>Email: wsoficial1018@gmail.com</p>
      </div>
    </div>
  );
}

export default App;
