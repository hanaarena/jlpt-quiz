import Contents from "./components/contents";
import Headers from "./components/headers";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Headers />
      <Contents />
    </main>
  );
}
