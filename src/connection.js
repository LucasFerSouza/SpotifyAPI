import dotenv from 'dotenv';  // Importa dotenv para carregar as variáveis do .env
import { Pool } from 'pg';  // Importa Pool (classe para gerenciar conexões PostgreSQL)

dotenv.config();  // Carrega variáveis do arquivo .env

// Cria um pool de conexões com PostgreSQL usando os dados do .env
const pool = new Pool({
  host: process.env.DB_HOST,       // Endereço do servidor PostgreSQL
  port: process.env.DB_PORT,       // Porta do PostgreSQL (padrão 5432)
  user: process.env.DB_USER,       // Usuário do banco
  password: process.env.DB_PASSWORD,  // Senha do banco
  database: process.env.DB_NAME    // Nome do banco
});

// Exporta o pool usando ES Modules
export default pool;

