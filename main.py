from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="API PACTO - Inteligência Cívica",
    description="Backend oficial da plataforma PACTO com Filtro de Obras Estratégicas.",
    version="2.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IndicadoresGlobaisModel(BaseModel):
    total_metas: int
    media_execucao_global: str
    total_atrasadas: int
    total_contratos_monitorados: int
    total_obras_geolocalizadas: int
    total_alertas_analiticos: int
    fontes_integradas_ativas: int

# =====================================================================
# BANCO DE DADOS: 24 SECRETARIAS (Preservadas com Referência Oficial)
# =====================================================================
BANCO_DE_DADOS_PACTO = [
    {
        "id": 1, "entidade": "Governo do Estado de São Paulo", "area": "Casa Civil",
        "promessa": "Coordenação estratégica de políticas públicas e articulação interinstitucional.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Gestão Pública e Governo Digital", "pagina": "Pág. 38"},
        "fases_evidencia": {
            "planejamento": {"origem": "Diretrizes de Governança", "meta_estipulada": "100% dos pactos integrados"},
            "orcamento": {"dotacao_atualizada": "R$ 50.000.000,00", "empenhado": "R$ 35.000.000,00"},
            "execucao": {"obras_concluidas": "Integração ativa", "percentual_execucao": "70%"}
        }
    },
    {
        "id": 2, "entidade": "Governo do Estado de São Paulo", "area": "Secretaria de Governo",
        "promessa": "Modernização do atendimento municipal e parcerias estratégicas.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Gestão Pública e Governo Digital", "pagina": "Pág. 39"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano de Apoio aos Municípios", "meta_estipulada": "645 municípios atendidos"},
            "orcamento": {"dotacao_atualizada": "R$ 80.000.000,00", "empenhado": "R$ 60.000.000,00"},
            "execucao": {"obras_concluidas": "450 municípios", "percentual_execucao": "75%"}
        }
    },
    {
        "id": 3, "entidade": "Governo do Estado de São Paulo", "area": "Saúde",
        "promessa": "Construção de 5 novos Centros de Atendimento Oncológico até o final de 2026.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Desenvolvimento Social - Saúde", "pagina": "Pág. 9"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano de Governo Registrado no TSE", "meta_estipulada": "5 Unidades entregues"},
            "orcamento": {"dotacao_atualizada": "R$ 45.000.000,00", "empenhado": "R$ 30.000.000,00"},
            "execucao": {"obras_concluidas": "2 de 5 unidades", "percentual_execucao": "40%"}
        }
    },
    {
        "id": 4, "entidade": "Governo do Estado de São Paulo", "area": "Educação",
        "promessa": "Ampliação do programa de ensino integral em 300 escolas da rede estadual.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Desenvolvimento Social - Educação", "pagina": "Pág. 6"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano Estadual de Educação", "meta_estipulada": "300 escolas integradas"},
            "orcamento": {"dotacao_atualizada": "R$ 90.000.000,00", "empenhado": "R$ 75.000.000,00"},
            "execucao": {"obras_concluidas": "210 escolas adaptadas", "percentual_execucao": "70%"}
        }
    },
    {
        "id": 5, "entidade": "Governo do Estado de São Paulo", "area": "Segurança Pública",
        "promessa": "Implantação de novas tecnologias de perícia criminal e modernização de laboratórios técnico-científicos.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Segurança Pública", "pagina": "Pág. 13"},
        "fases_evidencia": {
            "planejamento": {"origem": "Diretrizes Estratégicas da Polícia Técnico-Científica", "meta_estipulada": "Modernização de núcleos regionais"},
            "orcamento": {"dotacao_atualizada": "R$ 15.000.000,00", "empenhado": "R$ 12.500.000,00"},
            "execucao": {"obras_concluidas": "3 núcleos modernizados", "percentual_execucao": "85%"}
        }
    },
    {
        "id": 6, "entidade": "Governo do Estado de São Paulo", "area": "Logística e Transportes",
        "promessa": "Duplicação e recapeamento de 120km de rodovias estaduais estratégicas.",
        "status_geral": "ATRASADA",
        "referencia_plano": {"eixo": "Infraestrutura e Mobilidade Urbana", "pagina": "Pág. 21"},
        "fases_evidencia": {
            "planejamento": {"origem": "Programa Rodoviário de Longo Prazo", "meta_estipulada": "120 km duplicados"},
            "orcamento": {"dotacao_atualizada": "R$ 120.000.000,00", "empenhado": "R$ 45.000.000,00"},
            "execucao": {"obras_concluidas": "35 km entregues", "percentual_execucao": "29%"}
        }
    },
    {
        "id": 7, "entidade": "Governo do Estado de São Paulo", "area": "Desenvolvimento Econômico",
        "promessa": "Fomento à inovação tecnológica e expansão de incubadoras de empresas.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Desenvolvimento Econômico e Inovação", "pagina": "Pág. 30"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano SP Inovação", "meta_estipulada": "20 polos tecnológicos"},
            "orcamento": {"dotacao_atualizada": "R$ 40.000.000,00", "empenhado": "R$ 28.000.000,00"},
            "execucao": {"obras_concluidas": "12 polos ativos", "percentual_execucao": "60%"}
        }
    },
    {
        "id": 8, "entidade": "Governo do Estado de São Paulo", "area": "Fazenda e Planejamento",
        "promessa": "Digitalização integral de processos fiscais e ampliação da transparência orçamentária.",
        "status_geral": "CONCLUÍDA",
        "referencia_plano": {"eixo": "Compromisso Fiscal e Tributário", "pagina": "Pág. 41"},
        "fases_evidencia": {
            "planejamento": {"origem": "Programa de Gestão Fiscal", "meta_estipulada": "100% processos despapelizados"},
            "orcamento": {"dotacao_atualizada": "R$ 30.000.000,00", "empenhado": "R$ 30.000.000,00"},
            "execucao": {"obras_concluidas": "Portal unificado", "percentual_execucao": "100%"}
        }
    },
    {
        "id": 9, "entidade": "Governo do Estado de São Paulo", "area": "Infraestrutura e Meio Ambiente",
        "promessa": "Implantação de parques urbanos e recuperação de matas ciliares.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Sustentabilidade e Recursos Hídricos", "pagina": "Pág. 26"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano Verde SP", "meta_estipulada": "15 novos parques estaduais"},
            "orcamento": {"dotacao_atualizada": "R$ 60.000.000,00", "empenhado": "R$ 40.000.000,00"},
            "execucao": {"obras_concluidas": "9 parques entregues", "percentual_execucao": "60%"}
        }
    },
    {
        "id": 10, "entidade": "Governo do Estado de São Paulo", "area": "Transportes Metropolitanos",
        "promessa": "Expansão de linhas de trem metropolitano e integração tarifária digital.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Infraestrutura e Mobilidade Urbana", "pagina": "Pág. 22"},
        "fases_evidencia": {
            "planejamento": {"origem": "Diretrizes Metropolitanas", "meta_estipulada": "15km de novas vias"},
            "orcamento": {"dotacao_atualizada": "R$ 250.000.000,00", "empenhado": "R$ 180.000.000,00"},
            "execucao": {"obras_concluidas": "10km entregues", "percentual_execucao": "65%"}
        }
    },
    {
        "id": 11, "entidade": "Governo do Estado de São Paulo", "area": "Administração Penitenciária",
        "promessa": "Modernização e ampliação de vagas em unidades prisionais com foco em ressocialização.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Segurança Pública - Prisional", "pagina": "Pág. 15"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano Diretor Prisional", "meta_estipulada": "5000 novas vagas humanizadas"},
            "orcamento": {"dotacao_atualizada": "R$ 100.000.000,00", "empenhado": "R$ 70.000.000,00"},
            "execucao": {"obras_concluidas": "3200 vagas entregues", "percentual_execucao": "64%"}
        }
    },
    {
        "id": 12, "entidade": "Governo do Estado de São Paulo", "area": "Agricultura e Abastecimento",
        "promessa": "Programa Melhor Caminho para escoamento da produção agrícola rural.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Agronegócio", "pagina": "Pág. 32"},
        "fases_evidencia": {
            "planejamento": {"origem": "Diretrizes de Apoio ao Produtor", "meta_estipulada": "500 km de estradas rurais recuperadas"},
            "orcamento": {"dotacao_atualizada": "R$ 70.000.000,00", "empenhado": "R$ 50.000.000,00"},
            "execucao": {"obras_concluidas": "350 km recuperados", "percentual_execucao": "70%"}
        }
    },
    {
        "id": 13, "entidade": "Governo do Estado de São Paulo", "area": "Desenvolvimento Social",
        "promessa": "Ampliação de centros de atendimento alimentar e apoio a famílias em vulnerabilidade.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "População Vulnerável", "pagina": "Pág. 17"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano SP Solidária", "meta_estipulada": "100 novos restaurantes populares"},
            "orcamento": {"dotacao_atualizada": "R$ 80.000.000,00", "empenhado": "R$ 65.000.000,00"},
            "execucao": {"obras_concluidas": "75 unidades ativas", "percentual_execucao": "75%"}
        }
    },
    {
        "id": 14, "entidade": "Governo do Estado de São Paulo", "area": "Direitos da Pessoa com Deficiência",
        "promessa": "Acessibilidade urbana e inclusão digital em órgãos públicos estaduais.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Desenvolvimento Social", "pagina": "Pág. 12"},
        "fases_evidencia": {
            "planejamento": {"origem": "Diretrizes de Acessibilidade", "meta_estipulada": "100% de adequação predial pública"},
            "orcamento": {"dotacao_atualizada": "R$ 25.000.000,00", "empenhado": "R$ 18.000.000,00"},
            "execucao": {"obras_concluidas": "60% dos prédios adaptados", "percentual_execucao": "60%"}
        }
    },
    {
        "id": 15, "entidade": "Governo do Estado de São Paulo", "area": "Esportes",
        "promessa": "Construção de centros esportivos comunitários nos municípios paulistas.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Esporte", "pagina": "Pág. 36"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano SP Esportes", "meta_estipulada": "50 arenas esportivas entregues"},
            "orcamento": {"dotacao_atualizada": "R$ 40.000.000,00", "empenhado": "R$ 30.000.000,00"},
            "execucao": {"obras_concluidas": "35 arenas entregues", "percentual_execucao": "70%"}
        }
    },
    {
        "id": 16, "entidade": "Governo do Estado de São Paulo", "area": "Gestão e Governo Digital",
        "promessa": "Centralização de serviços públicos digitais no portal único Poupatempo Digital.",
        "status_geral": "CONCLUÍDA",
        "referencia_plano": {"eixo": "Gestão Pública e Governo Digital", "pagina": "Pág. 39"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano SP Sem Papel", "meta_estipulada": "300 serviços digitalizados"},
            "orcamento": {"dotacao_atualizada": "R$ 35.000.000,00", "empenhado": "R$ 35.000.000,00"},
            "execucao": {"obras_concluidas": "300 serviços no ar", "percentual_execucao": "100%"}
        }
    },
    {
        "id": 17, "entidade": "Governo do Estado de São Paulo", "area": "Habitação",
        "promessa": "Entrega de moradias populares e regularização fundiária urbana.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Habitação e Regularização", "pagina": "Pág. 23"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano Habitacional SP", "meta_estipulada": "40 mil moradias entregues"},
            "orcamento": {"dotacao_atualizada": "R$ 300.000.000,00", "empenhado": "R$ 210.000.000,00"},
            "execucao": {"obras_concluidas": "28 mil moradias entregues", "percentual_execucao": "70%"}
        }
    },
    {
        "id": 18, "entidade": "Governo do Estado de São Paulo", "area": "Justiça e Cidadania",
        "promessa": "Expansão dos Centros de Integração da Cidadania (CIC).",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Cidadania e Justiça", "pagina": "Pág. 16"},
        "fases_evidencia": {
            "planejamento": {"origem": "Diretrizes de Cidadania", "meta_estipulada": "5 novas unidades CIC"},
            "orcamento": {"dotacao_atualizada": "R$ 20.000.000,00", "empenhado": "R$ 14.000.000,00"},
            "execucao": {"obras_concluidas": "3 unidades inauguradas", "percentual_execucao": "60%"}
        }
    },
    {
        "id": 19, "entidade": "Governo do Estado de São Paulo", "area": "Meio Ambiente, Infraestrutura e Logística",
        "promessa": "Transição energética e descarbonização da frota de transporte público.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Sustentabilidade", "pagina": "Pág. 29"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano SP Carbono Zero", "meta_estipulada": "20% da frota eletrificada"},
            "orcamento": {"dotacao_atualizada": "R$ 150.000.000,00", "empenhado": "R$ 90.000.000,00"},
            "execucao": {"obras_concluidas": "12% da frota adaptada", "percentual_execucao": "60%"}
        }
    },
    {
        "id": 20, "entidade": "Governo do Estado de São Paulo", "area": "Negócios Internacionais",
        "promessa": "Atração de investimentos externos e fomento às exportações paulistas.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Desenvolvimento Econômico", "pagina": "Pág. 31"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano SP Global", "meta_estipulada": "15 missões internacionais e feirões"},
            "orcamento": {"dotacao_atualizada": "R$ 15.000.000,00", "empenhado": "R$ 12.000.000,00"},
            "execucao": {"obras_concluidas": "10 missões realizadas", "percentual_execucao": "66%"}
        }
    },
    {
        "id": 21, "entidade": "Governo do Estado de São Paulo", "area": "Políticas para a Mulher",
        "promessa": "Ampliação de Delegacias da Defesa da Mulher (DDM) 24 horas.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Segurança Pública - Mulher", "pagina": "Pág. 17"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano SP Mulher Segura", "meta_estipulada": "40 DDMs 24h implementadas"},
            "orcamento": {"dotacao_atualizada": "R$ 30.000.000,00", "empenhado": "R$ 24.000.000,00"},
            "execucao": {"obras_concluidas": "30 delegacias adaptadas", "percentual_execucao": "75%"}
        }
    },
    {
        "id": 22, "entidade": "Governo do Estado de São Paulo", "area": "Turismo e Viagens",
        "promessa": "Investimento em infraestrutura de apoio aos Municípios de Interesse Turístico (MIT).",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Turismo", "pagina": "Pág. 37"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano Estadual de Turismo", "meta_estipulada": "140 municípios contemplados"},
            "orcamento": {"dotacao_atualizada": "R$ 90.000.000,00", "empenhado": "R$ 70.000.000,00"},
            "execucao": {"obras_concluidas": "100 municípios atendidos", "percentual_execucao": "71%"}
        }
    },
    {
        "id": 23, "entidade": "Governo do Estado de São Paulo", "area": "Comunicação",
        "promessa": "Transparência ativa e divulgação institucional de utilidade pública.",
        "status_geral": "CONCLUÍDA",
        "referencia_plano": {"eixo": "Gestão Pública", "pagina": "Pág. 38"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano de Comunicação Cívica", "meta_estipulada": "Campanhas educativas contínuas"},
            "orcamento": {"dotacao_atualizada": "R$ 40.000.000,00", "empenhado": "R$ 40.000.000,00"},
            "execucao": {"obras_concluidas": "Campanhas veiculadas", "percentual_execucao": "100%"}
        }
    },
    {
        "id": 24, "entidade": "Governo do Estado de São Paulo", "area": "Cultura, Economia e Indústria Criativas",
        "promessa": "Revitalização de equipamentos culturais e fomento a festivais regionais.",
        "status_geral": "EM ANDAMENTO",
        "referencia_plano": {"eixo": "Cultura e Economia Criativa", "pagina": "Pág. 34"},
        "fases_evidencia": {
            "planejamento": {"origem": "Plano SP Criativa", "meta_estipulada": "30 museus e teatros reformados"},
            "orcamento": {"dotacao_atualizada": "R$ 70.000.000,00", "empenhado": "R$ 50.000.000,00"},
            "execucao": {"obras_concluidas": "22 espaços entregues", "percentual_execucao": "73%"}
        }
    }
]

