import { AanSplitView } from "./AanSplitView";
import { AanWorkspace } from "./AanWorkspace";

export function AanPanel() {
  return (
    <>
      {/* Split Mode - Expanded artifact view */}
      <AanSplitView />

      {/* Workspace Mode - Full screen */}
      <AanWorkspace />
    </>
  );
}
