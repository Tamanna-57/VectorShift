import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { Type } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Extract unique, valid JS identifiers from {{ var }} occurrences. */
function extractVariables(text) {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let m;
  while ((m = regex.exec(text)) !== null) vars.add(m[1]);
  return [...vars];
}

const HEADER_OFFSET = 92; // px down from node top where the first var handle sits
const ROW_GAP = 26;

export function TextNode({ id, data, selected }) {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [text, setText] = useState(data?.text ?? "{{ input }}");
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const variables = useMemo(() => extractVariables(text), [text]);

  const handleChange = useCallback(
    (e) => {
      setText(e.target.value);
      updateNodeField(id, "text", e.target.value);
    },
    [id, updateNodeField]
  );

  // Auto-resize the textarea height to fit content.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Node width grows with the longest line (clamped).
  const width = useMemo(() => {
    const maxLen = Math.max(0, ...text.split("\n").map((l) => l.length));
    return Math.max(232, Math.min(460, 150 + maxLen * 7));
  }, [text]);

  // ReactFlow must recompute handle geometry when variables change.
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, width, id, updateNodeInternals]);

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card shadow-lg transition-all",
        selected
          ? "border-primary shadow-violet-900/40 ring-1 ring-primary/40"
          : "border-border hover:border-primary/50"
      )}
      style={{ width }}
    >
      {/* Dynamic variable input handles */}
      {variables.map((name, i) => {
        const top = HEADER_OFFSET + i * ROW_GAP;
        return (
          <div key={name}>
            <Handle type="target" position={Position.Left} id={`${id}-var-${name}`} style={{ top }} />
            <span
              className="pointer-events-none absolute left-3 -translate-y-1/2 font-mono text-[9px] text-violet-300"
              style={{ top }}
            >
              {name}
            </span>
          </div>
        );
      })}

      {/* Header */}
      <div
        className="flex items-center gap-2 rounded-t-xl border-b border-border px-3 py-2"
        style={{ borderTop: "2px solid #3B82F6" }}
      >
        <span className="flex size-6 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
          <Type className="size-3.5" />
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-blue-400">Text</div>
          <div className="text-[9px] text-muted-foreground">Templated text + variables</div>
        </div>
        {variables.length > 0 && (
          <Badge className="ml-auto font-mono text-[9px]">
            {variables.length} var{variables.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3">
        <Label>Content</Label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder="Type text or use {{ variable }} syntax…"
          rows={3}
          className="nodrag flex w-full resize-none overflow-hidden rounded-md border border-input bg-background/60 px-3 py-2 font-mono text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
        {variables.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {variables.map((v) => (
              <Badge key={v} className="font-mono text-[9px]">{`{{${v}}}`}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Output */}
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] text-muted-foreground">
        output
      </span>
    </div>
  );
}
