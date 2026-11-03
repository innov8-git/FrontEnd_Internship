import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatBot } from '@/features/chatbot/components/ChatBot';
import { matchIntent, getChatbotResponse } from '@/features/chatbot/utils/intentMatcher';
import { CLOSING_MESSAGE, UNKNOWN_MESSAGE } from '@/features/chatbot/data/chatbotIntents';

describe('Chatbot Intent Matcher', () => {
  it('correctly matches registration queries', () => {
    const match = matchIntent('How can I register?');
    expect(match).not.toBeNull();
    expect(match.intent.id).toBe('USER_REGISTRATION');
  });

  it('correctly matches assessment details queries', () => {
    const match = matchIntent('How many questions in the assessment test?');
    expect(match).not.toBeNull();
    expect(match.intent.id).toBe('ASSESSMENT_DETAILS');
  });

  it('correctly matches mentor assignment queries', () => {
    const match = matchIntent('Who is my mentor and who reviews my code?');
    expect(match).not.toBeNull();
    expect(match.intent.id).toBe('MENTOR_SUPPORT');
  });

  it('correctly handles polite closing phrases', () => {
    const response = getChatbotResponse('thank you so much!');
    expect(response).toBe(CLOSING_MESSAGE);
  });

  it('returns fallback message for completely unrecognized queries', () => {
    const response = getChatbotResponse('xyzqwerty nonexistent query 12345');
    expect(response).toBe(UNKNOWN_MESSAGE);
  });
});

describe('ChatBot UI Component', () => {
  it('renders the floating launcher button and opens dialog on click', async () => {
    const user = userEvent.setup();
    render(<ChatBot />);

    const openButton = screen.getByRole('button', { name: /open chatbot assistant/i });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    expect(screen.getByRole('dialog', { name: /internship assistant chatbot/i })).toBeInTheDocument();
    expect(screen.getByText(/ALFRE Assistant/i)).toBeInTheDocument();
  });

  it('allows user to send a question and receive a predefined answer', async () => {
    const user = userEvent.setup();
    render(<ChatBot />);

    // Open chat
    await user.click(screen.getByRole('button', { name: /open chatbot assistant/i }));

    const input = screen.getByPlaceholderText(/ask a question/i);
    const sendButton = screen.getByRole('button', { name: /send message/i });

    await user.type(input, 'How can I register?');
    await user.click(sendButton);

    // Verify user message is displayed
    expect(screen.getByText('How can I register?')).toBeInTheDocument();

    // Verify bot response appears after typing indicator
    await waitFor(
      () => {
        expect(screen.getByText(/Welcome to our Internship Portal!/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
