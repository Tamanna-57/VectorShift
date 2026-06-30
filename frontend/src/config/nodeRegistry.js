/**
 * nodeRegistry.js — single source of truth for every node in the app.
 *
 * Adding a new node = appending ONE entry here. The toolbar, the ReactFlow
 * `nodeTypes` map, the minimap colors, and the rendered node UI are all
 * derived from this object — no per-node boilerplate files required.
 *
 * Each entry:
 *   type     unique key (also the ReactFlow node type)
 *   label    toolbar display name
 *   category grouping shown in the toolbar
 *   icon     lucide-react icon component
 *   color    brand accent (hex) for header / handles / minimap
 *   subtitle short description under the title
 *   handles  { inputs: [...], outputs: [...] } — each { id, label, top? }
 *   fields   declarative form schema rendered by <FieldNode>
 *              { key, label, type: 'text'|'textarea'|'select', options?, placeholder?, default? }
 *   render   (optional) custom component for nodes that need bespoke logic
 *            (e.g. the Text node). When present, `fields` is ignored.
 */

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BrainCircuit,
  Type,
  Filter,
  Database,
  PenLine,
  Split,
  Wand2,
} from "lucide-react";
import { TextNode } from "@/components/nodes/TextNode";

export const nodeRegistry = {
  customInput: {
    type: "customInput",
    label: "Input",
    category: "I/O",
    icon: ArrowUpFromLine,
    color: "#10B981",
    subtitle: "Pipeline entry point",
    handles: { outputs: [{ id: "value", label: "value" }] },
    fields: [
      { key: "inputName", label: "Name", type: "text", default: "input_1" },
      {
        key: "inputType",
        label: "Type",
        type: "select",
        options: ["Text", "File", "Image", "Number"],
        default: "Text",
      },
    ],
  },

  customOutput: {
    type: "customOutput",
    label: "Output",
    category: "I/O",
    icon: ArrowDownToLine,
    color: "#F59E0B",
    subtitle: "Pipeline result",
    handles: { inputs: [{ id: "value", label: "value" }] },
    fields: [
      { key: "outputName", label: "Name", type: "text", default: "output_1" },
      {
        key: "outputType",
        label: "Type",
        type: "select",
        options: ["Text", "File", "Image", "JSON"],
        default: "Text",
      },
    ],
  },

  llm: {
    type: "llm",
    label: "LLM",
    category: "AI",
    icon: BrainCircuit,
    color: "#7C3AED",
    subtitle: "Large language model",
    handles: {
      inputs: [
        { id: "system", label: "system", top: "35%" },
        { id: "prompt", label: "prompt", top: "65%" },
      ],
      outputs: [{ id: "response", label: "response" }],
    },
    fields: [
      {
        key: "model",
        label: "Model",
        type: "select",
        options: ["claude-opus-4-8", "claude-sonnet-4-6", "gpt-4o", "gemini-1.5-pro"],
        default: "claude-opus-4-8",
      },
      {
        key: "temperature",
        label: "Temperature",
        type: "select",
        options: ["0", "0.3", "0.7", "1.0"],
        default: "0.7",
      },
    ],
  },

  text: {
    type: "text",
    label: "Text",
    category: "AI",
    icon: Type,
    color: "#3B82F6",
    subtitle: "Templated text + variables",
    // Custom renderer (Part 3: auto-resize + {{variable}} handles).
    render: TextNode,
  },

  // ── Five new nodes demonstrating the abstraction ──────────────────
  filter: {
    type: "filter",
    label: "Filter",
    category: "Logic",
    icon: Filter,
    color: "#EF4444",
    subtitle: "Conditional routing",
    handles: {
      inputs: [{ id: "data", label: "data" }],
      outputs: [
        { id: "pass", label: "pass", top: "35%" },
        { id: "fail", label: "fail", top: "65%" },
      ],
    },
    fields: [
      {
        key: "operator",
        label: "Operator",
        type: "select",
        options: ["contains", "equals", "starts_with", "ends_with", "regex"],
        default: "contains",
      },
      { key: "value", label: "Value", type: "text", placeholder: "Match value…", mono: true },
    ],
  },

  memory: {
    type: "memory",
    label: "Memory",
    category: "Data",
    icon: Database,
    color: "#06B6D4",
    subtitle: "Conversation buffer",
    handles: {
      inputs: [{ id: "write", label: "write" }],
      outputs: [{ id: "context", label: "context" }],
    },
    fields: [
      {
        key: "strategy",
        label: "Strategy",
        type: "select",
        options: ["Buffer", "Summary", "Window", "Vector"],
        default: "Buffer",
      },
      { key: "window", label: "Window size", type: "text", default: "10", mono: true },
    ],
  },

  prompt: {
    type: "prompt",
    label: "Prompt",
    category: "AI",
    icon: PenLine,
    color: "#EC4899",
    subtitle: "Reusable prompt template",
    handles: {
      inputs: [{ id: "context", label: "context" }],
      outputs: [{ id: "prompt", label: "prompt" }],
    },
    fields: [
      {
        key: "role",
        label: "Role",
        type: "select",
        options: ["system", "user", "assistant"],
        default: "system",
      },
      {
        key: "template",
        label: "Template",
        type: "textarea",
        placeholder: "You are a helpful assistant…",
      },
    ],
  },

  router: {
    type: "router",
    label: "Router",
    category: "Logic",
    icon: Split,
    color: "#84CC16",
    subtitle: "Semantic branching",
    handles: {
      inputs: [{ id: "query", label: "query" }],
      outputs: [
        { id: "route_a", label: "route A", top: "30%" },
        { id: "route_b", label: "route B", top: "50%" },
        { id: "route_c", label: "route C", top: "70%" },
      ],
    },
    fields: [
      {
        key: "mode",
        label: "Mode",
        type: "select",
        options: ["semantic", "keyword", "llm"],
        default: "semantic",
      },
    ],
  },

  transform: {
    type: "transform",
    label: "Transform",
    category: "Data",
    icon: Wand2,
    color: "#F97316",
    subtitle: "Map / reshape data",
    handles: {
      inputs: [{ id: "in", label: "in" }],
      outputs: [{ id: "out", label: "out" }],
    },
    fields: [
      {
        key: "operation",
        label: "Operation",
        type: "select",
        options: ["JSON parse", "To uppercase", "Extract field", "Split", "Custom JS"],
        default: "JSON parse",
      },
      { key: "expression", label: "Expression", type: "text", placeholder: "$.data.items[0]", mono: true },
    ],
  },
};

/** Ordered list — handy for the toolbar. */
export const nodeList = Object.values(nodeRegistry);

/** type -> accent color (used by the minimap). */
export const nodeColors = Object.fromEntries(
  nodeList.map((n) => [n.type, n.color])
);
