"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VotePanel() {
  const [selected, setSelected] = useState<string | null>(null);
  // TODO: options from server
  const options = ["Option A", "Option B", "Option C"];

  return (
    <Card>
      <CardContent className="space-y-3 py-4">
        <div className="grid gap-2">
          {options.map((opt) => (
            <Button
              key={opt}
              variant={selected === opt ? "default" : "outline"}
              onClick={() => setSelected(opt)}
              className="justify-start"
            >
              {opt}
            </Button>
          ))}
        </div>
        <Button disabled={!selected}>Submit vote</Button>
      </CardContent>
    </Card>
  );
}


