export function AuroraBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="aurora-blob aurora-1 w-[400px] h-[400px] -top-32 -left-32" />
      <div className="aurora-blob aurora-2 w-[350px] h-[350px] top-1/3 -right-24" style={{ animationDelay: "-8s" }} />
      <div className="aurora-blob aurora-3 w-[300px] h-[300px] -bottom-20 left-1/4" style={{ animationDelay: "-16s" }} />
      {/* Subtle vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, var(--bg) 100%)" }} />
    </div>
  );
}
