import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";

/**
 * Global pipeline store. The builder canvas reads `nodes`/`edges` and the
 * dashboard reads `pipelines` (metadata for dynamic routing). Each pipeline's
 * graph is persisted into `pipelines[id].graph` when you leave the builder.
 */
export const useStore = create((set, get) => ({
  // ── Multiple pipelines (drives /pipeline/:id dynamic routing) ──
  pipelines: {
    "demo-rag": {
      id: "demo-rag",
      name: "RAG Assistant",
      description: "Retrieval-augmented chat pipeline",
      updatedAt: Date.now(),
      graph: { nodes: [], edges: [] },
    },
    "demo-classifier": {
      id: "demo-classifier",
      name: "Support Classifier",
      description: "Routes tickets to the right team",
      updatedAt: Date.now(),
      graph: { nodes: [], edges: [] },
    },
  },

  createPipeline: (name) => {
    const id = `pipe-${Math.random().toString(36).slice(2, 8)}`;
    set((s) => ({
      pipelines: {
        ...s.pipelines,
        [id]: {
          id,
          name: name || "Untitled pipeline",
          description: "New pipeline",
          updatedAt: Date.now(),
          graph: { nodes: [], edges: [] },
        },
      },
    }));
    return id;
  },

  deletePipeline: (id) =>
    set((s) => {
      const next = { ...s.pipelines };
      delete next[id];
      return { pipelines: next };
    }),

  // ── Active canvas graph ──
  activeId: null,
  nodes: [],
  edges: [],
  nodeIDs: {},

  loadPipeline: (id) => {
    const p = get().pipelines[id];
    set({
      activeId: id,
      nodes: p?.graph?.nodes ?? [],
      edges: p?.graph?.edges ?? [],
    });
  },

  savePipeline: () => {
    const { activeId, nodes, edges, pipelines } = get();
    if (!activeId || !pipelines[activeId]) return;
    set({
      pipelines: {
        ...pipelines,
        [activeId]: {
          ...pipelines[activeId],
          graph: { nodes, edges },
          updatedAt: Date.now(),
        },
      },
    });
  },

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    newIDs[type] = (newIDs[type] ?? 0) + 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, height: 18, width: 18, color: "#7C3AED" },
        },
        get().edges
      ),
    }),

  updateNodeField: (nodeId, fieldName, fieldValue) =>
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
          : node
      ),
    }),
}));