BANCO_CONTRATOS_PACTO = [
    {
        "id_contrato": "CT-2026-089", "secretaria": "Saúde", "fornecedor": "OncoTech Equipamentos Médicos Ltda", "cnpj": "12.345.678/0001-99",
        "objeto": "Aquisição e instalação de aceleradores lineares e equipamentos de imagem para centros oncológicos.",
        "valor_inicial": "R$ 18.500.000,00", "valor_atualizado": "R$ 19.200.000,00", "data_assinatura": "2026-02-15", "vigencia": "12 meses", "status": "Vigente", "processo_sei": "001.00043210/2025-88"
    },
    {
        "id_contrato": "CT-2026-104", "secretaria": "Segurança Pública", "fornecedor": "Forense Tech Soluções em DNA Ltda", "cnpj": "98.765.432/0001-11",
        "objeto": "Fornecimento de reagentes de alta precisão e modernização de hardwares para cromatografia gasosa.",
        "valor_inicial": "R$ 6.800.000,00", "valor_atualizado": "R$ 6.800.000,00", "data_assinatura": "2026-03-01", "vigencia": "24 meses", "status": "Vigente", "processo_sei": "052.00011223/2026-10"
    },
    {
        "id_contrato": "CT-2026-210", "secretaria": "Logística e Transportes", "fornecedor": "Rodovias Paulista Construções S.A.", "cnpj": "45.123.789/0001-50",
        "objeto": "Serviços de engenharia civil para duplicação e recapeamento asfáltico em trecho prioritário.",
        "valor_inicial": "R$ 45.000.000,00", "valor_atualizado": "R$ 48.500.000,00", "data_assinatura": "2025-11-10", "vigencia": "18 meses", "status": "Em Execução com Termo Aditivo", "processo_sei": "108.00099887/2025-45"
    }
]

