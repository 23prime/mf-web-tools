import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Popup from './Popup';

describe('Popup', () => {
  beforeEach(() => {
    // Mock chrome.tabs.create as a spy
    globalThis.chrome = {
      ...globalThis.chrome,
      tabs: {
        ...globalThis.chrome?.tabs,
        create: vi.fn(),
      },
    } as typeof chrome;

    vi.clearAllMocks();
  });

  it('renders the popup component', () => {
    render(<Popup />);
    expect(screen.getByText('MoneyForward Web Tools')).toBeInTheDocument();
  });

  it('displays transaction page button', () => {
    render(<Popup />);
    expect(screen.getByText('入出金ページを開く')).toBeInTheDocument();
    expect(screen.getByText('MoneyForward 入出金')).toBeInTheDocument();
  });

  it('opens transaction page when button is clicked', () => {
    render(<Popup />);
    const button = screen.getByText('MoneyForward 入出金');

    fireEvent.click(button);

    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: 'https://moneyforward.com/cf',
    });
  });
});
