import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Popup from './Popup';

describe('Popup', () => {
  it('renders the popup component', () => {
    render(<Popup />);
    expect(screen.getByText('MoneyForward Web Tools')).toBeInTheDocument();
  });

  it('displays transaction page button', () => {
    render(<Popup />);
    expect(screen.getByText('入出金ページを開く')).toBeInTheDocument();
    expect(screen.getByText('MoneyForward 入出金')).toBeInTheDocument();
  });

  it('opens transaction page and closes popup when button is clicked', async () => {
    const createSpy = vi.spyOn(chrome.tabs, 'create');
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {});

    render(<Popup />);
    const button = screen.getByText('MoneyForward 入出金');

    fireEvent.click(button);

    expect(createSpy).toHaveBeenCalledWith({
      url: 'https://moneyforward.com/cf',
    });
    await waitFor(() => {
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
