"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pollSchema, PollInput } from "@/lib/validators/poll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PollForm() {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const form = useForm<PollInput>({ resolver: zodResolver(pollSchema), defaultValues: { question: "", options }});

  function addOption() { setOptions((o) => [...o, ""]); }
  function removeOption(i: number) { setOptions((o) => o.filter((_, idx) => idx !== i)); }

  // TODO: submit to /api/polls
  function onSubmit(values: PollInput) { console.log(values); }

  return (
    <Card>
      <CardHeader><CardTitle>New Poll</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input id="question" placeholder="What should we have for lunch?" />
        </div>

        <div className="space-y-2">
          <Label>Options</Label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input placeholder={`Option ${i + 1}`} />
                {options.length > 2 && (
                  <Button type="button" variant="outline" onClick={() => removeOption(i)}>Remove</Button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" onClick={addOption}>Add option</Button>
        </div>

        <Button onClick={form.handleSubmit(onSubmit)}>Create poll</Button>
      </CardContent>
    </Card>
  );
}


