import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PeriodTracker = () => {
  const { toast } = useToast();

  const [startDate, setStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!startDate) {
      toast({
        title: "Missing data",
        description: "Please select start date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8001/api/period/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // temporary static user
          start_date: startDate,
          cycle_length: cycleLength,
          period_length: periodLength,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Period cycle logged successfully 🌸",
        });
        setStartDate("");
      } else {
        throw new Error(data.error);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to log period data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <main className="container mx-auto px-6 py-8 max-w-xl">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Period Tracker</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Cycle Length (days)</label>
              <input
                type="number"
                value={cycleLength}
                onChange={(e) => setCycleLength(+e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Period Length (days)</label>
              <input
                type="number"
                value={periodLength}
                onChange={(e) => setPeriodLength(+e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Cycle"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PeriodTracker;
