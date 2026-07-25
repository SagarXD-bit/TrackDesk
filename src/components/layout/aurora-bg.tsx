export function AuroraBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="aurora-blob aurora-blob-1 w-[600px] h-[600px] -top-48 -left-48" />
      <div className="aurora-blob aurora-blob-2 w-[500px] h-[500px] top-1/2 -right-48" style={{ animationDelay: "-5s" }} />
      <div className="aurora-blob aurora-blob-3 w-[400px] h-[400px] -bottom-32 left-1/3" style={{ animationDelay: "-10s" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, var(--bg) 100%)" }} />
    </div>
  );
}
