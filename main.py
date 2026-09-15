from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API PACTO - Inteligência Cívica",
    description="Backend oficial da plataforma PACTO para transparência, orçamentos e fiscalização cívica.",
    version="1.2.0"
)

# Configuração de CORS para permitir requisições seguras da Vercel e do localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Banco de Dados Oficial do PACTO (Multissetorial)
BANCO_DE_DADOS_PACTO = [
    {
        "id": 1,
        "entidade": "Governo do Estado de São Paulo",
        "area": "Saúde",
        "promessa": "Construção de 5 novos Centros de Atendimento Oncológico até o final de 2026.",
        "status_geral": "EM ANDAMENTO",
        "alerta_analitico": {
            "corFundo": "#FEF3C7",
            "corTexto": "#D97706",
            "mensagem": "⚠️ Atenção: O ritmo atual indica risco de atraso de 3 meses no cronograma previsto."
        },
        "fases_evidencia": {
            "planejamento": {
                "origem": "Plano de Governo Registrado no TSE",
                "meta_estipulada": "5 Unidades entregues"
            },
            "orcamento": {
                "dotacao_atualizada": "R$ 45.000.000,00",
                "empenhado": "R$ 30.000.000,00"
            },
            "execucao": {
                "obras_concluidas": "2 de 5 unidades",
                "percentual_execucao": "40%"
            }
        }
    },
    {
        "id": 2,
        "entidade": "Governo do Estado de São Paulo",
        "area": "Segurança Pública",
        "promessa": "Implantação de novas tecnologias de perícia criminal e modernização de laboratórios técnico-científicos.",
        "status_geral": "EM ANDAMENTO",
        "alerta_analitico": {
            "corFundo": "#D1FAE5",
            "corTexto": "#047857",
            "mensagem": "✅ Execução dentro do prazo: Aquisições de equipamentos de alta precisão em fase final."
        },
        "fases_evidencia": {
            "planejamento": {
                "origem": "Diretrizes Estratégicas da Polícia Técnico-Científica",
                "meta_estipulada": "Modernização de núcleos regionais"
            },
            "orcamento": {
                "dotacao_atualizada": "R$ 15.000.000,00",
                "empenhado": "R$ 12.500.000,00"
            },
            "execucao": {
                "obras_concluidas": "3 núcleos modernizados",
                "percentual_execucao": "85%"
            }
        }
    },
    {
        "id": 3,
        "entidade": "Governo do Estado de São Paulo",
        "area": "Infraestrutura",
        "promessa": "Duplicação e recapeamento de 120km de rodovias estaduais estratégicas.",
        "status_geral": "ATRASADA",
        "alerta_analitico": {
            "corFundo": "#FEE2E2",
            "corTexto": "#DC2626",
            "mensagem": "🚨 Alerta Vermelho: Paralisação temporária em trecho crítico devido a readequação de licença ambiental."
        },
        "fases_evidencia": {
            "planejamento": {
                "origem": "Programa Rodoviário Estadual de Longo Prazo",
                "meta_estipulada": "120 km duplicados"
            },
            "orcamento": {
                "dotacao_atualizada": "R$ 120.000.000,00",
                "empenhado": "R$ 45.000.000,00"
            },
            "execucao": {
                "obras_concluidas": "35 km entregues",
                "percentual_execucao": "29%"
            }
        }
    }
]

# =====================================================================
# ROTAS DO BACKEND APRIMORADAS
# =====================================================================

@app.get("/", summary="Raiz da API")
def raiz():
    return {
        "sistema": "API PACTO - Inteligência Cívica",
        "versao": "1.2.0",
        "documentacao": "/docs",
        "endpoints_disponiveis": [
            "/api/v1/promessas",
            "/api/v1/promessas/area/{nome_area}",
            "/api/v1/indicadores"
        ]
    }

@app.get("/api/v1/promessas", summary="Listar todas as promessas cadastradas")
def listar_promessas():
    """Retorna a lista completa de promessas monitoradas pelo PACTO."""
    return BANCO_DE_DADOS_PACTO

@app.get("/api/v1/promessas/area/{nome_area}", summary="Filtrar promessas por área específica")
def filtrar_por_area(nome_area: str):
    """Filtra e retorna apenas as promessas pertencentes à área solicitada (ex: Saúde, Segurança Pública, Infraestrutura)."""
    # Normaliza a busca para ignorar pequenas diferenças de maiúsculas/minúsculas
    resultados = [item for item in BANCO_DE_DADOS_PACTO if item["area"].lower() == nome_area.lower()]
    
    if not resultados:
        raise HTTPException(status_code=404, detail=f"Nenhuma promessa encontrada para a área: '{nome_area}'")
    
    return resultados

@app.get("/api/v1/indicadores", summary="Obter indicadores de desempenho globais")
def obter_indicadores_globais():
    """Calcula e retorna o painel de KPIs globais (Total de Metas, Média de Execução e Status)."""
    total = len(BANCO_DE_DADOS_PACTO)
    
    if total == 0:
        return {"total": 0, "media_execucao": 0, "atrasadas": 0, "em_andamento": 0}

    soma_percentuais = 0
    atrasadas = 0
    em_andamento = 0

    for item in BANCO_DE_DADOS_PACTO:
        # Extrai o valor numérico da string de percentual (ex: "40%" -> 40)
        perc_str = item["fases_evidencia"]["execucao"]["percentual_execucao"].replace("%", "")
        soma_percentuais += int(perc_str)
        
        if item["status_geral"] == "ATRASADA":
            atrasadas += 1
        elif item["status_geral"] == "EM ANDAMENTO":
            em_andamento += 1

    media_execucao = round(soma_percentuais / total)

    return {
        "total_metas": total,
        "media_execucao_global": f"{media_execucao}%",
        "total_atrasadas": atrasadas,
        "total_em_andamento": em_andamento
    }