export type PollOption = { id: string; text: string; votes?: number };
export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string; // user id
  createdAt: string;
  // TODO: add additional fields (visibility, closesAt, etc.)
};

// Supabase-backed shapes used across pages
export type PollOptionRow = {
  id: string;
  label: string;
  position: number;
};

export type PollWithOptions = {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  poll_options?: PollOptionRow[];
};


