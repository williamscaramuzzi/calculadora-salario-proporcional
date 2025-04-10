import { useState, useEffect } from 'react'
import { calcularIR } from './calculair';
import logo from './assets/logopmms.svg';
import tempoContribHojeExemplo from './assets/tempo-contrib-hoje-exemplo.png';
import tempoContribTotal from './assets/tempo-contrib-total.png';

function App() {
  const [tempoAtual, setTempoAtual] = useState<number>(0);
  const [tempoTotal, setTempoTotal] = useState<number>(0);
  const [salario, setSalario] = useState<number>(0);
  const [descontoPrev, setDescontoPrev] = useState<number>(0);
  const [descontoIR, setDescontoIR] = useState<number>(0);
  const [descontoSaude, setDescontoSaude] = useState<number>(0);
  const [dependentes, setDependentes] = useState<number>(0);

  const fracao = tempoTotal > 0 ? tempoAtual / tempoTotal : 0;
  const salarioProporcionalBruto = fracao * salario;
  const salarioProporcionalLiquido = salarioProporcionalBruto - descontoPrev - descontoIR - descontoSaude;

  useEffect(() => {
    const descontoIR = calcularIR(salarioProporcionalBruto - descontoPrev, dependentes);
    setDescontoIR(descontoIR);
  }, [salarioProporcionalBruto, descontoPrev, dependentes]);

  return (
    <div id='app' className="app">
      <div id="cabecalho" className="cabecalho">
        <img src={logo} alt="Logo PMMS" />
        <h1 className="titulo">Calculadora de Proventos Proporcionais</h1>
      </div>

      <div className="bloco-principal">
        <h2 className="subtitulo">Calcule seu tempo de serviço</h2>
        <p className="texto-justificado">
          Acesse o site {" "}
          <a
            href="https://sites.google.com/view/calculadora-rr"
            className="link"
          >
            Calculadora de Reserva Remunerada 
          </a>
          {" "}desenvolvido pelo Sargento BM Kleyton Ribeiro e calcule seu tempo de serviço atual e total com as mudanças na previdência.
        </p>

        <div className="imagem-explicativa">
          <span className="descricao">Anote o Tempo de contribuição hoje</span>
          <img src={tempoContribHojeExemplo} alt="tempo contribuição atual" className="imagem" />
        </div>

        <div className="imagem-explicativa">
          <span className="descricao">
            Abra o cálculo detalhado e anote o número de dias totais em Contribuição para reserva remunerada integral
          </span>
          <img src={tempoContribTotal} alt="tempo total" className="imagem" />
        </div>

        <p>Após isso, preencha os campos abaixo com os dados que você obteve na calculadora.</p>
      </div>

      <div className="formulario">
        <form className="form">
          <div className="campo">
            <label>Tempo de serviço atual (dias)</label>
            <input type="number" value={tempoAtual}
            onFocus={(e) => e.target.select()} 
            onChange={(e) => setTempoAtual(Number(e.target.value))} />
          </div>

          <div className="campo">
            <label>Tempo total com pedágios (dias)</label>
            <input type="number" value={tempoTotal}
            onFocus={(e) => e.target.select()} 
            onChange={(e) => setTempoTotal(Number(e.target.value))} />
          </div>

          <div className="campo">
            <label>Salário atual (R$)</label>
            <input
              type="number"
              value={salario}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                setSalario(Number(e.target.value));
                setDescontoPrev(salarioProporcionalBruto * 0.105);
              }}
            />
          </div>

          <div className="campo">
            <label>Desconto do plano de saúde (R$)</label>
            <input type="number" value={descontoSaude} onFocus={(e) => e.target.select()} onChange={(e) => setDescontoSaude(Number(e.target.value))} />
          </div>

          <div className="campo">
            <label>Dependentes que abatem IR</label>
            <input type="number" onFocus={(e) => e.target.select()} onChange={(e) => setDependentes(Number(e.target.value))} />
          </div>

          <div className="resultado">
            <p><strong>Fração de tempo:</strong> {(fracao * 100).toFixed(2)}%</p>
            <p><strong>Salário proporcional bruto:</strong> R$ {salarioProporcionalBruto.toFixed(2)}</p>
            <p><strong>Desconto da previdência 10,5% (R$):</strong> R$ {descontoPrev}</p>
            <p><strong>Desconto do Imposto de Renda (R$):</strong> R$ {descontoIR}</p>
            <br />
            <p>💰 <strong>Salário proporcional líquido estimado:</strong> R$ {salarioProporcionalLiquido.toFixed(2)}</p>
          </div>
        </form>
      </div>

      <br />

      <div id="rodape" className="rodape">
          <p className="creditos"><strong>© Desenvolvida por: Major QOPM William Scaramuzzi Teixeira</strong></p>
          <p>Email: wsoficial1018@gmail.com</p>
      </div>

    </div>
  )
}

export default App
