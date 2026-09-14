import sqlite3
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PACTO API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# MÁQUINAS DE INTELIGÊNCIA DO PACTO
# ---------------------------------------------------------
def calcular_percentual(concluido, meta):
    if meta == 0: return "0%"
    return f"{int((concluido / meta) * 100)}%"

def gerar_alerta_analitico(status):
    if status == "ATRASADA":
        return {
            "tipo": "Crítico", 
            "mensagem": "🔴 Atenção: Esta meta encontra-se em atraso.", 
            "corFundo": "#FEE2E2", "corTexto": "#991B1B"
        }
    return None

# ---------------------------------------------------------
# COMUNICAÇÃO COM O BANCO DE DADOS REAL (SQLite)
# ---------------------------------------------------------
def iniciar_banco_de_dados():
    """
    Esta função roda ao ligar o servidor. Cria o arquivo pacto.db,
    constrói a tabela e insere as promessas iniciais se estiver vazia.
    """
    # 1. Abre a conexão com o arquivo do banco (cria o arquivo se não existir)
    conexao = sqlite3.connect("pacto.db")
    cursor = conexao.cursor()

    # 2. Cria a Tabela estruturada (A nossa "Planilha")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS promessas (
            id TEXT PRIMARY KEY,
            entidade TEXT,
            area TEXT,
            promessa TEXT,
            status_geral TEXT,
            fases_evidencia TEXT
        )
    ''')

    # 3. Verifica se a tabela está vazia. Se estiver, cadastra nossos 3 projetos.
    cursor.execute("SELECT COUNT(*) FROM promessas")
    if cursor.fetchone()[0] == 0:
        print("Banco de dados vazio. Semeando dados iniciais do PACTO...")
        
        dados_iniciais = [
            {
                "id": "promessa_001", "entidade": "Prefeitura de São Paulo", "area": "Saúde", "promessa": "Construção de 20 novas UBS", "status_geral": "EM EXECUÇÃO",
                "fases_evidencia": {
                    "planejamento": {"origem": "Plano de Governo", "meta_estipulada": "20 unidades"},
                    "orcamento": {"dotacao_atualizada": "R$ 800 Milhões", "empenhado": "R$ 720 Milhões"},
                    "execucao": {"obras_concluidas": "13 unidades", "percentual_execucao": calcular_percentual(13, 20)}
                }
            },
            {
                "id": "promessa_002", "entidade": "Prefeitura de São Paulo", "area": "Saúde", "promessa": "Zerar fila de exames de imagem", "status_geral": "ATRASADA",
                "fases_evidencia": {
                    "planejamento": {"origem": "Programa de Metas", "meta_estipulada": "Fila Zero"},
                    "orcamento": {"dotacao_atualizada": "R$ 150 Milhões", "empenhado": "R$ 45 Milhões"},
                    "execucao": {"obras_concluidas": "N/A", "percentual_execucao": calcular_percentual(30, 100)}
                }
            },
            {
                "id": "promessa_003", "entidade": "Prefeitura de São Paulo", "area": "Educação", "promessa": "Reforma de 50 Escolas Municipais", "status_geral": "CONCLUÍDA",
                "fases_evidencia": {
                    "planejamento": {"origem": "Plano de Governo", "meta_estipulada": "50 unidades"},
                    "orcamento": {"dotacao_atualizada": "R$ 120 Milhões", "empenhado": "R$ 120 Milhões"},
                    "execucao": {"obras_concluidas": "50 unidades", "percentual_execucao": calcular_percentual(50, 50)}
                }
            }
        ]

        # Inserindo um por um no banco. Note o 'json.dumps' para transformar o pacote de fases em texto.
        for d in dados_iniciais:
            cursor.execute('''
                INSERT INTO promessas (id, entidade, area, promessa, status_geral, fases_evidencia)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (d["id"], d["entidade"], d["area"], d["promessa"], d["status_geral"], json.dumps(d["fases_evidencia"])))
        
        # Salva as alterações
        conexao.commit()
    
    conexao.close()

# Executa a função criadora de banco de dados imediatamente
iniciar_banco_de_dados()

# ---------------------------------------------------------
# A NOVA ROTA DA API (Buscando dados no SQLite)
# ---------------------------------------------------------
@app.get("/api/v1/saude/promessas")
def listar_todas_promessas():
    # 1. Abre a conexão e pede todas as linhas da tabela
    conexao = sqlite3.connect("pacto.db")
    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM promessas")
    linhas = cursor.fetchall()
    conexao.close()

    # 2. Reconstrói os dados no formato que o Site e o App já conhecem
    lista_final = []
    for linha in linhas:
        status_atual = linha[4]
        promessa_montada = {
            "id": linha[0],
            "entidade": linha[1],
            "area": linha[2],
            "promessa": linha[3],
            "status_geral": status_atual,
            # json.loads faz o inverso: transforma o texto do banco de volta em sub-categorias
            "fases_evidencia": json.loads(linha[5]),
            # A Inteligência Analítica do Alerta é calculada ao vivo, separada do Banco!
            "alerta_analitico": gerar_alerta_analitico(status_atual)
        }
        lista_final.append(promessa_montada)
    
    return lista_final