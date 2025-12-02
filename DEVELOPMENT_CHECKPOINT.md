# 🔮 Tarot App Development Checkpoint
Last Updated: 2025-12-02

## ✅ Critical Configurations (DO NOT CHANGE)

### 1. Gemini API Configuration (`src/utils/gemini.js`)
- **Package**: Must use `@google/genai` (NOT `@google/generative-ai`).
  ```javascript
  import { GoogleGenAI } from "@google/genai";
  const ai = new GoogleGenAI({ apiKey });
  ```
- **Model**: Explicitly set to `gemini-2.5-flash`.
  ```javascript
  model: "gemini-2.5-flash"
  ```
- **Method**: Use `ai.models.generateContent`.

### 2. UI Rendering Rules (`src/pages/Result.jsx`)
- **Header Parsing**: Separator lines (e.g., `---`) must be ignored.
  ```javascript
  if (line.trim().match(/^[-=*]{3,}$/)) return;
  ```
- **Bold Text**: Use `<b>` tag instead of `<strong>`.
  ```javascript
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  ```
- **Formatting**: Add line break before "해석:".
  ```javascript
  .replace(/<b>해석:<\/b>/g, '<br/><b>해석:</b>')
  ```

### 3. Data Structure (`src/data/card.json`)
- **Fields**: `image_prompt` removed. `meaning_upright` and `meaning_reversed` added.
- **Usage**: AI prompt uses these pre-defined meanings for consistency.

## 📝 Notes
- If `500 Internal Server Error` occurs for `gemini.js`, it's likely a Vite cache issue or syntax error. Restart dev server.
- The "Crystal Ball" loading animation is a key UI feature.
