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

// Rotas
app.get('/', (req, res) => {
    res.render('home');
});

// POST Inserindo dados no banco
app.post('/books/insertbook', (req, res) => {
    const title = req.body.title;
    const pagesqty = req.body.pagesqty;

    // Query SQL
    const sql = 'INSERT INTO books (title, pagesqty) VALUES (?, ?)';
    const values = [title, pagesqty];

    conn.query(sql, values, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Erro interno do servidor');
        }

        // Redirecionar após a operação
        res.redirect('/books');
    });
});

// GET Pegando dados do banco
app.get('/books', (req, res) => {
    const sql = 'SELECT * FROM books';

    conn.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Erro interno do servidor');
        }

        const books = data;
        res.render('books', { books });
    });
});

// GET ID pegando dados com condição
app.get('/books/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE id = ${id}`

    conn.query(sql, function(err, data) {
        if (err) {
            console.log(err)
            return
        }

        const book = data[0]

        res.render('book', {book})
    })
})

console.log('Diretório de trabalho atual:', process.cwd());
