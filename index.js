const express = require('express');
const exphbs = require('express-handlebars');
const conn = require('./conn');
const bodyParser = require('body-parser');
const Fuse = require('fuse.js');

const app = express();
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Função para extrair o ID do vídeo do link
function getYoutubeVideoId(url) {
    if (!url) return null;
    const regExp = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Função para gerar a URL da thumbnail do YouTube
function getYoutubeThumbnailUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Rota para renderizar a página principal
app.get('/', (req, res) => {
    res.render('chat');
});

// Rota para fornecer sugestões de pesquisa
app.get('/suggestions', (req, res) => {
    const query = req.query.q.toLowerCase();

    conn.query(`SELECT titulo, tambem_chamado FROM tab_final`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const suggestions = rows.map(row => ({
            titulo: row.titulo,
            tambem_chamado: row.tambem_chamado || ''
        }));

        const fuse = new Fuse(suggestions, {
            keys: ['titulo', 'tambem_chamado'],
            threshold: 0.4
        });

        const result = fuse.search(query);

        const filteredSuggestions = result.slice(0, 5).map(({ item }) => ({
            titulo: item.titulo,
            tambem_chamado: item.tambem_chamado
        }));

        res.json(filteredSuggestions);
    });
});

// Rota para tratar a pesquisa completa e retornar os resultados
app.get('/search', (req, res) => {
    const searchQuery = req.query.q;

    const query = `SELECT * FROM tab_final WHERE titulo LIKE ? OR tambem_chamado LIKE ?`;
    conn.query(query, [`%${searchQuery}%`, `%${searchQuery}%`], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Filtrar resultados para não enviar valores nulos
        const filteredResults = results
            .filter(result => result.titulo.toLowerCase() === searchQuery.toLowerCase() || (result.tambem_chamado || '').toLowerCase() === searchQuery.toLowerCase())
            .map(result => {
                Object.keys(result).forEach(key => {
                    if (result[key] === null || result[key] === undefined) {
                        result[key] = '';
                    }
                });

                // Adicionando lógica para extrair thumbnails de vídeos
                const videoLinks = [result.video1, result.video2, result.video3];
                const thumbnails = videoLinks.map(link => {
                    const videoId = getYoutubeVideoId(link);
                    return videoId ? getYoutubeThumbnailUrl(videoId) : '';
                });

                // Adicionando títulos e fontes dos vídeos
                const videoTitles = [result.titulo_video1, result.titulo_video2, result.titulo_video3];
                const videoSources = [result.fonte_video, result.fonte_video, result.fonte_video];

                result.thumbnails = thumbnails;
                result.links = videoLinks;
                result.titles = videoTitles;
                result.sources = videoSources;

                return result;
            });

        res.json(filteredResults);
    });
});

// Conexão ao MySQL e inicialização do servidor
conn.connect(err => {
    if (err) throw err;
    console.log('\n\nConectado ao mysql');
    app.listen(3000, () => {
        console.log('\nServidor rodando na porta 3000');
    });
});
