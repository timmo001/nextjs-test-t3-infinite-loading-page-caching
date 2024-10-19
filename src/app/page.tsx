import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Link href="/collection">
        <Button variant="default">View collection</Button>
      </Link>
    </main>
  );
}
