const converter = require('curl-to-postmanv2');
const codegen = require('postman-code-generators');
const sdk = require('postman-collection');

const curl = `
curl 'https://demo-shop.bug-buster.ru/index.php/checkout/cart/add/uenc/aHR0cHM6Ly9kZW1vLXNob3AuYnVnLWJ1c3Rlci5ydS9pbmRleC5waHAvcHJvdGV1cy1maXRuZXNzLWphY2tzaGlydC5odG1s/product/430/' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: ru,en;q=0.9,la;q=0.8,es;q=0.7,fr;q=0.6' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryBvy2muQouTgPLzUa' \
  -b 's_fid=5FA4A9CF5E169A53-3D54DFC41AFC2F0B; private_content_version=eeb4eccc7d973dfc5ef4bd276e4f7dfc; _ym_uid=1747053351804025976; _ym_d=1758123936; _ym_isad=2; PHPSESSID=85af445d9b2f9ae2baae4fcce8a282ac; form_key=tRRgU5ygfpyPfScM; mage-cache-storage={}; mage-cache-storage-section-invalidation={}; mage-cache-sessid=true; mage-messages=; recently_viewed_product={}; recently_viewed_product_previous={}; recently_compared_product={}; recently_compared_product_previous={}; product_data_storage={}; form_key=tRRgU5ygfpyPfScM' \
  -H 'Origin: https://demo-shop.bug-buster.ru' \
  -H 'Referer: https://demo-shop.bug-buster.ru/index.php/proteus-fitness-jackshirt.html' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 YaBrowser/25.8.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "YaBrowser";v="25.8", "Yowser";v="2.5"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  --data-raw $'------WebKitFormBoundaryBvy2muQouTgPLzUa\r\nContent-Disposition: form-data; name="product"\r\n\r\n430\r\n------WebKitFormBoundaryBvy2muQouTgPLzUa\r\nContent-Disposition: form-data; name="selected_configurable_option"\r\n\r\n\r\n------WebKitFormBoundaryBvy2muQouTgPLzUa\r\nContent-Disposition: form-data; name="related_product"\r\n\r\n\r\n------WebKitFormBoundaryBvy2muQouTgPLzUa\r\nContent-Disposition: form-data; name="item"\r\n\r\n430\r\n------WebKitFormBoundaryBvy2muQouTgPLzUa\r\nContent-Disposition: form-data; name="form_key"\r\n\r\ntRRgU5ygfpyPfScM\r\n------WebKitFormBoundaryBvy2muQouTgPLzUa\r\nContent-Disposition: form-data; name="super_attribute[144]"\r\n\r\n167\r\n------WebKitFormBoundaryBvy2muQouTgPLzUa\r\nContent-Disposition: form-data; name="super_attribute[93]"\r\n\r\n50\r\n------WebKitFormBoundaryBvy2muQouTgPLzUa\r\nContent-Disposition: form-data; name="qty"\r\n\r\n1\r\n------WebKitFormBoundaryBvy2muQouTgPLzUa--\r\n'
`

converter.convert({ type: 'string', data: curl }, function (err, conversion) {
  if (err) {
    console.error('Ошибка конвертации cURL:', err);
    process.exit(1);
  }
  if (!conversion || !conversion.result) {
    console.error('Конвертация не удалась:', conversion && conversion.reason);
    process.exit(1);
  }

  const collectionJson = conversion.output && conversion.output[0] && conversion.output[0].data;
  if (!collectionJson) {
    console.error('Не получены данные коллекции Postman.');
    process.exit(1);
  }

  console.log('\n--- collectionJson ---');
  console.log(JSON.stringify(collectionJson));

  const request = new sdk.Request(collectionJson);

  // вот тут все правильные параметры Language и Variant
  // https://www.npmjs.com/package/postman-code-generators#using-postman-code-generators-as-a-library
  // если хотим в Python то вот так будет
  // Python	Requests

  codegen.convert('cURL', 'cURL', request, {}, function (genErr, snippet) {
    if (genErr) {
      console.error('Ошибка генерации cURL:', genErr);
      process.exit(1);
    }
    console.log('\n--- Generated cURL ---');
    console.log(snippet);
  });
});