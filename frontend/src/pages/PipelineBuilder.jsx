import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/store/useStore";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { NodePalette } from "@/components/canvas/NodePalette";
import { Canvas } from "@/components/canvas/Canvas";
import { SubmitBar } from "@/components/canvas/SubmitBar";

/**
 * Dynamic route /pipeline/:id — loads the matching pipeline graph into the
 * canvas, and saves it back to the store on unmount.
 */
export function PipelineBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pipeline = useStore((s) => s.pipelines[id]);
  const loadPipeline = useStore((s) => s.loadPipeline);
  const savePipeline = useStore((s) => s.savePipeline);

  useEffect(() => {
    if (!pipeline) {
      navigate("/", { replace: true });
      return;
    }
    loadPipeline(id);
    return () => savePipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!pipeline) return null;

  const handleSave = () => {
    savePipeline();
    toast.success("Pipeline saved");
  };

  return (
    <div className="flex h-screen flex-col">
      <Header
        right={
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-foreground sm:block">
              {pipeline.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save /> Save
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft /> Pipelines
              </Link>
            </Button>
          </div>
        }
      />

      <ReactFlowProvider>
        <div className="flex min-h-0 flex-1">
          <NodePalette />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">
              <Canvas />
            </div>
            <SubmitBar />
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
