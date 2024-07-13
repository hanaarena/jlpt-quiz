"use client";
import Contents from "./components/contents";
// import Headers from "./components/headers";
import Sidebar from "./components/sidebar";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-white">
      {/* <Headers /> */}
      <Sidebar />
      <Contents />
    </main>
  );
}
