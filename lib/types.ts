export type PollOption = { id: string; text: string; votes?: number };
export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string; // user id
  createdAt: string;
  // TODO: add additional fields (visibility, closesAt, etc.)
};


