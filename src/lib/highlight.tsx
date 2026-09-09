import { Fragment, type ReactNode } from "react";

/* A deliberately small highlighter — enough for the few code samples on this
   page, not a general-purpose lexer. Tokens map to CSS variables so the theme
   stays in one place. */

const KEYWORDS = new Set([
  "import", "from", "export", "const", "let", "return", "async", "await",
  "if", "else", "throw", "new", "function", "true", "false", "null",
]);

type Tok = { t: string; c?: string };

function tokenizeJs(line: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const commentAt = line.indexOf("//");
  const codeEnd = commentAt === -1 ? line.length : commentAt;

  while (i < codeEnd) {
    const ch = line[i];

    // strings
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      while (j < codeEnd && line[j] !== ch) j += line[j] === "\\" ? 2 : 1;
      out.push({ t: line.slice(i, Math.min(j + 1, codeEnd)), c: "s" });
      i = j + 1;
      continue;
    }
    // identifiers / keywords
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < codeEnd && /[A-Za-z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const next = line[j];
      if (KEYWORDS.has(word)) out.push({ t: word, c: "k" });
      else if (next === "(") out.push({ t: word, c: "fn" });
      else if (word === "nexora" || word === "step" || word === "workflow" || word === "cron")
        out.push({ t: word, c: "id" });
      else out.push({ t: word });
      i = j;
      continue;
    }
    // numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < codeEnd && /[0-9.]/.test(line[j])) j++;
      out.push({ t: line.slice(i, j), c: "n" });
      i = j;
      continue;
    }
    // punctuation run
    let j = i;
    while (j < codeEnd && !/[A-Za-z0-9_$"'`\s]/.test(line[j])) j++;
    out.push({ t: line.slice(i, Math.max(j, i + 1)), c: "p" });
    i = Math.max(j, i + 1);
  }

  if (commentAt !== -1) out.push({ t: line.slice(commentAt), c: "c" });
  return out;
}

function tokenizeShell(line: string): Tok[] {
  if (line.startsWith("$ ")) {
    return [
      { t: "$ ", c: "p" },
      { t: line.slice(2), c: "fn" },
    ];
  }
  if (/^\s*(✓|→|✗)/.test(line)) {
    const m = line.match(/^(\s*)(✓|→|✗)(.*)$/)!;
    return [
      { t: m[1] },
      { t: m[2], c: m[2] === "✗" ? "retry" : "ok" },
      { t: m[3], c: "dim" },
    ];
  }
  return [{ t: line, c: "dim" }];
}

const CLASS: Record<string, string> = {
  k: "text-[var(--iris-soft)]",
  s: "text-[var(--state-ok)]",
  fn: "text-[var(--ink)]",
  id: "text-[var(--iris)]",
  n: "text-[var(--state-retry)]",
  c: "text-[var(--ink-faint)] italic",
  p: "text-[var(--ink-dim)]",
  dim: "text-[var(--ink-dim)]",
  ok: "text-[var(--state-ok)]",
  retry: "text-[var(--state-retry)]",
};

export function highlight(code: string, lang: "ts" | "shell" = "ts"): ReactNode {
  return code.split("\n").map((line, li) => {
    const toks = lang === "shell" ? tokenizeShell(line) : tokenizeJs(line);
    return (
      <Fragment key={li}>
        {li > 0 && "\n"}
        {toks.length === 0 ? (
          " "
        ) : (
          toks.map((tk, ti) =>
            tk.c ? (
              <span key={ti} className={CLASS[tk.c]}>
                {tk.t}
              </span>
            ) : (
              <Fragment key={ti}>{tk.t}</Fragment>
            ),
          )
        )}
      </Fragment>
    );
  });
}
