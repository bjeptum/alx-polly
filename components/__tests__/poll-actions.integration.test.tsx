import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PollActions from '@/components/poll-actions';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => React.createElement('a', { href }, children),
}));

jest.mock('sonner', () => {
  const success = jest.fn();
  const error = jest.fn();
  return { toast: { success, error } };
});
import { toast } from 'sonner';

// Use the real module shape but spy on functions to simulate success/failure
// Mock the server actions module to avoid importing Next server internals
const serverMocks = {
  deletePoll: jest.fn(),
  togglePollStatus: jest.fn(),
};
jest.mock('@/lib/actions/polls', () => ({
  deletePoll: (...args: any[]) => serverMocks.deletePoll(...args),
  togglePollStatus: (...args: any[]) => serverMocks.togglePollStatus(...args),
}));

describe('PollActions - integration', () => {
  const pollId = 'poll-xyz';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delete flow: opens dialog, confirms, calls action, shows success', async () => {
    serverMocks.deletePoll.mockResolvedValueOnce(undefined as any);
    render(<PollActions pollId={pollId} isActive={true} />);

    // open menu
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByText('Delete'));

    // confirm delete
    await userEvent.click(await screen.findByText('Delete'));

    await waitFor(() => {
      expect(serverMocks.deletePoll).toHaveBeenCalledWith(pollId);
      expect(toast.success).toHaveBeenCalledWith('Poll deleted successfully');
    });
  });

  it('delete flow: action throws -> shows error toast and keeps dialog open state handled', async () => {
    serverMocks.deletePoll.mockRejectedValueOnce(new Error('cannot delete'));
    render(<PollActions pollId={pollId} isActive={true} />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByText('Delete'));
    await userEvent.click(await screen.findByText('Delete'));

    await waitFor(() => {
      expect(serverMocks.deletePoll).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('cannot delete');
    });
  });
});


