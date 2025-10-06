# Development Notes

## Encoding Issues and Prevention

### Detecting BOM/Garbage Bytes

**Common Signs of Encoding Issues:**
- Unexpected characters at the start of files (like `ï»¿`)
- Parser errors like "Unexpected token" on the first line
- Files that work locally but fail in CI/CD
- Copy-paste operations from terminals, emails, or documentation

**Detection Tools:**
```bash
# Use our encoding verification script
node scripts/tools/verify-encoding.js client/src/pages/Wagering.jsx

# Check for BOM with hexdump (if available)
hexdump -C file.js | head -1
# Look for: EF BB BF at the start

# VS Code: Look for encoding indicator in bottom status bar
# Should show "UTF-8" not "UTF-8 with BOM"
```

### Fixing Encoding Issues

**Using Our Verification Tool:**
```bash
# Check specific files
node scripts/tools/verify-encoding.js client/src/pages/*.jsx

# The tool will report:
# OK: path/to/file.jsx (utf-8 no BOM)
# or
# FAIL: path/to/file.jsx - BOM detected at start of file
```

**Using VS Code:**
1. Open the problematic file
2. Click the encoding indicator in the bottom status bar (usually "UTF-8 with BOM")
3. Select "Reopen with Encoding"
4. Choose "UTF-8" (without BOM)
5. Save the file (Ctrl+S)

**Using Command Line:**
```bash
# Remove BOM using sed (if available)
sed -i '1s/^\xEF\xBB\xBF//' file.js

# Or use dos2unix
dos2unix file.js
```

### Prevention Best Practices

**Never Copy-Paste From:**
- Terminal output that may include control characters
- Email content (especially from Outlook)
- PDF documents
- Web pages with hidden Unicode characters
- Documentation sites that inject tracking pixels

**Safe Copy-Paste Sources:**
- GitHub code view (raw mode preferred)
- VS Code to VS Code
- Plain text editors like Notepad++ (with proper encoding)
- IDE code completion and snippets

**Editor Configuration:**
- Use `.editorconfig` to enforce UTF-8 encoding
- Configure Prettier with `"endOfLine": "lf"` for consistent line endings
- Enable "Insert Final Newline" in editor settings
- Set default encoding to UTF-8 without BOM

**Git Configuration:**
```bash
# Ensure Git handles line endings properly
git config core.autocrlf false
git config core.eol lf
```

### Project Setup

This project includes:
- `.prettierrc` with `"endOfLine": "lf"` to normalize line endings
- `scripts/tools/verify-encoding.js` for automated encoding verification
- Recommended VS Code settings for UTF-8 without BOM

**Regular Verification:**
```bash
# Add to your development workflow
npm run verify-encoding  # (if added to package.json scripts)

# Or run directly before commits
node scripts/tools/verify-encoding.js client/src/**/*.{js,jsx,ts,tsx}
```