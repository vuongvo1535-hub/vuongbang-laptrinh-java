import BookCard from "./SachCard";

export default function BookList({ sachs }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {sachs.map((sach) => (
        <BookCard key={sach.id} sach={sach} />
      ))}
    </div>
  );
}
