'use client'; 
import { useEffect, useState } from 'react';
import './globals.css';

export default function Home() {
  const [listaPromessas, setListaPromessas] = useState<any[]>([]);
  const [indicadoresGlobais, setIndicadoresGlobais] = useState<any>(null);
  const [textoPesquisa, setTextoPesquisa] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('Todas');
  
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [caixaMarcada, setCaixaMarcada] = useState(false);
  const [recusouTermos, setRecusouTermos] = useState(false);

  // Busca de Promessas e Indicadores no Backend do Render
  useEffect(() => {
    fetch('https://pacto-web.onrender.com/api/v1/promessas')
      .then((res) => res.json())
      .then((dados) => setListaPromessas(dados))
      .catch((err) => console.log("Erro ao buscar promessas:", err));

    fetch('https://pacto-web.onrender.com/api/v1/indicadores')
      .then((res) => res.json())
      .then((dados) => setIndicadoresGlobais(dados))
      .catch((err) => console.log("Erro ao buscar indicadores:", err));
  }, []);

  // Extrai dinamicamente a lista de todas as secretarias cadastradas no banco de dados
  const secretariasDisponiveis = ['Todas', ...Array.from(new Set(listaPromessas.map(item => item.area)))];

  const promessasFiltradas = listaPromessas.filter((item) => {
    const combinaTexto = item.promessa.toLowerCase().includes(textoPesquisa.toLowerCase());
    const combinaArea = areaSelecionada === 'Todas' || item.area === areaSelecionada;
    return combinaTexto && combinaArea;
  });

  const exportarParaCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID;Entidade;Secretaria;Promessa;Status;Orçamento Atualizado;Percentual Execução\n";
    promessasFiltradas.forEach((item) => {
      const linha = `"${item.id}";"${item.entidade}";"${item.area}";"${item.promessa}";"${item.status_geral}";"${item.fases_evidencia.orcamento.dotacao_atualizada}";"${item.fases_evidencia.execucao.percentual_execucao}"`;
      csvContent += linha + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_pacto_${areaSelecionada.toLowerCase().replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (recusouTermos) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div>
          <h2 style={{ color: '#1E293B', marginBottom: '15px' }}>Acesso Encerrado</h2>
          <p style={{ color: '#64748B', marginBottom: '20px' }}>Você optou por não aceitar os termos de uso.</p>
          <button onClick={() => setRecusouTermos(false)} style={{ padding: '12px 24px', backgroundColor: '#0F172A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Voltar e ler novamente
          </button>
        </div>
      </div>
    );
  }

  if (!termosAceitos) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#0F172A', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
          <h1 style={{ color: '#0F172A', marginBottom: '20px', textAlign: 'center', fontSize: '24px' }}>🏛️ Bem-vindo ao PACTO</h1>
          <h2 style={{ fontSize: '16px', color: '#334155', marginBottom: '8px' }}>Propósito e Valores</h2>
          <p style={{ color: '#475569', marginBottom: '16px', lineHeight: '1.6', fontSize: '14px' }}>
            O PACTO é uma ferramenta de inteligência cívica apartidária e educativa para transformar dados de todas as secretarias em informações compreensíveis.
          </p>
          <h2 style={{ fontSize: '16px', color: '#334155', marginBottom: '8px' }}>Origem dos Dados e Direitos</h2>
          <p style={{ color: '#475569', marginBottom: '24px', lineHeight: '1.6', fontSize: '14px' }}>
            Informações oficiais extraídas de portais do governo. Código e design protegidos por direitos autorais.
          </p>
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <input type="checkbox" id="aceito" checked={caixaMarcada} onChange={(e) => setCaixaMarcada(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            <label htmlFor="aceito" style={{ color: '#1E293B', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none', fontSize: '14px' }}>
              Declaro que li, compreendo e aceito os termos descritos acima.
            </label>
          </div>
          <button disabled={!caixaMarcada} onClick={() => setTermosAceitos(true)} style={{ width: '100%', padding: '16px', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: caixaMarcada ? 'pointer' : 'not-allowed', backgroundColor: caixaMarcada ? '#059669' : '#A7F3D0', transition: 'background-color 0.3s' }}>
            Aceitar e Entrar
          </button>
          <button onClick={() => setRecusouTermos(true)} style={{ width: '100%', padding: '14px', backgroundColor: 'transparent', color: '#DC2626', border: '1px solid #DC2626', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '12px' }}>
            Não aceitar e Sair
          </button>
        </div>
      </div>
    );
  }

  if (listaPromessas.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#475569' }}>
        <h2>⏳ Carregando as 24 Secretarias do Governo no PACTO...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Cabeçalho */}
      <div style={{ backgroundColor: '#0F172A', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>🏛️ PACTO Web</h1>
          <p style={{ color: '#94A3B8', fontSize: '15px' }}>Promessas. Dinheiro. Resultados. (24 Secretarias)</p>
        </div>
        <button onClick={exportarParaCSV} style={{ backgroundColor: '#059669', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          📥 Baixar Relatório (CSV)
        </button>
      </div>

      {/* Painel de Indicadores Globais */}
      {indicadoresGlobais && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '5px solid #0F172A' }}>
            <p style={{ color: '#64748B', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Total de Metas</p>
            <h2 style={{ color: '#0F172A', fontSize: '32px', marginTop: '6px' }}>{indicadoresGlobais.total_metas}</h2>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '5px solid #059669' }}>
            <p style={{ color: '#64748B', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Média de Execução</p>
            <h2 style={{ color: '#059669', fontSize: '32px', marginTop: '6px' }}>{indicadoresGlobais.media_execucao_global}</h2>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '5px solid #DC2626' }}>
            <p style={{ color: '#64748B', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Metas Atrasadas</p>
            <h2 style={{ color: '#DC2626', fontSize: '32px', marginTop: '6px' }}>{indicadoresGlobais.total_atrasadas}</h2>
          </div>
        </div>
      )}

      {/* Seletor Dinâmico de Secretarias (Dropdown otimizado para as 24 pastas) */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0' }}>
        <label htmlFor="seletor-secretaria" style={{ display: 'block', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px', fontSize: '14px' }}>
          🏢 Filtrar por Secretaria do Governo:
        </label>
        <select 
          id="seletor-secretaria"
          value={areaSelecionada} 
          onChange={(e) => setAreaSelecionada(e.target.value)}
          style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#1E293B', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}
        >
          {secretariasDisponiveis.map(( secretaria ) => (
            <option key={secretaria} value={secretaria}>
              {secretaria === 'Todas' ? '📂 Todas as Secretarias do Estado de SP' : secretaria}
            </option>
          ))}
        </select>
      </div>

      {/* Barra de Pesquisa */}
      <input type="text" placeholder="🔍 Pesquise por uma promessa específica..." value={textoPesquisa} onChange={(e) => setTextoPesquisa(e.target.value)} style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '10px', border: '1px solid #CBD5E1', marginBottom: '24px', backgroundColor: 'white', outline: 'none' }} />

      {/* Listagem de Cartões */}
      {promessasFiltradas.map((dados) => (
        <div key={dados.id} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0F172A', backgroundColor: '#F1F5F9', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase' }}>
              {dados.entidade} • {dados.area}
            </span>
            <span style={{ backgroundColor: dados.status_geral === 'ATRASADA' ? '#FEE2E2' : dados.status_geral === 'CONCLUÍDA' ? '#DCFCE7' : '#FEF3C7', color: dados.status_geral === 'ATRASADA' ? '#DC2626' : dados.status_geral === 'CONCLUÍDA' ? '#16A34A' : '#D97706', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
              {dados.status_geral}
            </span>
          </div>

          <h2 style={{ color: '#1E293B', fontSize: '20px', marginBottom: '16px', lineHeight: '1.4' }}>{dados.promessa}</h2>

          {dados.alerta_analitico && (
            <div style={{ backgroundColor: dados.alerta_analitico.corFundo, color: dados.alerta_analitico.corTexto, padding: '14px', borderRadius: '8px', marginBottom: '20px', border: `1px solid ${dados.alerta_analitico.corTexto}`, fontSize: '14px', fontWeight: 'bold' }}>
              {dados.alerta_analitico.mensagem}
            </div>
          )}

          {/* Grid de Evidências */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
              <h3 style={{ fontSize: '14px', color: '#334155', marginBottom: '8px', fontWeight: 'bold' }}>📋 Planejamento</h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}><strong>Origem:</strong> {dados.fases_evidencia.planejamento.origem}</p>
              <p style={{ fontSize: '13px', color: '#64748B' }}><strong>Meta:</strong> {dados.fases_evidencia.planejamento.meta_estipulada}</p>
            </div>
            
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
              <h3 style={{ fontSize: '14px', color: '#334155', marginBottom: '8px', fontWeight: 'bold' }}>💰 Orçamento</h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}><strong>Dotação:</strong> {dados.fases_evidencia.orcamento.dotacao_atualizada}</p>
              <p style={{ fontSize: '13px', color: '#64748B' }}><strong>Empenhado:</strong> {dados.fases_evidencia.orcamento.empenhado}</p>
            </div>
            
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', borderLeft: '8px solid #8B5CF6' }}>
              <h3 style={{ fontSize: '14px', color: '#334155', marginBottom: '8px', fontWeight: 'bold' }}>✅ Resultado</h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px' }}><strong>Concluídas:</strong> {dados.fases_evidencia.execucao.obras_concluidas}</p>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold' }}>Execução Real</span>
                  <span style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>{dados.fases_evidencia.execucao.percentual_execucao}</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#E2E8F0', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: '#059669', width: dados.fases_evidencia.execucao.percentual_execucao }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}