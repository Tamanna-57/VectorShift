import { useState, useRef, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
} from "reactflow";
import { shallow } from "zustand/shallow";
import "reactflow/dist/style.css";

import { useStore } from "@/store/useStore";
import { nodeTypes } from "@/config/nodeTypes";
import { nodeColors, nodeRegistry } from "@/config/nodeRegistry";

const GRID = 20;
const proOptions = { hideAttribution: true };

const selector = (s) => ({
  nodes: s.nodes,
  edges: s.edges,
  getNodeID: s.getNodeID,
  addNode: s.addNode,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

export function Canvas() {
  const wrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;
      const { nodeType } = JSON.parse(raw);
      if (!nodeType || !rfInstance) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const id = getNodeID(nodeType);
      // Seed default field values from the registry so the backend sees them.
      const defaults = Object.fromEntries(
        (nodeRegistry[nodeType]?.fields ?? [])
          .filter((f) => f.default !== undefined)
          .map((f) => [f.key, f.default])
      );
      addNode({ id, type: nodeType, position, data: { id, nodeType, ...defaults } });
    },
    [rfInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        proOptions={proOptions}
        snapGrid={[GRID, GRID]}
        snapToGrid
        connectionLineType="smoothstep"
        fitView
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "#7C3AED", strokeWidth: 2 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} color="#30363D" gap={GRID} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => nodeColors[n.type] || "#7C3AED"}
          maskColor="rgba(13,17,23,0.8)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
