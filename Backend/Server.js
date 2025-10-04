const express = require('express');
const cors = require('cors');

const app = express();
const db = require('./db');
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/cadastrar', async (req, res) => {
    const {
        nome_completo, cpf, email, telefone, endereco,
        nome_pet, especie, raca, data_nascimento, observacoes
    } = req.body;

    // Validação
    if (!nome_completo || !cpf || !email || !telefone || !endereco || !nome_pet || !especie || !raca || !data_nascimento) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        
        await connection.beginTransaction();

        // Inserir dono - MySQL usa ? como placeholder
        const queryDono = `
            INSERT INTO donos (nome_completo, cpf, email, telefone, endereco)
            VALUES (?, ?, ?, ?, ?)
        `;
        const valuesDono = [nome_completo, cpf, email, telefone, endereco];
        
        const [resultDono] = await connection.execute(queryDono, valuesDono);
        const id_dono = resultDono.insertId; // MySQL retorna insertId

        // Inserir pet
        const queryPet = `
            INSERT INTO pets (id_dono, nome_pet, especie, raca, data_nascimento, observacoes)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const valuesPet = [id_dono, nome_pet, especie, raca, data_nascimento, observacoes || null];
        await connection.execute(queryPet, valuesPet);

        await connection.commit();

        res.status(201).json({ message: 'Cliente e pet cadastrados com sucesso!' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao cadastrar:', error);

        // Tratamento de erros do MySQL
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'CPF ou E-mail já cadastrado no sistema.' });
        }
        
        res.status(500).json({ message: 'Erro interno do servidor ao tentar realizar o cadastro.' });
    } finally {
        if (connection) connection.release();
    }
});

// Rota de saúde para testar conexão
app.get('/health', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT 1');
        res.json({ status: 'OK', database: 'Conectado' });
    } catch (error) {
        res.status(500).json({ status: 'Erro', database: 'Desconectado', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});