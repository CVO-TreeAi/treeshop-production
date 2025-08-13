const http = require('http');

// Simple health check script
const options = {
  hostname: 'localhost',
  port: 3232,
  path: '/',
  method: 'GET',
  timeout: 5000
};

console.log('Testing TreeShop Pro Website at http://localhost:3232');

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`✅ Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (data.includes('<title>')) {
      const title = data.match(/<title>(.*?)<\/title>/)?.[1] || 'No title found';
      console.log(`✅ Page Title: ${title}`);
    }
    
    if (data.includes('TreeShop') || data.includes('forestry') || data.includes('mulching')) {
      console.log('✅ TreeShop content detected - website appears to be working!');
    } else {
      console.log('⚠️  TreeShop content not detected in page');
    }
    
    console.log(`✅ Response length: ${data.length} characters`);
    console.log('✅ Website verification complete!');
  });
});

req.on('error', (e) => {
  console.log(`❌ Error: ${e.message}`);
  console.log('❌ Make sure the development server is running with: npm run dev');
});

req.on('timeout', () => {
  console.log('❌ Request timed out');
  req.destroy();
});

req.end();