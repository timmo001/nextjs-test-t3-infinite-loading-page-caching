"use client";
import { useEffect } from "react";

import { Button } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-96 flex-col items-center justify-start">
      <section className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h2 className="text-center text-2xl font-semibold">
          Something went wrong
        </h2>
        <Button
          className="text-base font-semibold"
          size="lg"
          variant="default"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </section>
    </main>
  );
}
