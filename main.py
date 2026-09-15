from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API PACTO - Inteligência Cívica",
    description="Backend oficial da plataforma PACTO para transparência e fiscalização cívica.",
    version="1.1.0"
)

# Configuração de CORS para permitir que a Vercel e o localhost acessem a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Banco de Dados Expandido com as novas áreas (Saúde, Segurança Pública e Infraestrutura)
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

@app.get("/")
def raiz():
    return {"mensagem": "Bem-vindo ao Backend do PACTO. Utilize a rota /api/v1/promessas para acessar os dados."}

# Rota principal unificada para consulta de promessas de todas as áreas
@app.get("/api/v1/promessas")
def listar_promessas():
    return BANCO_DE_DADOS_PACTO

# Rota de compatibilidade mantida para sistemas legados
@app.get("/api/v1/saude/promessas")
def listar_promessas_saude():
    return BANCO_DE_DADOS_PACTO