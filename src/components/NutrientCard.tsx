interface Props {
  name: string;
  current: number;
  target: number;
  icon: string;
}

export const NutrientCard = ({ name, current, target, icon }: Props) => {
  const percent = Math.min((current / target) * 100, 100);

  return (
    <div className="rounded-2xl p-4 bg-muted shadow-card">
      <div className="flex gap-2 items-center mb-2">
        <span>{icon}</span>
        <h3 className="font-semibold">{name}</h3>
      </div>
      <div className="h-2 bg-white rounded-full">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs mt-1">{current}/{target}</p>
    </div>
  );
};
