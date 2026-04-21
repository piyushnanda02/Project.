const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing authRoutes.js...');

const authRoutesPath = path.join(__dirname, 'routes', 'authRoutes.js');

// Read the current file
let content = fs.readFileSync(authRoutesPath, 'utf8');

// Fix the syntax error (remove anything after module.exports)
if (content.includes('module.exports = router;') && content.includes('const express')) {
    // Find the position of module.exports
    const exportIndex = content.indexOf('module.exports = router;');
    
    if (exportIndex !== -1) {
        // Keep only the part before module.exports + the export line
        content = content.substring(0, exportIndex + 24);
        
        // Write back the fixed content
        fs.writeFileSync(authRoutesPath, content);
        console.log('✅ Fixed authRoutes.js');
    }
}

// Verify the fix
console.log('\n📝 New file content:');
console.log('===================');
console.log(fs.readFileSync(authRoutesPath, 'utf8'));

console.log('\n✅ Fix complete! Run npm run dev again.');