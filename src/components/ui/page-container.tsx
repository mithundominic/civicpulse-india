// The page-level outer wrapper — every route was hand-writing this div
// directly (a Rule 5 violation caught in review). One primitive, three width
// variants matching the three container widths actually used across the app.
import { cn } from "@/lib/utils";

const WIDTH_CLASSES = {
  default: "max-w-(--container-page)",
  narrow: "max-w-3xl",
  form: "max-w-2xl",
} as const;

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: keyof typeof WIDTH_CLASSES;
}

export function PageContainer({ width = "default", className, ...props }: PageContainerProps) {
  return (
    <div className={cn("mx-auto px-4 py-8 sm:px-6", WIDTH_CLASSES[width], className)} {...props} />
  );
}
