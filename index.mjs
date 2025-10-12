// import type { MarkdownRenderer } from "vitepress";
import syncFetch from "sync-fetch";

/**
 * the main function
 * @param {object} state
 * @param {number} startLine
 * @param {number} endLine
 * @param {boolean} silent
 * @returns
 */
function code_fetch(state, startLine, endLine, silent) {
  // Only process fenced code blocks
  const pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  const firstLine = state.src.slice(pos, max);

  // Check for fenced code block and extract language
  const fenceMatch = firstLine.match(/^```(\w*)/);
  if (!fenceMatch) {
    return false;
  }
  const lang = fenceMatch[1] || "";

  // Find the end of the code block
  let nextLine = startLine + 1;
  let foundEnd = false;
  while (nextLine <= endLine) {
    const linePos = state.bMarks[nextLine] + state.tShift[nextLine];
    const lineMax = state.eMarks[nextLine];
    const lineText = state.src.slice(linePos, lineMax);
    if (lineText.startsWith("```") && lineText.trim() === "```") {
      foundEnd = true;
      break;
    }
    nextLine++;
  }
  if (!foundEnd) {
    return false;
  }

  // Get code block content
  /**
   * lines of code
   * @type string[]
   */
  const codeLines = [];
  for (let i = startLine + 1; i < nextLine; i++) {
    const linePos = state.bMarks[i] + state.tShift[i];
    const lineMax = state.eMarks[i];
    codeLines.push(state.src.slice(linePos, lineMax));
  }
  const codeContent = codeLines.join("\n");

  // Match fetch comment in code block
  const fetchMatch = codeContent.match(/\[!fetch\("([^"]+)"\)\]/);
  if (!fetchMatch) {
    return false;
  }
  const url = fetchMatch[1];

  // Fetch code from URL (sync)
  let code = "";
  try {
    if (url) code = syncFetch(url).text();
  } catch (e) {
    code = `// Could not fetch: ${url}\nException: ${e}`;
  }

  // Render code block
  const token = state.push("fetched_code_block", "fence", 0);
  token.content = code;
  token.info = lang;
  token.map = [startLine, nextLine + 1];
  state.line = nextLine + 1;
  return true;
}

/**
 * markdown-it plugin for code block from url.
 *
 * Note: the code will be fetched at build time (not runtime),
 * so the URL must be accessible from the build environment.
 *
 * Usage example:
 * ```ts
 * // [!fetch("https://github.com/markdown-it/markdown-it-sup/raw/refs/heads/master/index.mjs")]
 * ```
 * @param {vitepress.MarkdownRenderer} md
 */
export default function (md) {
  md.block.ruler.before("fence", "codefetch", code_fetch);
  md.renderer.rules.fetched_code_block = (tokens, idx, options, env, slf) => {
    // Use markdown-it's default fence renderer for proper highlighting and line numbers
    const token = tokens[idx];
    return md.renderer.rules.fence
      ? md.renderer.rules.fence(tokens, idx, options, env, slf)
      : `<pre><code class="language-${token?.info || ""}">${md.utils.escapeHtml(token?.content || "")}</code></pre>`;
  };
}
