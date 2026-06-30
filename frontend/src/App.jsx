import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dashboard } from "@/pages/Dashboard";
import { PipelineBuilder } from "@/pages/PipelineBuilder";

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pipeline/:id" element={<PipelineBuilder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "hsl(222 33% 11%)",
            border: "1px solid hsl(217 19% 22%)",
            color: "hsl(213 31% 91%)",
          },
        }}
      />
    </TooltipProvider>
  );
}