# =====================================================================
# BANCO DE OBRAS (Agora com a flag 'estrategica')
# =====================================================================
BANCO_OBRAS_PACTO = [
    {
        "id_obra": "OBRA-2026-01", "secretaria": "Saúde", "nome": "Centro de Atendimento Oncológico - Unidade Capital",
        "descricao": "Construção de infraestrutura hospitalar especializada em oncologia com 12.000m².",
        "localizacao": "São Paulo - SP (Zona Sul)", "latitude": -23.588056, "longitude": -46.632222,
        "valor_obra": "R$ 22.000.000,00", "data_inicio": "2026-01-10", "previsao_termino": "2026-12-20", "percentual_execucao": "45%", "status": "Em Andamento",
        "estrategica": False,
        "historico": ["01/2026 - Início da fundação e terraplanagem", "05/2026 - Conclusão da estrutura de concreto", "08/2026 - Instalação de redes hidráulicas e elétricas"]
    },
    {
        "id_obra": "OBRA-2026-02", "secretaria": "Logística e Transportes", "nome": "Duplicação Rodovia Estadual SP-280 (Trecho Norte)",
        "descricao": "Serviços de engenharia para duplicação de pista, pavimentação e sinalização viária.",
        "localizacao": "Região de Sorocaba - SP", "latitude": -23.501667, "longitude": -47.458333,
        "valor_obra": "R$ 48.500.000,00", "data_inicio": "2025-11-15", "previsao_termino": "2026-10-30", "percentual_execucao": "35%", "status": "Em Andamento com Atenção",
        "estrategica": False,
        "historico": ["11/2025 - Ordem de serviço emitida", "03/2026 - Executados 15km de pavimentação", "07/2026 - Retificação ambiental em trecho de manancial"]
    },
    {
        "id_obra": "OBRA-2026-03", "secretaria": "Transportes Metropolitanos", "nome": "Trem Intercidades (Eixo SP-Campinas)",
        "descricao": "Implantação de transporte ferroviário de passageiros interligando a capital ao interior, conforme Plano de Governo.",
        "localizacao": "São Paulo - Campinas", "latitude": -23.533333, "longitude": -46.633333,
        "valor_obra": "R$ 8.500.000.000,00", "data_inicio": "2025-06-01", "previsao_termino": "2029-12-01", "percentual_execucao": "15%", "status": "Em Andamento",
        "estrategica": True,
        "historico": ["06/2025 - Assinatura do contrato de PPP", "01/2026 - Início das desapropriações e supressão vegetal"]
    }
]

