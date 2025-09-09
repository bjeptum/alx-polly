"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { submitVote } from "@/lib/actions/polls";

type Option = { id: string; label: string };

export default function VotePanel({ pollId, options }: { pollId: string; options: Option[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [thanks, setThanks] = useState(false);

  const fingerprint = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const key = "alx-polly-fingerprint";
      let fp = localStorage.getItem(key);
      if (!fp) {
        fp = crypto.randomUUID();
        localStorage.setItem(key, fp);
      }
      return fp;
    } catch {
      return "";
    }
  }, []);

  const onSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("pollId", pollId);
      form.append("optionId", selected);
      if (fingerprint) form.append("fingerprint", fingerprint);
      await submitVote(form);
      // submitVote will redirect to results, but set a local thank-you just in case
      setThanks(true);
    } catch {
      // fall back to manual navigation on any error not thrown as redirect
      router.push(`/polls/${pollId}/results`);
    } finally {
      setSubmitting(false);
    }
  };

  if (thanks) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">Thank you for voting! Redirecting to results...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3 py-4">
        <div className="grid gap-2">
          {options.map((opt) => (
            <Button
              key={opt.id}
              variant={selected === opt.id ? "default" : "outline"}
              onClick={() => setSelected(opt.id)}
              className="justify-start"
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <Button disabled={!selected || submitting} onClick={onSubmit}>
          {submitting ? "Submitting..." : "Submit vote"}
        </Button>
      </CardContent>
    </Card>
  );
}


