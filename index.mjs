import express from 'express';
import exphbs from 'express-handlebars';
import mysql from 'mysql';

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Ponte para os arquivos estáticos
app.use(express.static('public'));

// Rotas
app.get('/', (req, res) => {
    res.render("home");
});

app.post('/books/insertbook', (req, res) => {
    const title = req.body.title;
    const pagesqty = req.body.pagesqty; // Corrigido de pageqty para pagesqty

    // Corrigindo a consulta SQL
    const sql = 'INSERT INTO books (title, pageqty) VALUES (?, ?)';
    const values = [title, pagesqty];

    conn.query(sql, values, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Erro interno do servidor');
        }

        // Fechar a conexão com o banco de dados após a operação
        conn.end();

        // Redirecionar após o encerramento da conexão
        res.redirect('/');
    });
});

// Conexão com o DB (MySQL)
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql1',
});

conn.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log('Conexão com DB MySQL executada com sucesso');

    // Iniciar o servidor após a conexão com o banco de dados
    app.listen(3000, () => {
        console.log('Servidor está ouvindo na porta 3000');
    });
});

console.log("Diretório de trabalho atual:", process.cwd());
