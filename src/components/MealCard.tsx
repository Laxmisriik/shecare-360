interface Props {
  title: string;
  time: string;
  calories: number;
  items: string[];
}

export const MealCard = ({ title, time, calories, items }: Props) => {
  return (
    <div className="rounded-2xl border p-4 shadow-card">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs opacity-70">{time}</p>
      <p className="mt-2">{calories} cal</p>

      <div className="flex flex-wrap gap-1 mt-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded-full text-xs bg-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
