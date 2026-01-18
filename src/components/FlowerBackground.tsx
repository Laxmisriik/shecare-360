const FlowerBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {[
        { size: "flower-small", style: { top: "-2%", left: "-2%" } },
        { size: "flower-medium", style: { top: "-2%", right: "-2%" } },
        { size: "flower-large", style: { bottom: "-2%", left: "-2%" } },
        { size: "flower-small", style: { bottom: "-2%", right: "-2%" } },
        { size: "flower-medium", style: { top: "40%", left: "5%" } },
        { size: "flower-large", style: { top: "30%", right: "5%" } },
        { size: "flower-small", style: { top: "10%", left: "50%", transform: "translateX(-50%)" } },
        { size: "flower-medium", style: { bottom: "15%", left: "50%", transform: "translateX(-50%)" } },
        { size: "flower-large", style: { top: "25%", left: "30%" } },
        { size: "flower-small", style: { top: "50%", left: "70%" } },
        { size: "flower-medium", style: { top: "75%", left: "20%" } },
      ].map((f, i) => (
        <div key={i} className={`flower ${f.size}`} style={f.style}>
          {[...Array(8)].map((_, p) => (
            <div key={p} className={`petal petal${p + 1}`} />
          ))}
          <div className="center" />
        </div>
      ))}
    </div>
  );
};

export default FlowerBackground;
