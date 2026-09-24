import { Library } from "@/components/Library/Library";
import { SiteHeader } from "@/components/ui/SiteHeader";

export default function HomePage() {
  return (
    <main className="min-h-full">
      <SiteHeader subtitle="Your PDFs, read like a real book." />
      <Library />
    </main>
  );
}
