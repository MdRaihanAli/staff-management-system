const fs = require('fs').promises;
const path = require('path');

// Test configuration
const tests = [
  {
    name: 'Environment Configuration',
    test: async () => {
      const envPath = path.join(__dirname, '.env');
      const exists = await fs.access(envPath).then(() => true).catch(() => false);
      if (!exists) throw new Error('.env file not found');
      
      const content = await fs.readFile(envPath, 'utf8');
      if (!content.includes('MONGODB_URI')) throw new Error('MONGODB_URI not configured');
      if (!content.includes('FRONTEND_URL')) throw new Error('FRONTEND_URL not configured');
      
      return '✅ Environment configuration valid';
    }
  },
  {
    name: 'Package.json Scripts',
    test: async () => {
      const pkgPath = path.join(__dirname, 'package.json');
      const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
      
      const requiredScripts = ['start:json', 'server:json', 'dev', 'build', 'test:mongo'];
      const missing = requiredScripts.filter(script => !pkg.scripts[script]);
      
      if (missing.length > 0) {
        throw new Error(`Missing scripts: ${missing.join(', ')}`);
      }
      
      return '✅ All required npm scripts present';
    }
  },
  {
    name: 'Server Files',
    test: async () => {
      const serverFiles = [
        'server/server.js',
        'server/server-json.cjs',
        'server/models/Staff.js'
      ];
      
      for (const file of serverFiles) {
        const filePath = path.join(__dirname, file);
        await fs.access(filePath);
      }
      
      return '✅ All server files present';
    }
  },
  {
    name: 'Route Files',
    test: async () => {
      const routeFiles = [
        'server/routes/staff.js',
        'server/routes/hotels.js',
        'server/routes/companies.js',
        'server/routes/departments.js'
      ];
      
      for (const file of routeFiles) {
        const filePath = path.join(__dirname, file);
        await fs.access(filePath);
      }
      
      return '✅ All route files present';
    }
  },
  {
    name: 'Frontend API Service',
    test: async () => {
      const apiPath = path.join(__dirname, 'src/services/api.ts');
      const content = await fs.readFile(apiPath, 'utf8');
      
      const requiredMethods = ['getAllStaff', 'createStaff', 'updateStaff', 'deleteStaff'];
      const missing = requiredMethods.filter(method => !content.includes(method));
      
      if (missing.length > 0) {
        throw new Error(`Missing API methods: ${missing.join(', ')}`);
      }
      
      return '✅ API service complete';
    }
  },
  {
    name: 'TypeScript Configuration',
    test: async () => {
      const files = ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json'];
      
      for (const file of files) {
        const filePath = path.join(__dirname, file);
        await fs.access(filePath);
      }
      
      return '✅ TypeScript configuration complete';
    }
  },
  {
    name: 'Staff Context Integration',
    test: async () => {
      const contextPath = path.join(__dirname, 'src/contexts/StaffContext.tsx');
      const content = await fs.readFile(contextPath, 'utf8');
      
      if (!content.includes('StaffAPI')) {
        throw new Error('StaffContext not using API service');
      }
      
      if (!content.includes('getAllStaff')) {
        throw new Error('StaffContext missing API integration');
      }
      
      return '✅ StaffContext properly integrated with API';
    }
  },
  {
    name: 'Migration Script',
    test: async () => {
      const migratePath = path.join(__dirname, 'migrate.cjs');
      await fs.access(migratePath);
      
      const content = await fs.readFile(migratePath, 'utf8');
      if (!content.includes('staff_data_100.json')) {
        throw new Error('Migration script not configured for data file');
      }
      
      return '✅ Migration script ready';
    }
  }
];

// Run all tests
async function runTests() {
  console.log('🧪 Running System Validation Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const { name, test } of tests) {
    try {
      const result = await test();
      console.log(`${result} - ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ FAILED - ${name}: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Your system is ready to use.');
    console.log('\n💡 Next steps:');
    console.log('   1. npm run start:json  # Start the application');
    console.log('   2. Visit http://localhost:5175');
    console.log('   3. Optional: npm run test:mongo  # Test MongoDB');
  } else {
    console.log('⚠️  Some tests failed. Please fix the issues above.');
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});
