import { useAan } from "./AanContext";
import { AanCopilotPanel } from "./AanCopilotPanel";
import { AanSplitView } from "./AanSplitView";
import { AanWorkspace } from "./AanWorkspace";

export function AanPanel() {
  const { mode } = useAan();

  return (
    <>
      {/* Copilot Mode - Lightweight panel */}
      <AanCopilotPanel />

      {/* Split Mode - Expanded artifact view */}
      <AanSplitView />

      {/* Workspace Mode - Full screen */}
      <AanWorkspace />
    </>
  );
}
