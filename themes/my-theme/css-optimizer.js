#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Extracts Google Fonts information from CSS content and generates optimized import
 * @param {string} cssContent - The content of the CSS file
 * @return {string} - Optimized Google Font @import statement
 */
function optimizeGoogleFonts(cssContent) {
  // Find existing Google Fonts @import statements
  const importRegex = /@import\s+url\(['"]?(https?:\/\/fonts\.googleapis\.com\/css2?[^'")\s]+)['"]?\)/gi;
  const existingImports = [];
  let importMatch;
  
  while ((importMatch = importRegex.exec(cssContent)) !== null) {
    existingImports.push(importMatch[1]);
  }
  
  // Regular expressions to match font-family and font-weight declarations
  const fontFamilyRegex = /font-family:[\s]*['"]?([^'",']*)['"]/gi;
  const fontWeightRegex = /font-weight:[\s]*([^;]*);/gi;
  
  // Extract all font-families
  const fontFamilies = new Set();
  let fontFamilyMatch;
  while ((fontFamilyMatch = fontFamilyRegex.exec(cssContent)) !== null) {
    const fontFamily = fontFamilyMatch[1].trim();
    // Exclude generic font families
    const genericFonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong'];
    if (!genericFonts.includes(fontFamily.toLowerCase())) {
      fontFamilies.add(fontFamily);
    }
  }
  
  // Extract all font-weights
  const fontWeights = new Set();
  let fontWeightMatch;
  while ((fontWeightMatch = fontWeightRegex.exec(cssContent)) !== null) {
    const fontWeight = fontWeightMatch[1].trim();
    fontWeights.add(fontWeight);
  }
  
  // Add default weight if none specified
  if (fontWeights.size === 0) {
    fontWeights.add('400');
  }
  
  // Convert weight names to numbers where applicable
  const normalizedWeights = new Set();
  fontWeights.forEach(weight => {
    switch (weight.toLowerCase()) {
      case 'normal':
        normalizedWeights.add('400');
        break;
      case 'bold':
        normalizedWeights.add('700');
        break;
      case 'lighter':
        normalizedWeights.add('300'); // approximate
        break;
      case 'bolder':
        normalizedWeights.add('700'); // approximate
        break;
      default:
        normalizedWeights.add(weight);
    }
  });
  
  // Format font families for Google Fonts URL
  const formattedFamilies = [...fontFamilies].map(family => {
    // Replace spaces with plus signs and format weights
    const formattedFamily = family.replace(/\s+/g, '+');
    const weightsString = [...normalizedWeights].join(',');
    return `${formattedFamily}:wght@${weightsString}`;
  });
  
  // Generate the Google Fonts import statement
  let importStatement = '';
  if (formattedFamilies.length > 0) {
    const fontUrl = `https://fonts.googleapis.com/css2?${formattedFamilies.join('&')}&display=swap`;
    importStatement = `@import url("${fontUrl}");`;
  } else if (existingImports.length > 0) {
    // If no font families were detected in CSS but there are existing imports, keep the first one
    importStatement = `@import url("${existingImports[0]}");`;
  } else {
    importStatement = '/* No Google Fonts detected in the CSS file */';
  }
  
  return importStatement;
}

// Function to replace existing Google Fonts imports with the optimized one
function replaceGoogleFontsImports(cssContent, optimizedImport) {
  // First, remove all existing Google Fonts imports
  const cleanedCss = cssContent.replace(/@import\s+url\(['"]?https?:\/\/fonts\.googleapis\.com\/css2?[^'")\s]+['"]?\)\s*;?/gi, '');
  
  // Add the optimized import at the beginning of the file
  if (optimizedImport.startsWith('@import')) {
    return optimizedImport + '\n\n' + cleanedCss.trim();
  }
  
  // If no optimized import (comment only), just return the cleaned CSS
  return cleanedCss.trim();
}

// Main function to process the CSS file
function main() {
  if (process.argv.length < 3) {
    console.error('Usage: node google-fonts-optimizer.js <css-file-path>');
    process.exit(1);
  }
  
  const cssFilePath = process.argv[2];
  const outputFlag = process.argv.includes('--output') || process.argv.includes('-o');
  
  try {
    // Read the CSS file
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    
    // Generate optimized Google Fonts import
    const optimizedImport = optimizeGoogleFonts(cssContent);
    
    // Output the result
    console.log('\nOptimized Google Fonts Import:');
    console.log('--------------------------');
    console.log(optimizedImport);
    console.log('--------------------------');
    
    // If output flag is provided, replace imports in the original file
    if (outputFlag) {
      const optimizedCss = replaceGoogleFontsImports(cssContent, optimizedImport);
      const outputPath = path.join(
        path.dirname(cssFilePath),
        `${path.basename(cssFilePath, '.css')}.optimized.css`
      );
      fs.writeFileSync(outputPath, optimizedCss);
      console.log(`\nOptimized CSS saved to: ${outputPath}`);
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

module.exports = { optimizeGoogleFonts, replaceGoogleFontsImports };
