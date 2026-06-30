import { cn } from "@/lib/utils";

/** A draggable chip in the toolbar palette. Encodes the node type for onDrop. */
export function DraggableNode({ config }) {
  const { type, label, icon: Icon, color } = config;

  const onDragStart = (event) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ nodeType: type })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        "group flex cursor-grab select-none items-center gap-2 rounded-lg border px-3 py-2 transition-all hover:-translate-y-0.5 active:cursor-grabbing"
      )}
      style={{ borderColor: `${color}33`, background: "hsl(var(--card))" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${color}33`)}
    >
      <span
        className="flex size-5 items-center justify-center rounded"
        style={{ background: `${color}22`, color }}
      >
        <Icon className="size-3" />
      </span>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  );
}
