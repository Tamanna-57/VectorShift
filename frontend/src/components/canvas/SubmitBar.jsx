import { useState } from "react";
import { shallow } from "zustand/shallow";
import { toast } from "sonner";
import { Play, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const selector = (s) => ({ nodes: s.nodes, edges: s.edges });

/** Rich toast body showing the backend's pipeline analysis. */
function AnalysisToast({ result }) {
  const ok = result.is_dag;
  const stats = [
    { label: "Nodes", value: result.num_nodes },
    { label: "Edges", value: result.num_edges },
    { label: "Valid DAG", value: ok ? "Yes" : "No" },
  ];
  return (
    <div className="w-[300px]">
      <div className="mb-2 flex items-center gap-2">
        {ok ? (
          <CheckCircle2 className="size-4 text-emerald-400" />
        ) : (
          <AlertTriangle className="size-4 text-red-400" />
        )}
        <span className="text-sm font-semibold text-foreground">Pipeline Analysis</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md bg-background/60 p-2 text-center">
            <div className="font-mono text-lg font-bold text-foreground">{s.value}</div>
            <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <p className={`mt-2 text-[11px] ${ok ? "text-emerald-400" : "text-red-400"}`}>
        {ok
          ? "Valid Directed Acyclic Graph — safe to execute."
          : "Pipeline contains a cycle — execution could loop forever."}
      </p>
    </div>
  );
}

export function SubmitBar() {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/pipelines/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      toast.custom(() => <AnalysisToast result={data} />, { duration: 6000 });
    } catch (err) {
      toast.error(`${err.message}`, {
        description: "Make sure the backend is running on port 8000.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-border bg-card/60 px-5 py-3">
      <div className="text-[11px] text-muted-foreground">
        {nodes.length} node{nodes.length !== 1 ? "s" : ""} ·{" "}
        {edges.length} edge{edges.length !== 1 ? "s" : ""}
      </div>
      <Button onClick={handleSubmit} disabled={loading || nodes.length === 0}>
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Analyzing…
          </>
        ) : (
          <>
            <Play /> Run Pipeline
          </>
        )}
      </Button>
    </div>
  );
}
