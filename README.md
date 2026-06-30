# VectorShift — Frontend Technical Assessment

**Submitted by:** Tamanna Khandelwal

A visual **AI pipeline builder** inspired by VectorShift. Drag nodes onto a
canvas, wire them together, and validate the graph against a FastAPI backend.
Built with **React + Vite, Tailwind CSS, shadcn/ui, React Router, ReactFlow,
and Zustand**.

> Live demo flow: **Dashboard** (`/`) → pick or create a pipeline →
> **Builder** (`/pipeline/:id`) → drag nodes, connect, **Run Pipeline**.

---

## Quick start

### Frontend
```bash
cd frontend
npm install
npm run dev          # Vite dev server → http://localhost:5173
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload   # → http://localhost:8000
```

Optionally point the frontend at a different API with `VITE_API_URL`.

---

## Tech & architecture choices

| Requirement              | Implementation |
|--------------------------|----------------|
| **Tailwind CSS**         | Full design-token system (`index.css` CSS vars + `tailwind.config.js`); zero inline-style nodes |
| **shadcn/ui**            | `components.json` + hand-authored primitives in `src/components/ui` (Button, Card, Badge, Input, Textarea, Select, Separator, Tooltip) |
| **Modular**              | Every node is a single config object in `src/config/nodeRegistry.js` |
| **Dynamic routing**      | `react-router-dom`: `/` dashboard and `/pipeline/:id` builder, graph loaded per `:id` |

---

## How the assessment maps to the code

### Part 1 — Node Abstraction
A **registry-driven** system. `src/config/nodeRegistry.js` is the single source
of truth: each node is a config object (icon, color, handles, declarative
`fields`). From it we *derive*:

- the **toolbar palette** (`NodePalette`, grouped by category),
- the ReactFlow **`nodeTypes`** map (`config/nodeTypes.js`),
- the **minimap** colors,
- the rendered node body — `makeFieldNode(config)` reads `config.fields` and
  renders the matching shadcn control.

**Adding a node = appending one object.** No new files, no copy-paste.
Five new nodes ship to demonstrate it: **Filter, Memory, Prompt, Router,
Transform** (alongside Input/Output/LLM/Text).

### Part 2 — Styling
Dark, VectorShift-inspired design system driven entirely by Tailwind tokens +
shadcn components. Color-coded node categories, gradient brand accents, animated
edges, themed ReactFlow controls/minimap/handles, hover/selected states.

### Part 3 — Text Node Logic (`components/nodes/TextNode.jsx`)
1. **Auto-resize:** textarea grows by `scrollHeight`; node width scales with the
   longest line (clamped 232–460px).
2. **Variable handles:** regex `/\{\{\s*([a-zA-Z_$][\w$]*)\s*\}\}/g` extracts
   valid JS identifiers from `{{ var }}`, renders a left `<Handle>` per variable,
   and calls `useUpdateNodeInternals(id)` so ReactFlow redraws edges correctly.

### Part 4 — Backend Integration
- **Frontend** (`SubmitBar.jsx`): `POST /pipelines/parse` with `{ nodes, edges }`;
  result shown in a rich **sonner** toast (nodes / edges / is-DAG + verdict).
- **Backend** (`main.py`): `/pipelines/parse` returns
  `{num_nodes, num_edges, is_dag}`. DAG detection uses **Kahn's algorithm**
  (BFS topological sort, O(V+E)), handling disconnected graphs and unknown-node
  edges safely.

---

## Project structure
```
frontend/src/
  config/        nodeRegistry.js  ← single source of truth · nodeTypes.js
  components/
    ui/          shadcn primitives
    nodes/       BaseNode · FieldNode (generic) · TextNode (custom)
    canvas/      Canvas · NodePalette · DraggableNode · SubmitBar
    Header.jsx
  pages/         Dashboard (/) · PipelineBuilder (/pipeline/:id)
  store/         useStore.js  (zustand: pipelines + active graph)
backend/
  main.py        FastAPI · Kahn's-algorithm DAG check
```
