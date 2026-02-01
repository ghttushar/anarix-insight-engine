/**
 * CreativeFeatures - Master Component
 * 
 * This component bundles all 10 creative UI features.
 * Add this to your App.tsx to enable all features.
 * 
 * To disable specific features, comment out their usage below.
 */

import { CommandPalette } from "./CommandPalette";
import { FloatingActionIsland } from "./FloatingActionIsland";
import { AmbientBackground } from "./AmbientBackground";
import { KeyboardNavigationProvider } from "./KeyboardNavigation";
import { DataStoryMode } from "./DataStoryMode";

interface CreativeFeaturesProps {
  children: React.ReactNode;
  /**
   * Enable/disable specific features
   */
  features?: {
    commandPalette?: boolean;
    floatingIsland?: boolean;
    ambientBackground?: boolean;
    keyboardNavigation?: boolean;
    dataStory?: boolean;
  };
}

export function CreativeFeatures({ 
  children,
  features = {
    commandPalette: true,
    floatingIsland: true,
    ambientBackground: true,
    keyboardNavigation: true,
    dataStory: true,
  }
}: CreativeFeaturesProps) {
  let content = <>{children}</>;

  // Wrap with DataStoryMode
  if (features.dataStory) {
    content = <DataStoryMode>{content}</DataStoryMode>;
  }

  // Wrap with KeyboardNavigation
  if (features.keyboardNavigation) {
    content = <KeyboardNavigationProvider>{content}</KeyboardNavigationProvider>;
  }

  // Wrap with CommandPalette
  if (features.commandPalette) {
    content = <CommandPalette>{content}</CommandPalette>;
  }

  return (
    <>
      {/* Ambient background (very subtle) */}
      {features.ambientBackground && <AmbientBackground intensity="medium" />}
      
      {/* Main content with all providers */}
      {content}
      
      {/* Floating action island */}
      {features.floatingIsland && <FloatingActionIsland />}
    </>
  );
}
