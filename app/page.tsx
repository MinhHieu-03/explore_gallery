//page.tsx
import ExploreClient from "../components/ExploreClient";

export const metadata = {
  title: "Explore Gallery",
  description: "Explore photos — search, filter, sort and infinite scroll",
};

export default function ExplorePage() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <ExploreClient />
      </div>
    </main>
  );
}
