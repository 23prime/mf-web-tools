import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Popup from './Popup';

describe('Popup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the popup component', () => {
    render(<Popup />);
    expect(screen.getByText('MoneyForward Web Tools')).toBeInTheDocument();
  });

  it('displays counter value', () => {
    render(<Popup />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments counter when Increment button is clicked', async () => {
    render(<Popup />);
    const incrementButton = screen.getByText('Increment');

    fireEvent.click(incrementButton);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ count: 1 });
  });

  it('resets counter when Reset button is clicked', async () => {
    render(<Popup />);
    const incrementButton = screen.getByText('Increment');
    const resetButton = screen.getByText('Reset');

    // Increment first
    fireEvent.click(incrementButton);
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    // Then reset
    fireEvent.click(resetButton);
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ count: 0 });
  });

  it('loads counter from storage on mount', async () => {
    const mockGet = vi.fn((_keys, callback) => {
      callback({ count: 5 });
    });
    chrome.storage.local.get =
      mockGet as unknown as typeof chrome.storage.local.get;

    render(<Popup />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    expect(mockGet).toHaveBeenCalledWith(['count'], expect.any(Function));
  });
});
