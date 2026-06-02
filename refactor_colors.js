const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const exactColorMap = {
  '"#3B82F6"': 'COLORS.PRIMARY_MAIN',
  "'#3B82F6'": 'COLORS.PRIMARY_MAIN',
  '"#EFF6FF"': 'COLORS.PRIMARY_LIGHT',
  "'#EFF6FF'": 'COLORS.PRIMARY_LIGHT',
  '"#2563EB"': 'COLORS.PRIMARY_MAIN',
  "'#2563EB'": 'COLORS.PRIMARY_MAIN',
  '"#64748B"': 'COLORS.SECONDARY_MAIN',
  "'#64748B'": 'COLORS.SECONDARY_MAIN',
  '"#F8FAFC"': 'COLORS.GRAY_50',
  "'#F8FAFC'": 'COLORS.GRAY_50',
  '"#F1F5F9"': 'COLORS.GRAY_100',
  "'#F1F5F9'": 'COLORS.GRAY_100',
  '"#E2E8F0"': 'COLORS.GRAY_200',
  "'#E2E8F0'": 'COLORS.GRAY_200',
  '"#CBD5E1"': 'COLORS.GRAY_300',
  "'#CBD5E1'": 'COLORS.GRAY_300',
  '"#94A3B8"': 'COLORS.GRAY_400',
  "'#94A3B8'": 'COLORS.GRAY_400',
  '"#475569"': 'COLORS.GRAY_600',
  "'#475569'": 'COLORS.GRAY_600',
  '"#334155"': 'COLORS.GRAY_700',
  "'#334155'": 'COLORS.GRAY_700',
  '"#1E293B"': 'COLORS.GRAY_800',
  "'#1E293B'": 'COLORS.GRAY_800',
  '"#0F172A"': 'COLORS.GRAY_900',
  "'#0F172A'": 'COLORS.GRAY_900',
  '"#F8F9FB"': 'COLORS.BG_PAGE',
  "'#F8F9FB'": 'COLORS.BG_PAGE',
  '"#FFFFFF"': 'COLORS.BG_CARD',
  "'#FFFFFF'": 'COLORS.BG_CARD',
  '"white"': 'COLORS.BG_CARD',
  "'white'": 'COLORS.BG_CARD',
  '"#10B981"': 'COLORS.SUCCESS_MAIN',
  "'#10B981'": 'COLORS.SUCCESS_MAIN',
  '"#DCFCE7"': 'COLORS.SUCCESS_LIGHT',
  "'#DCFCE7'": 'COLORS.SUCCESS_LIGHT',
  '"#166534"': 'COLORS.SUCCESS_DARK',
  "'#166534'": 'COLORS.SUCCESS_DARK',
  '"#F59E0B"': 'COLORS.WARNING_MAIN',
  "'#F59E0B'": 'COLORS.WARNING_MAIN',
  '"#FEF9C3"': 'COLORS.WARNING_LIGHT',
  "'#FEF9C3'": 'COLORS.WARNING_LIGHT',
  '"#854D0E"': 'COLORS.WARNING_DARK',
  "'#854D0E'": 'COLORS.WARNING_DARK',
  '"#EF4444"': 'COLORS.ERROR_MAIN',
  "'#EF4444'": 'COLORS.ERROR_MAIN',
  '"#FEE2E2"': 'COLORS.ERROR_LIGHT',
  "'#FEE2E2'": 'COLORS.ERROR_LIGHT',
  '"#991B1B"': 'COLORS.ERROR_DARK',
  "'#991B1B'": 'COLORS.ERROR_DARK',
  '"#DBEAFE"': 'COLORS.INFO_LIGHT',
  "'#DBEAFE'": 'COLORS.INFO_LIGHT',
  '"#1E40AF"': 'COLORS.INFO_DARK',
  "'#1E40AF'": 'COLORS.INFO_DARK',
  '"#0D6EFD"': 'COLORS.PRIMARY_MAIN',
  "'#0D6EFD'": 'COLORS.PRIMARY_MAIN',
  
  // Variables mapping
  '"var(--primary)"': 'COLORS.PRIMARY_MAIN',
  "'var(--primary)'": 'COLORS.PRIMARY_MAIN',
  '"var(--primary-light)"': 'COLORS.PRIMARY_LIGHT',
  "'var(--primary-light)'": 'COLORS.PRIMARY_LIGHT',
  '"var(--text-main)"': 'COLORS.TEXT_MAIN',
  "'var(--text-main)'": 'COLORS.TEXT_MAIN',
  '"var(--text-secondary)"': 'COLORS.TEXT_SECONDARY',
  "'var(--text-secondary)'": 'COLORS.TEXT_SECONDARY',
  '"var(--text-muted)"': 'COLORS.TEXT_MUTED',
  "'var(--text-muted)'": 'COLORS.TEXT_MUTED',
  '"var(--text-inverse)"': 'COLORS.TEXT_INVERSE',
  "'var(--text-inverse)'": 'COLORS.TEXT_INVERSE',
  '"var(--bg-page)"': 'COLORS.BG_PAGE',
  "'var(--bg-page)'": 'COLORS.BG_PAGE',
  '"var(--bg-card)"': 'COLORS.BG_CARD',
  "'var(--bg-card)'": 'COLORS.BG_CARD',
  '"var(--bg-header)"': 'COLORS.BG_HEADER',
  "'var(--bg-header)'": 'COLORS.BG_HEADER',
  '"var(--bg-sidebar)"': 'COLORS.BG_SIDEBAR',
  "'var(--bg-sidebar)'": 'COLORS.BG_SIDEBAR',
  '"var(--orange)"': 'COLORS.WARNING_MAIN',
  "'var(--orange)'": 'COLORS.WARNING_MAIN',
  '"var(--green)"': 'COLORS.SUCCESS_MAIN',
  "'var(--green)'": 'COLORS.SUCCESS_MAIN',
  '"var(--red)"': 'COLORS.ERROR_MAIN',
  "'var(--red)'": 'COLORS.ERROR_MAIN',
  '"var(--yellow)"': 'COLORS.WARNING_MAIN',
  "'var(--yellow)'": 'COLORS.WARNING_MAIN',
  '"var(--border)"': 'COLORS.BORDER_MAIN',
  "'var(--border)'": 'COLORS.BORDER_MAIN',
};

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const importStatement = `import { COLORS } from "@/constants/Constant";\n`;

