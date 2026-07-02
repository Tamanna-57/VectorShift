# Architecture — Node Abstraction (Part 1)

This document explains the design of the node system: the problem it solves,
the architecture, and *why* each decision was made.

---

## The problem

The starter repo shipped four node files (`inputNode.js`, `outputNode.js`,
`llmNode.js`, `textNode.js`). Each duplicated the same code — the wrapper card,
the header, the `<Handle>` positioning logic, and the styling. Creating a new
node meant copy-pasting a file and tweaking it.

This does not scale:

- **N nodes = N near-identical files.** Adding a node means writing ~50 lines of
  mostly-boilerplate.
- **Restyling is O(N).** Changing how *all* nodes look means editing every file.
- **Drift.** The toolbar, canvas, and minimap each maintain their own list of
  node types, which can silently fall out of sync.

The assessment's task: build an abstraction so that **adding a node and
restyling all nodes both become cheap.**

---

## The solution: a data-driven node registry

We separate the **data** (what a node *is*) from the **rendering** (how any node
is *drawn*).

```
config/nodeRegistry.js         ← single source of truth (data)
        │   { customInput: {...}, llm: {...}, filter: {...}, ... }
        │
        ├──► config/nodeTypes.js ──► maps each entry to a component ──► ReactFlow
        │        (custom render  ||  generic FieldNode factory)
        │
        ├──► components/canvas/NodePalette.jsx ──► drag toolbar (grouped by category)
        │
        └──► components/canvas/Canvas.jsx ──► minimap colors + field defaults
```

Everything the app knows about nodes is *derived* from one object.

### File responsibilities

| File | Role | Grows per new node? |
|------|------|---------------------|
| `config/nodeRegistry.js` | Every node described as a config object | **+1 object (~12 lines)** |
| `config/nodeTypes.js` | Auto-wires each entry into ReactFlow's `nodeTypes` | no |
| `components/nodes/BaseNode.jsx` | Shared visual shell: card, header, handle layout, styling | no |
| `components/nodes/FieldNode.jsx` | Generic renderer — turns a `fields` schema into a node body | no |
| `components/nodes/TextNode.jsx` | Custom node (opt-out) for bespoke logic | no |

**Result:** 9 node types exist today with **zero per-node files.**

---

## The two abstraction layers

### 1. `BaseNode` — the visual abstraction (shared UI)

Every node's chrome lives here *once*: the card, the colored header with icon,
and the **handle-positioning math** that evenly spaces input/output handles down
the sides. Change this one file → all nodes restyle instantly. This is what the
assessment means by "apply styles across nodes in the future."

### 2. `FieldNode` — the behavioral abstraction (a factory)

`makeFieldNode(config)` is a **factory** that returns a React component. It reads
`config.fields` — a declarative schema — and renders the correct control for
each field (`input` / `textarea` / `select`), wiring each to the Zustand store
automatically. A node's *body* is described as **data**, not written as code.

```js
// A node body, described declaratively:
fields: [
  { key: "model", label: "Model", type: "select",
    options: ["claude-opus-4-8", "gpt-4o"], default: "claude-opus-4-8" },
  { key: "temperature", label: "Temperature", type: "text", default: "0.7" },
]
```

### Escape hatch for special nodes

A registry entry may set `render: SomeComponent`. `nodeTypes.js` honors it:

```js
config.render ?? makeFieldNode(config)   // custom component if provided, else generic
```

The **Text node** uses this because it needs bespoke behavior (auto-resize +
dynamic `{{variable}}` handles). This proves the abstraction is *flexible, not
rigid*: most nodes are pure config, but any node can opt into full custom code
without touching the engine.

---

## Design principles applied

- **Single source of truth** — one object defines every node; the toolbar,
  canvas, and minimap can never disagree because they all derive from it.
- **Open/Closed Principle** — the system is *open* to new nodes (add data) but
  *closed* for modification (you never edit `BaseNode`/`FieldNode`).
- **Declarative over imperative** — describing a form as `fields: [...]` is
  safer and shorter than hand-writing JSX + state + handlers per node.
- **Sub-linear scaling** — old way: N nodes = N boilerplate files. This way:
  N nodes = N small config objects + a fixed engine.

---

## Adding a node (the whole process)

Append one object to `nodeRegistry.js`:

```js
scraper: {
  type: "scraper", label: "Scraper", category: "Data",
  icon: Globe, color: "#14B8A6", subtitle: "Fetch a URL",
  handles: {
    inputs:  [{ id: "url",  label: "url" }],
    outputs: [{ id: "html", label: "html" }],
  },
  fields: [
    { key: "selector", label: "CSS Selector", type: "text", mono: true },
    { key: "format", label: "Format", type: "select",
      options: ["HTML", "Text", "Markdown"] },
  ],
},
```

That single object instantly produces: a draggable toolbar chip (under "Data"),
a rendered node with two handles and two working, state-bound fields, and a
minimap color. **~12 lines vs. a ~50-line copied file.**

---

## The five demonstration nodes

Beyond the original four (Input, Output, LLM, Text), five new nodes exercise
*different* shapes to prove the abstraction handles variety:

| Node | What it demonstrates |
|------|----------------------|
| **Filter** | Multiple outputs (pass / fail) at custom vertical positions |
| **Router** | Three outputs — dynamic handle spacing |
| **Memory** | Mixed select + text fields |
| **Prompt** | A `textarea` field type + role dropdown |
| **Transform** | Monospace field + operation dropdown |
