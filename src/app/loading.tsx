import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      className="flex w-full max-w-screen-xl flex-col bg-background p-4 text-current"
      role="main"
    >
      <Skeleton className="mt-4 h-[calc(100vh-16rem)] w-full" />
    </main>
  );
}
