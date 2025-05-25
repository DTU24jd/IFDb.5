import FavoritesGrid from "@/components/FavoritesGrid";

export default function FavoritesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Omiljene serije</h1>
      <FavoritesGrid />
    </div>
  );
}
