import { useNavigate } from "react-router-dom";
import { Plus, Workflow, ArrowRight, Trash2, Clock } from "lucide-react";

import { useStore } from "@/store/useStore";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { nodeList } from "@/config/nodeRegistry";

function timeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function Dashboard() {
  const navigate = useNavigate();
  const pipelines = useStore((s) => s.pipelines);
  const createPipeline = useStore((s) => s.createPipeline);
  const deletePipeline = useStore((s) => s.deletePipeline);

  const list = Object.values(pipelines).sort((a, b) => b.updatedAt - a.updatedAt);

  const handleCreate = () => {
    const id = createPipeline(`Pipeline ${list.length + 1}`);
    navigate(`/pipeline/${id}`);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header
        right={
          <Button onClick={handleCreate} size="sm">
            <Plus /> New Pipeline
          </Button>
        }
      />

      <main className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto p-8">
        {/* Hero */}
        <section className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Build AI pipelines{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              visually
            </span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Drag, drop and connect nodes to compose agentic workflows — then validate
            them against the backend. {nodeList.length} node types available out of the box.
          </p>
        </section>

        {/* Pipeline grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Card
              key={p.id}
              className="group cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-violet-900/20"
              onClick={() => navigate(`/pipeline/${p.id}`)}
            >
              <CardHeader>
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-violet-300">
                    <Workflow className="size-4" />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePipeline(p.id);
                    }}
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    aria-label="Delete pipeline"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <CardTitle className="text-base">{p.name}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" /> {timeAgo(p.updatedAt)}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-violet-300">
                  Open <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          ))}

          {/* New pipeline tile */}
          <button
            onClick={handleCreate}
            className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
          >
            <Plus className="size-6" />
            <span className="text-sm font-medium">New pipeline</span>
          </button>
        </div>
      </main>
    </div>
  );
}
