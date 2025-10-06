#!/usr/bin/env node

/**
 * verify-encoding.js
 * 
 * Verifies that JavaScript/TypeScript files are properly encoded as UTF-8 without BOM
 * and contain no garbage bytes before the first import statement.
 * 
 * Usage: node scripts/tools/verify-encoding.js <file1> [file2] [...]
 */

const fs = require('fs');
const path = require('path');

function verifyFileEncoding(filePath) {
  try {
    // Read file as buffer to check for BOM
    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString('utf8');
    
    // Check for BOM (Byte Order Mark)
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      throw new Error('BOM detected at start of file');
    }
    
    // Find the first import statement
    const importMatch = content.match(/^(\s*)import\s/m);
    if (importMatch) {
      const beforeImport = content.substring(0, importMatch.index);
      
      // Check for non-ASCII characters before first import
      for (let i = 0; i < beforeImport.length; i++) {
        const charCode = beforeImport.charCodeAt(i);
        // Allow common whitespace characters and standard ASCII
        if (charCode > 127 && charCode !== 8203 && charCode !== 65279) { // Exclude zero-width chars
          throw new Error(`Non-ASCII character (code ${charCode}) found at position ${i} before first import`);
        }
      }
    }
    
    // Check for common garbage bytes that can appear from copy-paste
    const garbagePatterns = [
      /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, // Control characters (except \t, \n, \r)
      /\uFEFF/g, // Zero Width No-Break Space (BOM in UTF-16)
      /\u200B/g, // Zero Width Space
    ];
    
    for (const pattern of garbagePatterns) {
      const matches = content.match(pattern);
      if (matches && importMatch) {
        const beforeImport = content.substring(0, importMatch.index);
        if (pattern.test(beforeImport)) {
          throw new Error(`Garbage bytes detected before first import: ${matches.join(', ')}`);
        }
      }
    }
    
    console.log(`OK: ${filePath} (utf-8 no BOM)`);
    return true;
    
  } catch (error) {
    console.error(`FAIL: ${filePath} - ${error.message}`);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node verify-encoding.js <file1> [file2] [...]');
    process.exit(1);
  }
  
  let allValid = true;
  
  for (const filePath of args) {
    if (!fs.existsSync(filePath)) {
      console.error(`FAIL: ${filePath} - File does not exist`);
      allValid = false;
      continue;
    }
    
    const isValid = verifyFileEncoding(filePath);
    if (!isValid) {
      allValid = false;
    }
  }
  
  if (!allValid) {
    console.error('\nSome files failed encoding verification.');
    process.exit(1);
  }
  
  console.log('\nAll files passed encoding verification.');
}

if (require.main === module) {
  main();
}

module.exports = { verifyFileEncoding };