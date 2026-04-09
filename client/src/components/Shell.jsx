import Navbar from "./Navbar";

export default function Shell({ children }) {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
