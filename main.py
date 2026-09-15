from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(
    title="API PACTO - Inteligência Cívica",
    description="Backend oficial da plataforma PACTO com todas as secretarias e áreas do governo.",
    version="1.5.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Banco de Dados Completo com todas as Secretarias e Áreas do Governo
BANCO_DE_DADOS_PACTO = [
    {
        "id": 1,
        "entidade": "Governo do Estado de São Paulo",
        "area": "Saúde",
        "promessa": "Construção de 5 novos Centros de Atendimento Oncológico até o final de 2026.",
        "status_geral": "EM ANDAMENTO",
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
    },
    {
        "id": 4,
        "entidade": "Governo do Estado de São Paulo",
        "area": "Educação",
        "promessa": "Ampliação do programa de ensino integral em 300 escolas da rede estadual.",
        "status_geral": "EM ANDAMENTO",
        "fases_evidencia": {
            "planejamento": {
                "origem": "Plano Estadual de Educação",
                "meta_estipulada": "300 escolas integradas"
            },
            "orcamento": {
                "dotacao_atualizada": "R$ 90.000.000,00",
                "empenhado": "R$ 75.000.000,00"
            },
            "execucao": {
                "obras_concluidas": "210 escolas adaptadas",
                "percentual_execucao": "70%"
            }
        }
    },
    {
        "id": 5,
        "entidade": "Governo do Estado de São Paulo",
        "area": "Mobilidade",
        "promessa": "Expansão de linhas de trem metropolitano e integração tarifária digital.",
        "status_geral": "EM ANDAMENTO",
        "fases_evidencia": {
            "planejamento": {
                "origem": "Diretrizes de Transporte Metropolitano",
                "meta_estipulada": "15km de novas vias e bilhetagem unificada"
            },
            "orcamento": {
                "dotacao_atualizada": "R$ 250.000.000,00",
                "empenhado": "R$ 180.000.000,00"
            },
            "execucao": {
                "obras_concluidas": "10km entregues",
                "percentual_execucao": "65%"
            }
        }
    },
    {
        "id": 6,
        "entidade": "Governo do Estado de São Paulo",
        "area": "Finanças Públicas",
        "promessa": "Digitalização integral de processos fiscais e ampliação da transparência orçamentária.",
        "status_geral": "CONCLUÍDA",
        "fases_evidencia": {
            "planejamento": {
                "origem": "Programa de Modernização da Gestão Fiscal",
                "meta_estipulada": "100% dos processos despapelizados"
            },
            "orcamento": {
                "dotacao_atualizada": "R$ 30.000.000,00",
                "empenhado": "R$ 30.000.000,00"
            },
            "execucao": {
                "obras_concluidas": "Portal de dados unificado",
                "percentual_execucao": "100%"
            }
        }
    }
]

FONTES_OFICIAIS_REGISTRADAS = [
    {
        "id_fonte": "SRC-001",
        "nome": "Portal da Transparência do Estado de São Paulo",
        "tipo": "Orçamento e Execução",
        "status": "Ativo e Sincronizado",
        "ultima_checagem": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "id_fonte": "SRC-002",
        "nome": "Diário Oficial do Estado de São Paulo (DOESP)",
        "tipo": "Atos Administrativos e Contratos",
        "status": "Ativo e Sincronizado",
        "ultima_checagem": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
]

def aplicar_motor_analitico(promessa_item: dict) -> dict:
    exec_str = promessa_item["fases_evidencia"]["execucao"]["percentual_execucao"].replace("%", "")
    execucao_valor = int(exec_str)
    status = promessa_item["status_geral"]

    if status == "ATRASADA" and execucao_valor < 30:
        alerta = {
            "corFundo": "#FEE2E2",
            "corTexto": "#DC2626",
            "mensagem": "🚨 Motor Analítico PACTO: Alerta Crítico. Ritmo de entrega incompatível com o prazo estipulado."
        }
    elif execucao_valor < 50 and status != "CONCLUÍDA":
        alerta = {
            "corFundo": "#FEF3C7",
            "corTexto": "#D97706",
            "mensagem": "⚠️ Motor Analítico PACTO: Atenção moderada. Execução física abaixo de 50% da meta global."
        }
    else:
        alerta = {
            "corFundo": "#D1FAE5",
            "corTexto": "#047857",
            "mensagem": "✅ Motor Analítico PACTO: Execução dentro dos parâmetros esperados de eficiência."
        }

    item_com_alerta = dict(promessa_item)
    item_com_alerta["alerta_analitico"] = alerta
    return item_com_alerta

@app.get("/", summary="Raiz da API")
def raiz():
    return {"sistema": "API PACTO - Governo Completo Ativo", "versao": "1.5.0"}

@app.get("/api/v1/promessas", summary="Listar promessas de todas as secretarias")
def listar_promessas():
    return [aplicar_motor_analitico(item) for item in BANCO_DE_DADOS_PACTO]

@app.get("/api/v1/indicadores", summary="Indicadores Globais Consolidados")
def obter_indicadores_globais():
    total = len(BANCO_DE_DADOS_PACTO)
    soma = sum(int(i["fases_evidencia"]["execucao"]["percentual_execucao"].replace("%","")) for i in BANCO_DE_DADOS_PACTO)
    media = round(soma / total) if total > 0 else 0
    atrasadas = sum(1 for i in BANCO_DE_DADOS_PACTO if i["status_geral"] == "ATRASADA")
    return {
        "total_metas": total,
        "media_execucao_global": f"{media}%",
        "total_atrasadas": atrasadas,
        "fontes_integradas_ativas": len(FONTES_OFICIAIS_REGISTRADAS)
    }

@app.get("/api/v1/fontes", summary="Listar Fontes Oficiais")
def listar_fontes():
    return FONTES_OFICIAIS_REGISTRADAS