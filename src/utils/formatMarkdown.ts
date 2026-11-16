import React from 'react';

const LINE_BREAK_TOKEN = ' [[SIAJAR_BR]] ';

function convertLatexBody(expr: string): string {
  let out = expr;

  // Handle \frac{a}{b} -> (a / b) or a/b
  for (let i = 0; i < 3; i++) {
    out = out.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '$1 / $2');
  }

  // Handle \text{...}, \mathrm{...}, \mathit{...}, \textit{...} first (so nested \mathbf{34 \text{ JP}} becomes \mathbf{34 JP})
  for (let i = 0; i < 2; i++) {
    out = out.replace(/\\(?:text|mathrm|textrm|mathit|textit|operatorname)\s*\{([^{}]*)\}/g, '$1');
  }

  // Handle \mathbf{...} and \textbf{...} -> **...**
  out = out.replace(/\\(?:mathbf|textbf)\s*\{([^{}]*)\}/g, '**$1**');

  // Remove \left and \right sizing prefixes
  out = out.replace(/\\(?:left|right)\s*([()[\]|{}])/g, '$1');
  out = out.replace(/\\(?:left|right)\./g, '');

  // Replace common LaTeX math operators with official Unicode symbols
  const replacements: [RegExp, string][] = [
    [/\\times\b/g, '×'],
    [/\\cdot\b/g, '·'],
    [/\\div\b/g, '÷'],
    [/\\pm\b/g, '±'],
    [/\\approx\b/g, '≈'],
    [/\\neq\b/g, '≠'],
    [/\\leq?\b/g, '≤'],
    [/\\geq?\b/g, '≥'],
    [/\\rightarrow\b|\\to\b/g, '→'],
    [/\\leftarrow\b/g, '←'],
    [/\\leftrightarrow\b/g, '↔'],
    [/\\Rightarrow\b/g, '⇒'],
    [/\\degree\b|\\circ\b/g, '°'],
    [/\\pi\b/g, 'π'],
    [/\\alpha\b/g, 'α'],
    [/\\beta\b/g, 'β'],
    [/\\gamma\b/g, 'γ'],
    [/\\theta\b/g, 'θ'],
    [/\\lambda\b/g, 'λ'],
    [/\\Sigma\b/g, 'Σ'],
    [/\\Delta\b/g, 'Δ'],
    [/\\%/g, '%'],
    [/\\,/g, ' '],
    [/\\;/g, ' '],
    [/\\:/g, ' '],
    [/\\!/g, ''],
    [/\\quad\b/g, '  '],
    [/\\qquad\b/g, '    '],
  ];

  for (const [pattern, symbol] of replacements) {
    out = out.replace(pattern, symbol);
  }

  // Strip remaining stray curly braces from simple grouping like {2}
  out = out.replace(/\{([^{}]+)\}/g, '$1');

  // Clean up spacing around **bold** and operators
  out = out.replace(/\s{2,}/g, ' ').trim();
  return out;
}

/**
 * Normalizes raw LLM Markdown:
 * 1. Converts LaTeX math ($...$ and $$...$$) to clean Indonesian text with official symbols (×, ÷, =, −, ≤, ≥).
 * 2. Replaces raw HTML tags like <br>, <br/>, <b>, <strong>, <i>, <em>, <ul>, <li>, <p> cleanly so no raw HTML leaks.
 */
export function cleanMarkdownForDisplay(
  raw: string,
  options: { preserveBreakToken?: boolean } = {}
): string {
  if (!raw) return '';
  let text = raw;

  // 1. Convert block math $$...$$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_m, inner: string) => {
    return `\n${convertLatexBody(inner)}\n`;
  });

  // 2. Convert inline math $...$ (avoid matching currency like Rp 50.000 or $5 if followed by space/digit only; match math with commands or operators or letters)
  text = text.replace(/\$([^$\n]+?)\$/g, (full, inner: string) => {
    // Skip if it looks purely like a US dollar currency amount e.g. $100 or $12.50
    if (/^\d+(?:[.,]\d+)?$/.test(inner.trim())) {
      return full;
    }
    return convertLatexBody(inner);
  });

  // 3. Also clean any stray LaTeX commands that appeared without $ delimiters
  text = text
    .replace(/\\(?:mathbf|textbf)\s*\{([^{}]*)\}/g, '**$1**')
    .replace(/\\(?:text|mathrm|textrm)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\times\b/g, '×')
    .replace(/\\div\b/g, '÷')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\leq?\b/g, '≤')
    .replace(/\\geq?\b/g, '≥')
    .replace(/\\neq\b/g, '≠');

  // 4. Handle common inline HTML tags emitted by LLMs
  text = text.replace(/<\s*(?:b|strong)\s*>([\s\S]*?)<\s*\/\s*(?:b|strong)\s*>/gi, '**$1**');
  text = text.replace(/<\s*(?:i|em)\s*>([\s\S]*?)<\s*\/\s*(?:i|em)\s*>/gi, '*$1*');
  text = text.replace(/<\s*u\s*>([\s\S]*?)<\s*\/\s*u\s*>/gi, '$1');
  text = text.replace(/<\s*li\s*>([\s\S]*?)<\s*\/\s*li\s*>/gi, (_m, item: string) => {
    return `${LINE_BREAK_TOKEN}• ${item.trim()}`;
  });
  text = text.replace(/<\s*\/?\s*(?:ul|ol|p|div|span)\b[^>]*>/gi, ' ');

  // 5. Handle <br>, <br/>, <br /> cleanly
  const lines = text.split('\n').map((line) => {
    const isTableRow = line.trim().startsWith('|');
    if (isTableRow) {
      return line.replace(/<\s*br\s*\/?\s*>/gi, options.preserveBreakToken ? LINE_BREAK_TOKEN : '; ');
    }
    return line.replace(/<\s*br\s*\/?\s*>/gi, '\n');
  });
  text = lines.join('\n');

  // Collapse excessive spaces inside lines without breaking indentation or markdown line breaks
  return text.replace(/[ \t]+\n/g, '\n');
}

export function cleanMarkdownForPlainText(raw: string): string {
  return cleanMarkdownForDisplay(raw, { preserveBreakToken: false }).replace(
    /\s*\[\[SIAJAR_BR\]\]\s*/g,
    '\n'
  );
}

export function renderChildrenWithLineBreaks(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      const token = '[[SIAJAR_BR]]';
      if (!child.includes(token)) return child;
      const parts = child.split(token);
      return parts.map((part, idx) =>
        React.createElement(
          React.Fragment,
          { key: idx },
          part.trim(),
          idx < parts.length - 1 ? React.createElement('br') : null
        )
      );
    }
    if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.props?.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: renderChildrenWithLineBreaks(child.props.children),
      });
    }
    return child;
  });
}
