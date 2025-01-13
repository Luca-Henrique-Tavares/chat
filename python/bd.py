import pandas as pd
from sqlalchemy import create_engine
import datetime
import os

# Obter o diretório atual do script
current_dir = os.path.dirname(__file__)

# Construir o caminho completo para o arquivo CSV
csv_file_path = os.path.join(current_dir, 'tabela_unica.csv')

# Ler o arquivo CSV em um DataFrame do pandas
df = pd.read_csv(csv_file_path)

try:
    engine = create_engine('mysql+pymysql://root:123456@localhost/teste_tcc')
except Exception as e:
    print(e)

# Inserir o DataFrame no banco de dados
try:
    df.to_sql('1301', con=engine, if_exists='replace', index=False)
except Exception as e:
    print(e)