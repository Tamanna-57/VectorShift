# VectorShift Frontend Technical Assessment
**Submitted by:** Tamanna Khandelwal

---

## Setup Instructions

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Backend
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
# Runs on http://localhost:8000
```

---

## What I Built & Key Decisions

### Part 1 — Node Abstraction (`BaseNode.js`)
Created a **config-driven abstraction** where every node is defined by a plain config object:
```js
const CONFIG = {
  title: 'Filter', icon: '🔍', color: '#EF4444',
  handles: {
    inputs: [{ id: 'data', label: 'data' }],
    outputs: [{ id: 'pass', label: 'pass ✓', style: { top: '33%' } }, ...]
  }
}
```
Adding a new node = writing a config + one `useState`. Zero boilerplate duplication.

**5 new nodes built:** Filter, Memory, Prompt, Router, Transform — each representing a real agentic pipeline component.

### Part 2 — Styling
- Dark design system mirroring VectorShift's actual product aesthetic
- CSS custom classes (`vs-node`, `vs-input`, etc.) for consistency across all nodes
- Color-coded nodes by function type (green=input, amber=output, purple=LLM, etc.)
- Smooth hover/transition states, custom ReactFlow overrides for handles, edges, controls

### Part 3 — Text Node Logic (`textNode.js`)
Two key implementations:
1. **Auto-resize:** `useRef` on textarea + `scrollHeight` in `useEffect` expands both height and width dynamically
2. **Variable handles:** Regex `/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g` extracts valid JS identifiers → renders a `<Handle>` per variable → `useUpdateNodeInternals(id)` called after state update so ReactFlow redraws edges correctly

### Part 4 — Backend Integration
- Frontend: `fetch` POST to `/pipelines/parse` with `{ nodes, edges }` JSON
- Backend: **Kahn's Algorithm** (BFS topological sort) for DAG detection — O(V+E), handles disconnected graphs correctly
- Result shown in a custom toast modal (not `window.alert`) with pass/fail visual indicator
