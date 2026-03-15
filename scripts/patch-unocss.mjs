// Patches @unocss/vite to handle Vite 7+ where the vite:css plugin
// no longer has a `transform` property directly on the plugin object.
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve('node_modules/@unocss/vite/dist/index.mjs');

try {
  let code = readFileSync(filePath, 'utf-8');

  const original = `if (!cssPlugins.get(dir) || !postcss) return css;
\t\tconst cssPlugin = cssPlugins.get(dir);
\t\tconst result = await ("handler" in cssPlugin.transform ? cssPlugin.transform.handler : cssPlugin.transform).call(ctx$1, css, id);`;

  const patched = `if (!cssPlugins.get(dir) || !postcss) return css;
\t\tconst cssPlugin = cssPlugins.get(dir);
\t\tif (!cssPlugin.transform) return css;
\t\tconst result = await ("handler" in cssPlugin.transform ? cssPlugin.transform.handler : cssPlugin.transform).call(ctx$1, css, id);`;

  if (code.includes('if (!cssPlugin.transform) return css;')) {
    console.log('[patch-unocss] Already patched, skipping.');
    process.exit(0);
  }

  if (!code.includes(original)) {
    // Try a more flexible match
    const regex = /(if \(!cssPlugins\.get\(dir\) \|\| !postcss\) return css;\s*const cssPlugin = cssPlugins\.get\(dir\);\s*)(const result = await \("handler" in cssPlugin\.transform)/;
    if (regex.test(code)) {
      code = code.replace(regex, '$1if (!cssPlugin.transform) return css;\n\t\t$2');
    } else {
      console.warn('[patch-unocss] Could not find code to patch. UnoCSS may have been updated.');
      process.exit(0);
    }
  } else {
    code = code.replace(original, patched);
  }

  writeFileSync(filePath, code);
  console.log('[patch-unocss] Successfully patched @unocss/vite for Vite 7 compatibility.');
} catch (err) {
  console.warn('[patch-unocss] Patch skipped:', err.message);
}