BANCO_ALERTAS_PACTO = [
    {
        "id_alerta": "ALERTA-001", "severidade": "CRÍTICO", "entidade_relacionada": "Logística e Transportes",
        "titulo": "Atraso Crítico em Cronograma de Obra Rodoviária",
        "descricao": "O ritmo de execução física da obra SP-280 encontra-se abaixo do patamar contratual esperado para o período.",
        "data_emissao": "2026-09-10", "status": "Ativo"
    },
    {
        "id_alerta": "ALERTA-002", "severidade": "ATENÇÃO", "entidade_relacionada": "Saúde",
        "titulo": "Variação Relevante em Termo Aditivo de Contrato",
        "descricao": "Identificada variação superior a 3.7% no valor atualizado do contrato de equipamentos oncológicos.",
        "data_emissao": "2026-09-12", "status": "Ativo"
    },
    {
        "id_alerta": "ALERTA-003", "severidade": "INFORMATIVO", "entidade_relacionada": "Fazenda e Planejamento",
        "titulo": "Meta de Transparência Fiscal Cumprida",
        "descricao": "A secretaria atingiu 100% de conformidade na digitalização de processos fiscais previstos no PPA.",
        "data_emissao": "2026-09-14", "status": "Resolvido"
    }
]

FONTES_OFICIAIS_REGISTRADAS = [
    {"id_fonte": "SRC-001", "nome": "Portal da Transparência", "tipo": "Orçamento e Execução", "status": "Ativo", "ultima_checagem": datetime.now().strftime("%Y-%m-%d %H:%M:%S")},
    {"id_fonte": "SRC-002", "nome": "PNCP", "tipo": "Contratos", "status": "Ativo", "ultima_checagem": datetime.now().strftime("%Y-%m-%d %H:%M:%S")},
    {"id_fonte": "SRC-003", "nome": "SIGEO", "tipo": "Geolocalização", "status": "Ativo", "ultima_checagem": datetime.now().strftime("%Y-%m-%d %H:%M:%S")},
    {"id_fonte": "SRC-004", "nome": "Motor PACTO", "tipo": "Auditoria de Regras", "status": "Ativo", "ultima_checagem": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
]

def aplicar_motor_analitico(promessa_item: dict) -> dict:
    exec_str = promessa_item["fases_evidencia"]["execucao"]["percentual_execucao"].replace("%", "")
    execucao_valor = int(exec_str)
    status = promessa_item["status_geral"]

    if status == "ATRASADA" and execucao_valor < 30:
        alerta = {"corFundo": "#FEE2E2", "corTexto": "#DC2626", "mensagem": "🚨 Motor Analítico PACTO: Alerta Crítico. Ritmo incompatível."}
    elif execucao_valor < 50 and status != "CONCLUÍDA":
        alerta = {"corFundo": "#FEF3C7", "corTexto": "#D97706", "mensagem": "⚠️ Motor Analítico PACTO: Atenção moderada. Execução abaixo de 50%."}
    else:
        alerta = {"corFundo": "#D1FAE5", "corTexto": "#047857", "mensagem": "✅ Motor Analítico PACTO: Execução dentro dos parâmetros."}

    item_com_alerta = dict(promessa_item)
    item_com_alerta["alerta_analitico"] = alerta
    return item_com_alerta

@app.get("/", summary="Raiz da API")
def raiz():
    return {"sistema": "API PACTO - Validações e Tratamento de Erros Ativos", "versao": "2.2.0"}

@app.get("/api/v1/promessas", summary="Listar todas as promessas")
def listar_promessas():
    return [aplicar_motor_analitico(item) for item in BANCO_DE_DADOS_PACTO]

@app.get("/api/v1/promessas/{area}", summary="Filtrar promessas por área com Validação")
def filtrar_promessas_por_area(area: str = Path(..., description="Nome exato da Secretaria")):
    resultados = [aplicar_motor_analitico(item) for item in BANCO_DE_DADOS_PACTO if item["area"].lower() == area.lower()]
    if not resultados:
        raise HTTPException(status_code=404, detail=f"Erro PACTO: A secretaria '{area}' não foi encontrada na nossa base de dados.")
    return resultados

@app.get("/api/v1/contratos", summary="Listar Contratos")
def listar_contratos():
    return BANCO_CONTRATOS_PACTO

@app.get("/api/v1/obras", summary="Listar Obras Públicas")
def listar_obras():
    return BANCO_OBRAS_PACTO

@app.get("/api/v1/alertas", summary="Listar Alertas Analíticos")
def listar_alertas():
    return BANCO_ALERTAS_PACTO

@app.get("/api/v1/indicadores", response_model=IndicadoresGlobaisModel, summary="Indicadores Globais Seguros")
def obter_indicadores_globais():
    total = len(BANCO_DE_DADOS_PACTO)
    soma = sum(int(i["fases_evidencia"]["execucao"]["percentual_execucao"].replace("%","")) for i in BANCO_DE_DADOS_PACTO)
    media = round(soma / total) if total > 0 else 0
    atrasadas = sum(1 for i in BANCO_DE_DADOS_PACTO if i["status_geral"] == "ATRASADA")
    
    return {
        "total_metas": total,
        "media_execucao_global": f"{media}%",
        "total_atrasadas": atrasadas,
        "total_contratos_monitorados": len(BANCO_CONTRATOS_PACTO),
        "total_obras_geolocalizadas": len(BANCO_OBRAS_PACTO),
        "total_alertas_analiticos": len(BANCO_ALERTAS_PACTO),
        "fontes_integradas_ativas": len(FONTES_OFICIAIS_REGISTRADAS)
    }

@app.get("/api/v1/fontes", summary="Listar Fontes Oficiais")
def listar_fontes():
    return FONTES_OFICIAIS_REGISTRADAS