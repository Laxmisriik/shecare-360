import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { User } from "@supabase/supabase-js";

const Welcome = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
  }, [navigate]);

  const setMode = async (mode: "period" | "pregnancy") => {
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ tracking_mode: mode })
      .eq("id", user.id);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card className="p-6 text-center shadow-soft">
          <h2 className="text-xl font-bold mb-2">Period Tracking</h2>
          <p className="text-muted-foreground mb-4">
            Track menstrual cycles, ovulation, and symptoms.
          </p>
          <Button
            className="w-full bg-primary"
            onClick={() => setMode("period")}
          >
            Continue
          </Button>
        </Card>

        <Card className="p-6 text-center shadow-soft">
          <h2 className="text-xl font-bold mb-2">Pregnancy Tracking</h2>
          <p className="text-muted-foreground mb-4">
            Track pregnancy progress and weekly insights.
          </p>
          <Button
            className="w-full bg-secondary"
            onClick={() => setMode("pregnancy")}
          >
            Continue
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
