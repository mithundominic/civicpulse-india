import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-16 sm:px-6">
      <EmptyState icon={SearchX} title="Page not found" description="The page you're looking for doesn't exist or may have moved.">
        <Button href="/" variant="outline" size="sm" className="mt-2">
          Back to Home
        </Button>
      </EmptyState>
    </div>
  );
}
