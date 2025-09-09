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

const mockActions = {
  deletePoll: jest.fn(),
  togglePollStatus: jest.fn(),
};

jest.mock('@/lib/actions/polls', () => ({
  deletePoll: (...args: any[]) => mockActions.deletePoll(...args),
  togglePollStatus: (...args: any[]) => mockActions.togglePollStatus(...args),
}));

describe('PollActions - unit', () => {
  const pollId = 'poll-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders menu trigger button', () => {
    render(<PollActions pollId={pollId} isActive={true} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });

  it('has Edit link pointing to edit page', async () => {
    render(<PollActions pollId={pollId} isActive={true} />);
    await userEvent.click(screen.getByRole('button'));
    const edit = await screen.findByText('Edit');
    expect(edit.closest('a')).toHaveAttribute('href', `/polls/${pollId}/edit`);
  });

  it('calls togglePollStatus and shows success toast (deactivate when active)', async () => {
    mockActions.togglePollStatus.mockResolvedValueOnce(undefined);
    render(<PollActions pollId={pollId} isActive={true} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByText('Deactivate'));

    await waitFor(() => {
      expect(mockActions.togglePollStatus).toHaveBeenCalledWith(pollId);
      expect(toast.success).toHaveBeenCalledWith('Poll deactivated successfully');
    });
  });

  it('calls togglePollStatus and shows success toast (activate when inactive)', async () => {
    mockActions.togglePollStatus.mockResolvedValueOnce(undefined);
    render(<PollActions pollId={pollId} isActive={false} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByText('Activate'));

    await waitFor(() => {
      expect(mockActions.togglePollStatus).toHaveBeenCalledWith(pollId);
      expect(toast.success).toHaveBeenCalledWith('Poll activated successfully');
    });
  });

  it('shows error toast when togglePollStatus fails', async () => {
    mockActions.togglePollStatus.mockRejectedValueOnce(new Error('boom'));
    render(<PollActions pollId={pollId} isActive={true} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByText('Deactivate'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('boom');
    });
  });

  it('opens delete dialog and cancels without calling deletePoll', async () => {
    render(<PollActions pollId={pollId} isActive={true} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByText('Delete'));

    const cancel = await screen.findByText('Cancel');
    await userEvent.click(cancel);

    await waitFor(() => {
      expect(mockActions.deletePoll).not.toHaveBeenCalled();
    });
  });
});


