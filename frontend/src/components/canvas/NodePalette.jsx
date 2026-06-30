import { nodeList } from "@/config/nodeRegistry";
import { DraggableNode } from "./DraggableNode";

/** Left sidebar palette, grouped by node category. */
export function NodePalette() {
  const categories = nodeList.reduce((acc, n) => {
    (acc[n.category] ??= []).push(n);
    return acc;
  }, {});

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-5 overflow-y-auto border-r border-border bg-card/40 p-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Nodes</h2>
        <p className="text-[11px] text-muted-foreground">Drag onto the canvas</p>
      </div>
      {Object.entries(categories).map(([category, nodes]) => (
        <div key={category} className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {category}
          </div>
          <div className="flex flex-col gap-2">
            {nodes.map((config) => (
              <DraggableNode key={config.type} config={config} />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
