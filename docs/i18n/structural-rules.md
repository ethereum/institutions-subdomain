# Structural Rules

## JSON Safety

- Never use Chinese quotation marks "" "" inside JSON string values — they break parsers
- Use 「」 (corner brackets) instead when quoting terms inline
- Preserve all interpolation variables exactly: `{amount}`, `{percent}`, `{name}`, etc.
- Preserve all HTML-like tags: `<link>`, etc.

## Sentence Length

Chinese naturally runs longer than English for the same content. This is fine. But avoid compounding multiple English sentences into a single Chinese mega-sentence. If the English has two sentences, the Chinese should generally have two sentences.

## Punctuation

- Use Chinese punctuation throughout: ，。、；：（）
- Exception: parenthetical English terms use English parentheses for readability: "总锁仓量 (TVL)"
- Use ── (em dash) sparingly; prefer ，or 。for clause separation