walk(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let modified = false;

    // Direct exact matches inside objects or as props (e.g., color: "#EF4444" -> color: COLORS.ERROR_MAIN)
    for (const [colorStr, constant] of Object.entries(exactColorMap)) {
      // Create a global regex that matches the color string only if it's a standalone value in an object or prop
      // e.g. color: "#EF4444" or background="#EF4444" or fill="#EF4444"
      const regex = new RegExp(`(: |=|fill=|stroke=|color=)\\s*${colorStr.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}`, 'g');
      content = content.replace(regex, `$1${constant}`);
    }

    // Handle template literals or concatenated strings like: `1px solid var(--border)` or `1px solid #E2E8F0`
    // Convert to `1px solid ${COLORS.BORDER_MAIN}`
    const stringReplacements = [
      { pattern: /"([^"]*)var\(--border\)([^"]*)"/g, replace: '`$1${COLORS.BORDER_MAIN}$2`' },
      { pattern: /'([^']*)var\(--border\)([^']*)'/g, replace: '`$1${COLORS.BORDER_MAIN}$2`' },
      { pattern: /"([^"]*)#E2E8F0([^"]*)"/gi, replace: '`$1${COLORS.BORDER_MAIN}$2`' },
      { pattern: /'([^']*)#E2E8F0([^']*)'/gi, replace: '`$1${COLORS.BORDER_MAIN}$2`' },
      
      { pattern: /"([^"]*)var\(--bg-card\)([^"]*)"/g, replace: '`$1${COLORS.BG_CARD}$2`' },
      { pattern: /'([^']*)var\(--bg-card\)([^']*)'/g, replace: '`$1${COLORS.BG_CARD}$2`' },
    ];

    stringReplacements.forEach(({ pattern, replace }) => {
       content = content.replace(pattern, replace);
    });

    if (content !== originalContent) {
      if (!content.includes('import { COLORS }')) {
        // Insert after 'use client' or at top
        if (content.includes('"use client";')) {
          content = content.replace('"use client";', `"use client";\n${importStatement}`);
        } else if (content.includes("'use client';")) {
          content = content.replace("'use client';", `'use client';\n${importStatement}`);
        } else {
          content = importStatement + content;
        }
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated colors in ${filePath}`);
    }
  }
});
console.log('Finished refactoring colors.');
