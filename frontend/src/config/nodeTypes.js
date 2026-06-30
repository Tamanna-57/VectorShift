/**
 * Builds the ReactFlow `nodeTypes` map dynamically from the registry.
 * Custom nodes use their `render` component; everything else is generated
 * by the config-driven <FieldNode> factory. Adding a node to the registry
 * automatically wires it here — no edits needed.
 */
import { nodeRegistry } from "./nodeRegistry";
import { makeFieldNode } from "@/components/nodes/FieldNode";

export const nodeTypes = Object.fromEntries(
  Object.values(nodeRegistry).map((config) => [
    config.type,
    config.render ?? makeFieldNode(config),
  ])
);
