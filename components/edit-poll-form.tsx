"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePoll } from "@/lib/actions/polls";
import { useRouter } from "next/navigation";

interface EditPollFormProps {
  pollId: string;
  initialQuestion: string;
  initialOptions: string[];
}

export default function EditPollForm({ pollId, initialQuestion, initialOptions }: EditPollFormProps) {
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [question, setQuestion] = useState(initialQuestion);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function addOption() { 
    setOptions((o) => [...o, ""]); 
  }
  
  function removeOption(i: number) { 
    setOptions((o) => o.filter((_, idx) => idx !== i)); 
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      fd.set("question", question);
      options.forEach((o) => fd.append("options[]", o));
      
      // submit via server action
      await updatePoll(pollId, fd);
      // If successful, redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Failed to update poll:", error);
      setError(error instanceof Error ? error.message : "Failed to update poll");
      setIsSubmitting(false);
    }
  }

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Poll</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="What should we have for lunch?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    required
                  />
                  {options.length > 2 && (
                    <Button type="button" variant="outline" onClick={() => removeOption(i)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="secondary" onClick={addOption}>
              Add option
            </Button>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update poll"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
