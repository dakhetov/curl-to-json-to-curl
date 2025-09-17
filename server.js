const express = require('express');
const cors = require('cors');
const path = require('path');
const converter = require('curl-to-postmanv2');
const codegen = require('postman-code-generators');
const sdk = require('postman-collection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API endpoint для конвертации cURL (использует логику из parse.js)
app.post('/api/convert', (req, res) => {
  const { curlCommand } = req.body;
  
  if (!curlCommand) {
    return res.status(400).json({ error: 'cURL команда не предоставлена' });
  }

  try {
    // Используем точно ту же логику из parse.js
    converter.convert({ type: 'string', data: curlCommand }, function (err, conversion) {
      if (err) {
        console.error('Ошибка конвертации cURL:', err);
        return res.status(500).json({ error: 'Ошибка конвертации cURL: ' + err.message });
      }
      
      if (!conversion || !conversion.result) {
        console.error('Конвертация не удалась:', conversion && conversion.reason);
        return res.status(500).json({ error: 'Конвертация не удалась: ' + (conversion && conversion.reason) });
      }

      const collectionJson = conversion.output && conversion.output[0] && conversion.output[0].data;
      if (!collectionJson) {
        console.error('Не получены данные коллекции Postman.');
        return res.status(500).json({ error: 'Не получены данные коллекции Postman.' });
      }

      // Создаем Request объект (как в parse.js)
      const request = new sdk.Request(collectionJson);

      // Генерируем cURL (как в parse.js)
      codegen.convert('cURL', 'cURL', request, {}, function (genErr, snippet) {
        if (genErr) {
          console.error('Ошибка генерации cURL:', genErr);
          return res.status(500).json({ error: 'Ошибка генерации cURL: ' + genErr.message });
        }

        // Форматируем cURL в одну строку (как в parse.js)
        const oneLineCurl = snippet
          .replace(/\\\s*\n\s*/g, ' ')  // убираем обратные слэши и переносы строк
          .replace(/\s+/g, ' ')         // заменяем множественные пробелы на одинарные
          .trim();                      // убираем пробелы в начале и конце

        // Возвращаем результат (как в parse.js)
        res.json({
          success: true,
          result: {
            collectionJson: JSON.stringify(collectionJson, null, 2),
            generatedCurl: snippet,
            oneLineCurl: oneLineCurl
          }
        });
      });
    });
  } catch (error) {
    console.error('Неожиданная ошибка:', error);
    res.status(500).json({ error: 'Неожиданная ошибка: ' + error.message });
  }
});

// Обслуживаем статические файлы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Откройте http://localhost:${PORT} в браузере`);
});
