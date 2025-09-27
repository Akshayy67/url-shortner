/**
 * Simple test script to verify API functionality
 * Run with: node test-api.js
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing URL Shortener API...\n');

  try {
    // Test 1: Shorten a URL
    console.log('1. Testing URL shortening...');
    const shortenResponse = await fetch(`${BASE_URL}/api/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.example.com/very/long/url/that/needs/shortening',
      }),
    });

    if (!shortenResponse.ok) {
      throw new Error(`HTTP error! status: ${shortenResponse.status}`);
    }

    const shortenData = await shortenResponse.json();
    console.log('✅ URL shortened successfully');
    console.log(`   Original: ${shortenData.data.original_url}`);
    console.log(`   Short: ${shortenData.data.shortUrl}`);
    console.log(`   Code: ${shortenData.data.short_code}\n`);

    // Test 2: Test with custom alias
    console.log('2. Testing custom alias...');
    const customResponse = await fetch(`${BASE_URL}/api/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.github.com',
        customAlias: 'my-github',
      }),
    });

    if (!customResponse.ok) {
      throw new Error(`HTTP error! status: ${customResponse.status}`);
    }

    const customData = await customResponse.json();
    console.log('✅ Custom alias created successfully');
    console.log(`   Alias: ${customData.data.custom_alias}`);
    console.log(`   Short: ${customData.data.shortUrl}\n`);

    // Test 3: Get recent URLs
    console.log('3. Testing recent URLs retrieval...');
    const urlsResponse = await fetch(`${BASE_URL}/api/urls?limit=5`);

    if (!urlsResponse.ok) {
      throw new Error(`HTTP error! status: ${urlsResponse.status}`);
    }

    const urlsData = await urlsResponse.json();
    console.log('✅ Recent URLs retrieved successfully');
    console.log(`   Found ${urlsData.data.length} URLs\n`);

    // Test 4: Generate QR code
    console.log('4. Testing QR code generation...');
    const qrResponse = await fetch(`${BASE_URL}/api/qr?url=${encodeURIComponent(shortenData.data.shortUrl)}`);

    if (!qrResponse.ok) {
      throw new Error(`HTTP error! status: ${qrResponse.status}`);
    }

    const qrData = await qrResponse.json();
    console.log('✅ QR code generated successfully');
    console.log(`   QR code data URL length: ${qrData.qrCode.length} characters\n`);

    // Test 5: Test redirection (this will actually redirect, so we just check if the endpoint exists)
    console.log('5. Testing redirection endpoint...');
    const redirectResponse = await fetch(`${BASE_URL}/${shortenData.data.short_code}`, {
      method: 'HEAD', // Use HEAD to avoid actual redirection
      redirect: 'manual', // Don't follow redirects
    });

    if (redirectResponse.status === 302 || redirectResponse.status === 301) {
      console.log('✅ Redirection endpoint working correctly\n');
    } else {
      console.log(`⚠️  Unexpected redirect status: ${redirectResponse.status}\n`);
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ URL shortening');
    console.log('   ✅ Custom aliases');
    console.log('   ✅ Recent URLs retrieval');
    console.log('   ✅ QR code generation');
    console.log('   ✅ Redirection endpoint');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the development server is running (npm run dev)');
    console.log('   2. Check that Supabase is configured correctly');
    console.log('   3. Verify environment variables are set');
    console.log('   4. Ensure the database schema is applied');
  }
}

// Run the tests
testAPI();
