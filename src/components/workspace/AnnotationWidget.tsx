import { Textarea } from "@/components/ui/textarea";

interface AnnotationWidgetProps {
  config: Record<string, unknown>;
  onConfigChange: (config: Record<string, unknown>) => void;
}

export function AnnotationWidget({ config, onConfigChange }: AnnotationWidgetProps) {
  const text = (config.text as string) || "";

  return (
    <Textarea
      value={text}
      onChange={(e) => onConfigChange({ ...config, text: e.target.value })}
      placeholder="Write your notes here..."
      className="h-full resize-none border-0 bg-transparent focus-visible:ring-0 text-sm"
      maxLength={500}
    />
  );
}
