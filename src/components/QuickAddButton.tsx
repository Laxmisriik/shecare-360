import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
}

export const QuickAddButton = ({ icon: Icon, label }: Props) => {
  return (
    <button className="rounded-2xl p-4 bg-muted shadow-card hover:scale-105 transition">
      <Icon className="mx-auto mb-2" />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
};
