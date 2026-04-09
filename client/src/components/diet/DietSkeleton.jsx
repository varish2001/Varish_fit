export default function DietSkeleton() {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="glass h-36" />
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass h-80" />
        <div className="glass h-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass h-48" />
        <div className="glass h-48" />
        <div className="glass h-48" />
        <div className="glass h-48" />
      </div>
    </section>
  );
}
