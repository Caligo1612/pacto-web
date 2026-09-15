from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API PACTO - Inteligência Cívica",
    description="Backend oficial da plataforma PACTO com Motor Analítico Automatizado.",
    version="1.3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    }
]

# =====================================================================
# MOTOR ANALÍTICO PACTO (Regras Automáticas de Alerta)
# =====================================================================
def aplicar_motor_analitico(promessa_item: dict) -> dict:
    """Aplica regras estatísticas automáticas para gerar alertas baseados em fatos."""
    exec_str = promessa_item["fases_evidencia"]["execucao"]["percentual_execucao"].replace("%", "")
    execucao_valor = int(exec_str)
    status = promessa_item["status_geral"]

    # Regra 1: Alerta Vermelho para obras atrasadas com execução crítica
    if status == "ATRASADA" and execucao_valor < 30:
        alerta = {
            "corFundo": "#FEE2E2",
            "corTexto": "#DC2626",
            "mensagem": "🚨 Motor Analítico PACTO: Alerta Crítico. Ritmo de entrega incompatível com o prazo estipulado."
        }
    # Regra 2: Alerta Amarelo para projetos em andamento com ritmo moderado
    elif execucao_valor < 50:
        alerta = {
            "corFundo": "#FEF3C7",
            "corTexto": "#D97706",
            "mensagem": "⚠️ Motor Analítico PACTO: Atenção moderada. Execução física abaixo de 50% da meta global."
        }
    # Regra 3: Alerta Verde para execução avançada e saudável
    else:
        alerta = {
            "corFundo": "#D1FAE5",
            "corTexto": "#047857",
            "mensagem": "✅ Motor Analítico PACTO: Execução dentro dos parâmetros esperados de eficiência."
        }

    # Insere dinamicamente o alerta gerado pelo motor na resposta
    promessa_com_alerta = dict(promessa_item)
    promessa_com_alerta["alerta_analitico"] = alerta
    return promessa_com_alerta

# =====================================================================
# ROTAS DA API
# =====================================================================

@app.get("/", summary="Raiz da API")
def raiz():
    return {"sistema": "API PACTO - Motor Analítico Ativo", "versao": "1.3.0"}

@app.get("/api/v1/promessas", summary="Listar promessas com Motor Analítico aplicado")
def listar_promessas():
    """Retorna todas as promessas passando-as pelo crivo do motor analítico automático."""
    return [aplicar_motor_analitico(item) for item in BANCO_DE_DADOS_PACTO]

@app.get("/api/v1/indicadores", summary="Indicadores Globais")
def obter_indicadores_globais():
    total = len(BANCO_DE_DADOS_PACTO)
    soma = sum(int(i["fases_evidencia"]["execucao"]["percentual_execucao"].replace("%","")) for i in BANCO_DE_DADOS_PACTO)
    media = round(soma / total) if total > 0 else 0
    return {
        "total_metas": total,
        "media_execucao_global": f"{media}%",
        "motor_analitico": "Ativo e operando com regras automáticas"
    }