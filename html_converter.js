const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlDir = path.join(__dirname, 'stitch_screens');
const appDir = path.join(__dirname, 'src', 'app');

const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

// Icon mapping: Material Symbols to Lucide React
const iconMap = {
    'menu': 'Menu',
    'search': 'Search',
    'notifications': 'Bell',
    'settings': 'Settings',
    'space_dashboard': 'LayoutDashboard',
    'table_restaurant': 'Utensils',
    'inventory_2': 'Package',
    'receipt_long': 'Receipt',
    'point_of_sale': 'MonitorSpeaker',
    'more_vert': 'MoreVertical',
    'add': 'Plus',
    'edit': 'Edit',
    'delete': 'Trash2',
    'close': 'X',
    'check_circle': 'CheckCircle',
    'arrow_back': 'ArrowLeft',
    'person': 'User',
    'logout': 'LogOut',
    'shopping_cart': 'ShoppingCart',
    'local_cafe': 'Coffee',
    'restaurant': 'Utensils',
    'fastfood': 'Sandwich',
    'cake': 'Cake',
    'water_drop': 'Droplets',
    'groups': 'Users',
    'payments': 'CreditCard',
    'calendar_today': 'Calendar',
    'schedule': 'Clock',
    'visibility': 'Eye',
    'visibility_off': 'EyeOff',
    'home': 'Home',
    'dashboard': 'LayoutDashboard',
    'list': 'List',
    'filter_list': 'Filter',
    'inventory': 'Archive',
    'storefront': 'Store',
    'monitoring': 'Activity',
    'currency_exchange': 'Banknote',
    'local_dining': 'UtensilsCrossed',
    'remove': 'Minus'
};

function camelCase(str) {
    if (str === 'class') return 'className';
    if (str === 'for') return 'htmlFor';
    if (str === 'xmlns:xlink') return 'xmlnsXlink';
    if (str === 'xlink:href') return 'xlinkHref';
    
    // svg attrs
    const svgAttrs = [
        'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule',
        'stroke-dasharray', 'stroke-dashoffset', 'stroke-opacity'
    ];
    if (svgAttrs.includes(str)) {
        return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
    }
    
    // React prefers lowercase for some standard html attributes that might be camelcased differently
    return str;
}

function processNode(node, usedIcons) {
  if (node.type === 'text') {
    return node.data;
  }
  if (node.type === 'comment') {
    return `{/* ${node.data} */}`;
  }
  if (node.type === 'tag' || node.type === 'script' || node.type === 'style') {
    if (node.name === 'script' || node.name === 'style') {
        return ''; // remove it
    }
    
    if (node.name === 'span' && node.attribs && (node.attribs.class || '').includes('material-symbols-outlined')) {
        let text = '';
        if (node.children && node.children.length > 0 && node.children[0].type === 'text') {
            text = node.children[0].data.trim();
        }
        const iconName = iconMap[text] || 'CircleHelp';
        usedIcons.add(iconName);
        const className = (node.attribs.class || '').replace('material-symbols-outlined', '').trim();
        return `<${iconName} ${className ? `className="${className}"` : ''} />`;
    }

    let props = '';
    for (const [key, value] of Object.entries(node.attribs || {})) {
        if (key === 'style') continue; // Skip inline styles to keep it simple, or format them correctly.
        if (key.startsWith('on')) continue; // Skip inline event handlers like onclick, onsubmit
        const jsxKey = camelCase(key);
        // Escape quotes
        const val = value.replace(/"/g, '&quot;');
        props += ` ${jsxKey}="${val}"`;
    }

    const selfClosing = ['input', 'img', 'br', 'hr', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'source', 'link', 'meta'].includes(node.name);

    if (selfClosing) {
        return `<${node.name}${props} />`;
    }

    let childrenStr = '';
    if (node.children) {
        for (const child of node.children) {
            childrenStr += processNode(child, usedIcons);
        }
    }

    return `<${node.name}${props}>${childrenStr}</${node.name}>`;
  }
  return '';
}

files.forEach(file => {
    const filePath = path.join(htmlDir, file);
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    
    // Find body children except scripts
    const bodyContent = $('body');
    const usedIcons = new Set();
    
    let innerJSX = '';
    bodyContent.children().each((i, el) => {
        innerJSX += processNode(el, usedIcons);
    });

    // Create page component
    const pageName = file.replace('.html', '');
    const folderName = pageName.toLowerCase().replace(/_/g, '-');
    
    let imports = '';
    if (usedIcons.size > 0) {
        imports = `import { ${Array.from(usedIcons).join(', ')} } from 'lucide-react';\n\n`;
    }

    const compStr = `/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
${imports}

export default function ${pageName.replace(/[^a-zA-Z0-9]/g, '')}() {
  return (
    <div className="${bodyContent.attr('class') || ''}">
      ${innerJSX}
    </div>
  );
}
`;

    const outFolderPath = path.join(appDir, folderName);
    if (!fs.existsSync(outFolderPath)) {
        fs.mkdirSync(outFolderPath, { recursive: true });
    }
    fs.writeFileSync(path.join(outFolderPath, 'page.tsx'), compStr);
    console.log(`Generated ${folderName}/page.tsx`);
});
