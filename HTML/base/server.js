const http = require('http');
const fs = require('fs');
const path = require('path');

// Создаем базовый файл базы данных, если он не существует
const initDatabase = () => {
    const dbPath = path.join(__dirname, 'database.json');
    if (!fs.existsSync(dbPath)) {
        const initialData = {
            tables: {
                "Контакты": {
                    "columns": {
                        "Имя": "text",
                        "Телефон": "text",
                        "Email": "text"
                    },
                    "data": []
                }
            }
        };
        fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
        console.log('Создан новый файл базы данных');
    }
};

// Инициализируем базу данных
initDatabase();

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    // Настраиваем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Логируем запрос
    console.log(`${req.method} ${req.url}`);

    // Обрабатываем OPTIONS запросы для CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Обработка GET запроса для получения базы данных
    if (req.method === 'GET' && req.url === '/database.json') {
        try {
            const data = fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (error) {
            console.error('Ошибка чтения базы данных:', error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Ошибка чтения файла базы данных' }));
        }
        return;
    }

    // Обработка POST запроса для сохранения базы данных
    if (req.method === 'POST' && req.url === '/save-database') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFileSync(
                    path.join(__dirname, 'database.json'),
                    JSON.stringify(data, null, 2),
                    'utf8'
                );
                
                console.log('База данных успешно сохранена');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success' }));
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Ошибка сохранения данных' }));
            }
        });
        return;
    }

    // Обработка статических файлов
    if (req.method === 'GET') {
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'text/plain';

        try {
            if (!fs.existsSync(filePath)) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Файл не найден' }));
                return;
            }

            const content = fs.readFileSync(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        } catch (error) {
            console.error('Ошибка чтения файла:', error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Ошибка чтения файла' }));
        }
    }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Рабочая директория: ${__dirname}`);
});

// Обработка ошибок сервера
server.on('error', (error) => {
    console.error('Ошибка сервера:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Сервер остановлен');
        process.exit(0);
    });
}); 