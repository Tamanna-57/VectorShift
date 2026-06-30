import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";

/** Renders one labelled handle (input or output). */
function LabeledHandle({ nodeId, handle, index, total, type }) {
  const isInput = type === "target";
  const top = handle.top ?? `${((index + 1) / (total + 1)) * 100}%`;
  return (
    <>
      <Handle
        type={type}
        position={isInput ? Position.Left : Position.Right}
        id={`${nodeId}-${handle.id}`}
        style={{ top }}
      />
      {handle.label && (
        <span
          className={cn(
            "pointer-events-none absolute -translate-y-1/2 font-mono text-[9px] text-muted-foreground",
            isInput ? "left-3" : "right-3"
          )}
          style={{ top }}
        >
          {handle.label}
        </span>
      )}
    </>
  );
}

/**
 * Visual shell shared by every node. Pure presentation — accepts the node
 * config plus children for the body. Handles are derived from config.handles.
 */
export function BaseNode({ id, config, selected, children, style, className }) {
  const { title, subtitle, color, icon: Icon, handles = {} } = config;
  const { inputs = [], outputs = [] } = handles;

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card shadow-lg transition-all",
        selected
          ? "border-primary shadow-violet-900/40 ring-1 ring-primary/40"
          : "border-border hover:border-primary/50",
        className
      )}
      style={{ width: 232, ...style }}
    >
      {inputs.map((h, i) => (
        <LabeledHandle key={h.id} nodeId={id} handle={h} index={i} total={inputs.length} type="target" />
      ))}

      {/* Header */}
      <div
        className="flex items-center gap-2 rounded-t-xl border-b border-border px-3 py-2"
        style={{ borderTop: `2px solid ${color}` }}
      >
        <span
          className="flex size-6 items-center justify-center rounded-md"
          style={{ background: `${color}22`, color }}
        >
          {Icon ? <Icon className="size-3.5" /> : null}
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold" style={{ color }}>
            {title}
          </div>
          {subtitle && (
            <div className="text-[9px] text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-3">{children}</div>

      {outputs.map((h, i) => (
        <LabeledHandle key={h.id} nodeId={id} handle={h} index={i} total={outputs.length} type="source" />
      ))}
    </div>
  );
}
