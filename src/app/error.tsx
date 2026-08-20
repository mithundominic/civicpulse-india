"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-16 sm:px-6">
      <EmptyState icon={AlertTriangle} title="Something went wrong" description="Please try again, or head back to the homepage.">
        <div className="mt-2 flex gap-2">
          <Button onClick={reset} variant="outline" size="sm">Try Again</Button>
          <Button href="/" variant="ghost" size="sm">Back to Home</Button>
        </div>
      </EmptyState>
    </div>
  );
}
