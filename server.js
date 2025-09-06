const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.env.PORT || 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  let parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Handle root path - redirect to login
  if (pathname === '/') {
    pathname = '/connected-login.html';
  }

  // Remove leading slash and resolve file path
  let filePath = path.join(__dirname, pathname);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>404 - Page Not Found</title>
          <style>
            body { 
              font-family: 'Inter', sans-serif; 
              background: linear-gradient(135deg, #0A1628 0%, #1A2332 100%);
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .error-container {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              padding: 40px;
            }
            h1 { color: #14B8A6; margin-bottom: 20px; }
            a { color: #06B6D4; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <p><a href="/">← Return to ConnectED</a></p>
          </div>
        </body>
        </html>
      `);
      return;
    }

    // File exists, read and serve it
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
        return;
      }

      // Get file extension and set content type
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`🚀 ConnectED development server running at:`);
  console.log(`   Local:   http://localhost:${port}`);
  console.log(`   Network: http://0.0.0.0:${port}`);
  console.log('');
  console.log('📋 Available routes:');
  console.log('   /                     → connected-login.html (redirects)');
  console.log('   /connected-login.html → Login page');
  console.log('   /connected-discovery.html → Main discovery feed');
  console.log('   /connected-profile.html → User profile');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down ConnectED development server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});