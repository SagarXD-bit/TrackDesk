export function AuroraBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="aurora-blob w-[600px] h-[600px] -top-48 -left-48"
        style={{ background: "radial-gradient(circle, rgba(185,255,102,0.08) 0%, transparent 70%)" }} />
      <div className="aurora-blob w-[500px] h-[500px] top-1/2 -right-48"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", animationDelay: "-5s" }} />
      <div className="aurora-blob w-[400px] h-[400px] -bottom-32 left-1/3"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)", animationDelay: "-10s" }} />
      {/* Vignette */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.4) 100%)" }} />
    </div>
  );
}
