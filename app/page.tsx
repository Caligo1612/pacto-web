'use client'; 
import { useEffect, useState } from 'react';
import './globals.css';

export default function Home() {
  // =====================================================================
  // 1. MEMÓRIAS DA TELA (Estados)
  // =====================================================================
  const [listaPromessas, setListaPromessas] = useState<any[]>([]);
  const [textoPesquisa, setTextoPesquisa] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('Todas');
  
  // Memórias de Proteção Legal
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [caixaMarcada, setCaixaMarcada] = useState(false);
  const [recusouTermos, setRecusouTermos] = useState(false);

  // =====================================================================
  // 2. BUSCA DE DADOS NA NUVEM (Servidor Render)
  // =====================================================================
  // URL atualizada para buscar de todas as áreas no Render
  useEffect(() => {
    fetch('https://pacto-web.onrender.com/api/v1/promessas')
      .then((resposta) => resposta.json()) 
      .then((dadosRecebidos) => setListaPromessas(dadosRecebidos))
      .catch((erro) => console.log("Erro ao buscar dados do servidor:", erro));
  }, []);
  const promessasFiltradas = listaPromessas.filter((item) => {
    const combinaTexto = item.promessa.toLowerCase().includes(textoPesquisa.toLowerCase());
    const combinaArea = areaSelecionada === 'Todas' || item.area === areaSelecionada;
    return combinaTexto && combinaArea;
  });

  // =====================================================================
  // TELA DE RECUSA DOS TERMOS
  // =====================================================================
  if (recusouTermos) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>Acesso Encerrado</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Você optou por não aceitar os termos de uso. O PACTO respeita a sua decisão.</p>
          <button 
            onClick={() => setRecusouTermos(false)} 
            style={{ padding: '10px 20px', backgroundColor: '#004A8D', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Voltar e ler novamente
          </button>
        </div>
      </div>
    );
  }

  // =====================================================================
  // TELA DE PROTEÇÃO E TERMOS DE USO
  // =====================================================================
  if (!termosAceitos) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#002B52', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          
          <h1 style={{ color: '#004A8D', marginBottom: '20px', textAlign: 'center' }}>🏛️ Bem-vindo ao PACTO</h1>
          
          <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Propósito e Valores</h2>
          <p style={{ color: '#555', marginBottom: '15px', lineHeight: '1.6' }}>
            O PACTO é uma ferramenta de inteligência cívica construída para a sociedade. Nossa missão é <strong>apartidária e educativa</strong>. O objetivo desta plataforma não é atacar ou derrubar figuras políticas, mas sim fomentar a transparência e gerar cidadãos mais conscientes sobre o uso do dinheiro público.
          </p>

          <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Origem dos Dados e Direitos</h2>
          <p style={{ color: '#555', marginBottom: '25px', lineHeight: '1.6' }}>
            Todas as informações exibidas são extraídas e cruzadas a partir de plataformas digitais públicas e oficiais do governo. Podem ocorrer pequenas margens de erro ou atrasos inerentes à atualização desses portais de origem. A lógica analítica, o design e o código-fonte desta plataforma são propriedades protegidas por direitos autorais.
          </p>

          {/* CAIXA DE SELEÇÃO OBRIGATÓRIA */}
          <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F9FAFB', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            <input 
              type="checkbox" 
              id="aceito"
              checked={caixaMarcada}
              onChange={(e) => setCaixaMarcada(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="aceito" style={{ color: '#333', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
              Declaro que li, compreendo e aceito os termos descritos acima.
            </label>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <button 
              disabled={!caixaMarcada}
              onClick={() => setTermosAceitos(true)}
              style={{ 
                width: '100%', padding: '15px', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', 
                cursor: caixaMarcada ? 'pointer' : 'not-allowed', 
                backgroundColor: caixaMarcada ? '#10B981' : '#A7F3D0',
                transition: 'background-color 0.3s'
              }}
            >
              Aceitar e Entrar
            </button>

            <button 
              onClick={() => setRecusouTermos(true)}
              style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Não aceitar e Sair
            </button>
          </div>
          
        </div>
      </div>
    );
  }

  // =====================================================================
  // TELA DE CARREGAMENTO
  // =====================================================================
  if (listaPromessas.length === 0) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>⏳ Carregando o Motor Analítico do PACTO...</h2>
      </div>
    );
  }

  // =====================================================================
  // TELA PRINCIPAL (Painel Web)
  // =====================================================================
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      
      <div style={{ backgroundColor: '#004A8D', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h1>🏛️ PACTO Web</h1>
        <p>Promessas. Dinheiro. Resultados.</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['Todas', 'Saúde', 'Segurança Pública', 'Infraestrutura'].map((area) => (
          <button 
            key={area} onClick={() => setAreaSelecionada(area)}
            style={{
              padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
              backgroundColor: areaSelecionada === area ? '#004A8D' : '#E5E7EB',
              color: areaSelecionada === area ? 'white' : '#374151'
            }}
          >
            {area}
          </button>
        ))}
      </div>

      <input 
        type="text" placeholder="Pesquise por uma promessa..."
        value={textoPesquisa} onChange={(e) => setTextoPesquisa(e.target.value)}
        style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #CCC', marginBottom: '30px' }}
      />

      {promessasFiltradas.map((dados) => (
        <div key={dados.id} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          
          <h2 style={{ color: '#004A8D', textTransform: 'uppercase', fontSize: '14px' }}>{dados.entidade} | {dados.area}</h2>
          <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '10px' }}>{dados.promessa}</h1>
          
          <span style={{ 
            backgroundColor: dados.status_geral === 'ATRASADA' ? '#EF4444' : dados.status_geral === 'CONCLUÍDA' ? '#10B981' : '#D97706', 
            color: 'white', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' 
          }}>
            Status: {dados.status_geral}
          </span>

          {dados.alerta_analitico && (
            <div style={{ backgroundColor: dados.alerta_analitico.corFundo, color: dados.alerta_analitico.corTexto, padding: '12px', borderRadius: '6px', marginTop: '15px', border: `1px solid ${dados.alerta_analitico.corTexto}`, fontWeight: 'bold' }}>
              {dados.alerta_analitico.mensagem}
            </div>
          )}

          <div style={{ marginTop: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#F9FAFB', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #3B82F6' }}>
              <h3 style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>📋 Planejamento</h3>
              <p><strong>Origem:</strong> {dados.fases_evidencia.planejamento.origem}</p>
              <p><strong>Meta:</strong> {dados.fases_evidencia.planejamento.meta_estipulada}</p>
            </div>
            
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#F9FAFB', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #10B981' }}>
              <h3 style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>💰 Orçamento</h3>
              <p><strong>Dotação:</strong> {dados.fases_evidencia.orcamento.dotacao_atualizada}</p>
              <p><strong>Empenhado:</strong> {dados.fases_evidencia.orcamento.empenhado}</p>
            </div>
            
            <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#F9FAFB', padding: '15px', borderRadius: '6px', borderLeft: '8px solid #8B5CF6' }}>
              <h3 style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>✅ Resultado</h3>
              <p><strong>Concluídas:</strong> {dados.fases_evidencia.execucao.obras_concluidas}</p>
              
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong style={{ fontSize: '14px', color: '#333' }}>Execução Real</strong>
                  <strong style={{ fontSize: '14px', color: '#10B981' }}>{dados.fases_evidencia.execucao.percentual_execucao}</strong>
                </div>
                
                <div style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', backgroundColor: '#10B981', 
                    width: dados.fases_evidencia.execucao.percentual_execucao, 
                    transition: 'width 1s ease-in-out' 
                  }} />
                </div>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}