'use client'; 
import { useEffect, useState } from 'react';
import './globals.css';

export default function Home() {
  const [listaPromessas, setListaPromessas] = useState<any[]>([]);
  const [listaContratos, setListaContratos] = useState<any[]>([]);
  const [listaObras, setListaObras] = useState<any[]>([]);
  const [listaAlertas, setListaAlertas] = useState<any[]>([]);
  const [indicadoresGlobais, setIndicadoresGlobais] = useState<any>(null);
  
  // Controle de Abas e Filtros
  const [abaAtiva, setAbaAtiva] = useState<'metas' | 'contratos' | 'obras' | 'alertas'>('metas');
  const [textoPesquisa, setTextoPesquisa] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('Todas');
  
  // Estado para o Filtro de Obras Estratégicas (IDEIA 2)
  const [filtroEstrategica, setFiltroEstrategica] = useState(false);
  
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [caixaMarcada, setCaixaMarcada] = useState(false);
  const [recusouTermos, setRecusouTermos] = useState(false);

  // Busca de Dados no Backend do Render
  useEffect(() => {
    fetch('https://pacto-web.onrender.com/api/v1/promessas')
      .then((res) => res.json())
      .then((dados) => setListaPromessas(dados))
      .catch((err) => console.log("Erro ao buscar promessas:", err));

    fetch('https://pacto-web.onrender.com/api/v1/contratos')
      .then((res) => res.json())
      .then((dados) => setListaContratos(dados))
      .catch((err) => console.log("Erro ao buscar contratos:", err));

    fetch('https://pacto-web.onrender.com/api/v1/obras')
      .then((res) => res.json())
      .then((dados) => setListaObras(dados))
      .catch((err) => console.log("Erro ao buscar obras:", err));

    fetch('https://pacto-web.onrender.com/api/v1/alertas')
      .then((res) => res.json())
      .then((dados) => setListaAlertas(dados))
      .catch((err) => console.log("Erro ao buscar alertas:", err));

    fetch('https://pacto-web.onrender.com/api/v1/indicadores')
      .then((res) => res.json())
      .then((dados) => setIndicadoresGlobais(dados))
      .catch((err) => console.log("Erro ao buscar indicadores:", err));
  }, []);

  const secretariasDisponiveis = ['Todas', ...Array.from(new Set(listaPromessas.map(item => item.area)))];

  const promessasFiltradas = listaPromessas.filter((item) => {
    const combinaTexto = item.promessa.toLowerCase().includes(textoPesquisa.toLowerCase());
    const combinaArea = areaSelecionada === 'Todas' || item.area === areaSelecionada;
    return combinaTexto && combinaArea;
  });

  const contratosFiltrados = listaContratos.filter((item) => {
    const combinaTexto = item.objeto.toLowerCase().includes(textoPesquisa.toLowerCase()) || 
                         item.fornecedor.toLowerCase().includes(textoPesquisa.toLowerCase());
    const combinaArea = areaSelecionada === 'Todas' || item.secretaria === areaSelecionada;
    return combinaTexto && combinaArea;
  });

  // Filtro de Obras (Aprimorado com a IDEIA 2)
  const obrasFiltradas = listaObras.filter((item) => {
    const combinaTexto = item.nome.toLowerCase().includes(textoPesquisa.toLowerCase()) || 
                         item.descricao.toLowerCase().includes(textoPesquisa.toLowerCase());
    const combinaArea = areaSelecionada === 'Todas' || item.secretaria === areaSelecionada;
    const combinaEstrategica = filtroEstrategica ? item.estrategica === true : true;
    return combinaTexto && combinaArea && combinaEstrategica;
  });

  const alertasFiltrados = listaAlertas.filter((item) => {
    const combinaTexto = item.titulo.toLowerCase().includes(textoPesquisa.toLowerCase()) || 
                         item.descricao.toLowerCase().includes(textoPesquisa.toLowerCase());
    const combinaArea = areaSelecionada === 'Todas' || item.entidade_relacionada === areaSelecionada;
    return combinaTexto && combinaArea;
  });

  const exportarParaCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID;Secretaria;Nome/Objeto/Titulo;Status/Severidade;Detalhe\n";
    
    if (abaAtiva === 'metas') {
      promessasFiltradas.forEach((item) => { csvContent += `"${item.id}";"${item.area}";"${item.promessa}";"${item.status_geral}";"${item.fases_evidencia.orcamento.dotacao_atualizada}"\r\n`; });
    } else if (abaAtiva === 'contratos') {
      contratosFiltrados.forEach((item) => { csvContent += `"${item.id_contrato}";"${item.secretaria}";"${item.objeto}";"${item.status}";"${item.valor_atualizado}"\r\n`; });
    } else if (abaAtiva === 'obras') {
      obrasFiltradas.forEach((item) => { csvContent += `"${item.id_obra}";"${item.secretaria}";"${item.nome}";"${item.status}";"${item.valor_obra}"\r\n`; });
    } else {
      alertasFiltrados.forEach((item) => { csvContent += `"${item.id_alerta}";"${item.entidade_relacionada}";"${item.titulo}";"${item.severidade}";"${item.status}"\r\n`; });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_pacto_${abaAtiva}_${areaSelecionada.toLowerCase().replace(/ /g, '_')}.csv`);
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
          <button onClick={() => setRecusouTermos(false)} style={{ padding: '12px 24px', backgroundColor: '#0F172A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Voltar e ler novamente</button>
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
            O PACTO é uma ferramenta de inteligência cívica para transformar dados públicos em informações transparentes.
          </p>
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <input type="checkbox" id="aceito" checked={caixaMarcada} onChange={(e) => setCaixaMarcada(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            <label htmlFor="aceito" style={{ color: '#1E293B', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none', fontSize: '14px' }}>Declaro que li e aceito os termos.</label>
          </div>
          <button disabled={!caixaMarcada} onClick={() => setTermosAceitos(true)} style={{ width: '100%', padding: '16px', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: caixaMarcada ? 'pointer' : 'not-allowed', backgroundColor: caixaMarcada ? '#059669' : '#A7F3D0' }}>Aceitar e Entrar</button>
        </div>
      </div>
    );
  }

  if (listaPromessas.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif', color: '#475569' }}>
        <h2>⏳ Carregando o PACTO Completo...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Cabeçalho */}
      <div style={{ backgroundColor: '#0F172A', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>🏛️ PACTO Web</h1>
          <p style={{ color: '#94A3B8', fontSize: '15px' }}>Promessas. Dinheiro. Resultados. (Ecossistema Completo)</p>
        </div>
        <button onClick={exportarParaCSV} style={{ backgroundColor: '#059669', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📥 Baixar Relatório ({abaAtiva.toUpperCase()})
        </button>
      </div>

      {/* Painel de Indicadores Globais */}
      {indicadoresGlobais && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #0F172A' }}>
            <p style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>Total de Metas</p>
            <h2 style={{ color: '#0F172A', fontSize: '22px', marginTop: '4px' }}>{indicadoresGlobais.total_metas}</h2>
          </div>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #059669' }}>
            <p style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>Média Execução</p>
            <h2 style={{ color: '#059669', fontSize: '22px', marginTop: '4px' }}>{indicadoresGlobais.media_execucao_global}</h2>
          </div>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #3B82F6' }}>
            <p style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>Contratos</p>
            <h2 style={{ color: '#3B82F6', fontSize: '22px', marginTop: '4px' }}>{indicadoresGlobais.total_contratos_monitorados}</h2>
          </div>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #8B5CF6' }}>
            <p style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>Obras Geo</p>
            <h2 style={{ color: '#8B5CF6', fontSize: '22px', marginTop: '4px' }}>{indicadoresGlobais.total_obras_geolocalizadas}</h2>
          </div>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #DC2626' }}>
            <p style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }}>Alertas Analíticos</p>
            <h2 style={{ color: '#DC2626', fontSize: '22px', marginTop: '4px' }}>{indicadoresGlobais.total_alertas_analiticos}</h2>
          </div>
        </div>
      )}

      {/* Navegação por Abas */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setAbaAtiva('metas')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: abaAtiva === 'metas' ? '#0F172A' : '#E2E8F0', color: abaAtiva === 'metas' ? 'white' : '#475569' }}>🎯 Metas e Promessas</button>
        <button onClick={() => setAbaAtiva('contratos')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: abaAtiva === 'contratos' ? '#0F172A' : '#E2E8F0', color: abaAtiva === 'contratos' ? 'white' : '#475569' }}>📑 Contratos e Fornecedores</button>
        <button onClick={() => setAbaAtiva('obras')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: abaAtiva === 'obras' ? '#0F172A' : '#E2E8F0', color: abaAtiva === 'obras' ? 'white' : '#475569' }}>🏗️ Obras Públicas</button>
        <button onClick={() => setAbaAtiva('alertas')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: abaAtiva === 'alertas' ? '#0F172A' : '#E2E8F0', color: abaAtiva === 'alertas' ? 'white' : '#475569' }}>🚨 Alertas Analíticos</button>
      </div>

      {/* Botão de Filtro Estratégico (Só aparece na aba de Obras - IDEIA 2) */}
      {abaAtiva === 'obras' && (
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setFiltroEstrategica(!filtroEstrategica)} 
            style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: filtroEstrategica ? '#FEF08A' : '#F8FAFC', color: filtroEstrategica ? '#854D0E' : '#475569', borderBottom: filtroEstrategica ? '3px solid #EAB308' : '3px solid #CBD5E1', transition: 'all 0.2s' }}
          >
            {filtroEstrategica ? '⭐ Visualizando Obras Estratégicas' : '⬜ Filtrar Obras Estratégicas'}
          </button>
        </div>
      )}

      {/* Seletor Dinâmico de Secretarias */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
        <label htmlFor="seletor-secretaria" style={{ display: 'block', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px', fontSize: '14px' }}>🏢 Filtrar por Secretaria:</label>
        <select id="seletor-secretaria" value={areaSelecionada} onChange={(e) => setAreaSelecionada(e.target.value)} style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#1E293B', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}>
          {secretariasDisponiveis.map(( secretaria ) => (
            <option key={secretaria} value={secretaria}>{secretaria === 'Todas' ? '📂 Todas as Secretarias do Estado de SP' : secretaria}</option>
          ))}
        </select>
      </div>

      {/* Barra de Pesquisa */}
      <input type="text" placeholder={abaAtiva === 'metas' ? "🔍 Pesquise por promessa..." : abaAtiva === 'contratos' ? "🔍 Pesquise por contrato ou fornecedor..." : abaAtiva === 'obras' ? "🔍 Pesquise por nome da obra..." : "🔍 Pesquise por título do alerta..."} value={textoPesquisa} onChange={(e) => setTextoPesquisa(e.target.value)} style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '10px', border: '1px solid #CBD5E1', marginBottom: '24px', backgroundColor: 'white', outline: 'none' }} />

      {/* ========================================== */}
      {/* RENDERIZAÇÃO DA ABA: METAS E PROMESSAS     */}
      {/* ========================================== */}
      {abaAtiva === 'metas' && promessasFiltradas.map((dados) => (
        <div key={dados.id} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
          
          {/* Selo Oficial de Rastreabilidade (IDEIA 1) */}
          {dados.referencia_plano && (
            <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#EFF6FF', color: '#1E3A8A', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px', border: '1px solid #BFDBFE' }}>
              📘 Previsto no Plano de Governo Oficial - Eixo: {dados.referencia_plano.eixo} ({dados.referencia_plano.pagina})
            </div>
          )}

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

      {/* ========================================== */}
      {/* RENDERIZAÇÃO DA ABA: CONTRATOS               */}
      {/* ========================================== */}
      {abaAtiva === 'contratos' && contratosFiltrados.map((item) => (
        <div key={item.id_contrato} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#3B82F6', backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase' }}>
              Contrato: {item.id_contrato} • Secretaria: {item.secretaria}
            </span>
            <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
              {item.status}
            </span>
          </div>
          <h2 style={{ color: '#1E293B', fontSize: '18px', marginBottom: '12px', lineHeight: '1.4' }}>{item.objeto}</h2>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3B82F6', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#1E293B', marginBottom: '6px' }}><strong>Fornecedor:</strong> {item.fornecedor} (CNPJ: {item.cnpj})</p>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}><strong>Processo SEI:</strong> {item.processo_sei} | <strong>Assinatura:</strong> {item.data_assinatura} | <strong>Vigência:</strong> {item.vigencia}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F5F9', padding: '12px 16px', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px', color: '#475569' }}>Valor Inicial: <strong>{item.valor_inicial}</strong></span>
            <span style={{ fontSize: '14px', color: '#059669', fontWeight: 'bold' }}>Valor Atualizado: {item.valor_atualizado}</span>
          </div>
        </div>
      ))}

      {/* ========================================== */}
      {/* RENDERIZAÇÃO DA ABA: OBRAS PÚBLICAS          */}
      {/* ========================================== */}
      {abaAtiva === 'obras' && obrasFiltradas.map((obra) => (
        <div key={obra.id_obra} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px', border: obra.estrategica ? '2px solid #FEF08A' : '1px solid #E2E8F0' }}>
          
          {/* Badge de Obra Estratégica (IDEIA 2) */}
          {obra.estrategica && (
            <div style={{ display: 'inline-flex', backgroundColor: '#FEF08A', color: '#854D0E', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px' }}>
              ⭐ Obra Estratégica Prioritária
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B5CF6', backgroundColor: '#F3E8FF', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase' }}>
              Obra: {obra.id_obra} • Secretaria: {obra.secretaria}
            </span>
            <span style={{ backgroundColor: '#F3E8FF', color: '#7C3AED', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
              {obra.status}
            </span>
          </div>
          <h2 style={{ color: '#1E293B', fontSize: '18px', marginBottom: '10px', lineHeight: '1.4' }}>{obra.nome}</h2>
          <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>{obra.descricao}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #8B5CF6' }}>
              <h3 style={{ fontSize: '13px', color: '#334155', marginBottom: '6px', fontWeight: 'bold' }}>📍 Geolocalização & Local</h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}><strong>Local:</strong> {obra.localizacao}</p>
              <p style={{ fontSize: '12px', color: '#64748B' }}><strong>Lat/Lng:</strong> {obra.latitude}, {obra.longitude}</p>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
              <h3 style={{ fontSize: '13px', color: '#334155', marginBottom: '6px', fontWeight: 'bold' }}>💰 Custos e Prazos</h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}><strong>Valor:</strong> {obra.valor_obra}</p>
              <p style={{ fontSize: '12px', color: '#64748B' }}><strong>Previsão Término:</strong> {obra.previsao_termino}</p>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', color: '#334155', marginBottom: '8px', fontWeight: 'bold' }}>📜 Histórico Cronológico da Obra</h3>
            {obra.historico.map((h: string, index: number) => (
              <p key={index} style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>• {h}</p>
            ))}
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: 'bold' }}>Progresso Físico</span>
              <span style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 'bold' }}>{obra.percentual_execucao}</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#E2E8F0', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: '#7C3AED', width: obra.percentual_execucao }} />
            </div>
          </div>
        </div>
      ))}

      {/* ========================================== */}
      {/* RENDERIZAÇÃO DA ABA: ALERTAS ANALÍTICOS      */}
      {/* ========================================== */}
      {abaAtiva === 'alertas' && alertasFiltrados.map((alerta) => (
        <div key={alerta.id_alerta} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase' }}>
              Alerta: {alerta.id_alerta} • Área: {alerta.entidade_relacionada}
            </span>
            <span style={{ backgroundColor: alerta.severidade === 'CRÍTICO' ? '#FEE2E2' : alerta.severidade === 'ATENÇÃO' ? '#FEF3C7' : '#E0F2FE', color:alerta.severidade === 'CRÍTICO' ? '#DC2626' : alerta.severidade === 'ATENÇÃO' ? '#D97706' : '#0369A1', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
              Severidade: {alerta.severidade}
            </span>
          </div>
          <h2 style={{ color: '#1E293B', fontSize: '18px', marginBottom: '12px', lineHeight: '1.4' }}>{alerta.titulo}</h2>
          <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>{alerta.descricao}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#64748B' }}>
            <span>Data de Emissão: <strong>{alerta.data_emissao}</strong></span>
            <span>Status do Alerta: <strong style={{ color: alerta.status === 'Ativo' ? '#DC2626' : '#059669' }}>{alerta.status}</strong></span>
          </div>
        </div>
      ))}

    </div>
  );
}