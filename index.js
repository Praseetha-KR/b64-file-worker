addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
})

async function handleRequest({ request }) {
  try {
    if (request.method === 'GET') {
      const res = new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Img color</title>
            <style>
              :root {
                --main-text-color: #d5d7d8;
                --main-bg-color: #1E1F20;
                --dark-bg-color: #191b1d;
                --primary-color: #F3801F;
                --border-radius: 0.3rem;
                --gap: 2rem;
                --btn-pad: 0.6rem 1.8rem;
              }
              *, *::before, *::after {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
              }
              body {
                background: var(--main-bg-color);
                color: var(--main-text-color);
                font-family: sans-serif;
                font-size: 18px;
                padding: 0;

              }
              header {
                background: var(--primary-color);
                color: var(--main-bg-color);
                padding: 0.6rem var(--gap);
              }
              h1 {
                font-size: 1.3rem;
              }
              main {
                padding: var(--gap);
              }
              .input-file {
                font-size: 1.2rem;
              }
              .output {
                background: var(--dark-bg-color);
                color: var(--main-text-color);
                display: block;
                width: 100%;
                border: 1px solid var(--primary-color);
                border-radius: var(--border-radius);
                margin-top: 1rem;
                margin-bottom: 0.5rem;
                resize: vertical;
              }
              .output-actions {
                display: flex;
                justify-content: center;
              }
              .output-actions > * {
                margin: 0.5rem;
              }
              .btn {
                padding: var(--btn-pad);
                border-radius: var(--border-radius);
                border: none;
                font-size: 1.2rem;
              }
              .copy {
                background: var(--primary-color);
                color: var(--main-bg-color);
              }
              .clear {
                background: var(--main-text-color);
                color: var(--main-bg-color);
              }
            </style>
          </head>
          <body>
            <header>
              <h1>Encode Files to Base64</h1>
            </header>
            <main>
              <div class="input">
                Upload a file: <input class="input-file" type="file" onchange="post()"/>
              </div>
              <div class="result">
                <textarea class="output" rows="20"></textarea>
                <div class="output-actions">
                  <button class="copy btn" onclick="copyToClipboard()">Copy</button>
                  <button class="clear btn" onclick="clearFile()">Clear</button>
                </div>
              </div>
            </main>

            <script>
              function post() {
                var file = document.querySelector('input[type=file]').files[0];
                const output = document.querySelector('.output');
                var reader = new FileReader();
                output.value = 'Loading...';

                reader.addEventListener('load', function () {
                  fetch(location.href, {
                    method: "POST",
                    body: reader.result
                  })
                    .then(res => res.text())
                    .then(res => {
                      output.value = res;
                    });
                }, false);

                if (file) {
                  reader.readAsDataURL(file);
                }
              }

              function copyToClipboard() {
                const output = document.querySelector('.output');
                output.select();
                document.execCommand('copy');
              };

              function clearFile() {
                const input = document.querySelector('.input-file');
                input.value = '';

                const output = document.querySelector('.output');
                output.value = '';
              };
            </script>
          </body>
        </html>
      `);
      res.headers.set('content-type', 'text/html');
      return res;
    }

    if (request.method === 'POST') {
      const base64Data = await request.text();
      return new Response(base64Data);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (err) {
    console.log(err);
    return new Response(err.stack, { status: 500 });
  }
}
