import { act } from "@testing-library/react";

// Telegram's «Log In With Telegram» library (window.Telegram.Login) as tests
// see it: auth() records what it was asked and waits for the test to answer
// as the popup would.
interface Result {
  id_token?: string;
  user?: Record<string, unknown>;
  error?: string;
}

type Callback = (result: Result) => void;

// A JWT's shape - the backend checks the real one; only the payload is read.
export const fakeIdToken = (claims: Record<string, unknown> = { id: 777, name: "Айбек" }) => {
  const utf8 = String.fromCharCode(...new TextEncoder().encode(JSON.stringify(claims)));

  return `header.${btoa(utf8)}.signature`;
};

export const installTelegramLogin = () => {
  const state = { options: [] as unknown[], callback: null as Callback | null };

  const target = window as unknown as { Telegram?: Record<string, unknown> };
  target.Telegram = {
    ...target.Telegram,
    Login: {
      auth: (options: unknown, callback: Callback) => {
        state.options.push(options);
        state.callback = callback;
      }
    }
  };

  // The popup's answer.
  const answer = (result: Result) => act(() => state.callback?.(result));

  return {
    state,
    signIn: (claims: Record<string, unknown> = { id: 777, name: "Айбек" }) =>
      answer({ id_token: fakeIdToken(claims), user: claims }),
    answer
  };
};

export const removeTelegramLogin = () => {
  const target = window as unknown as { Telegram?: Record<string, unknown> };

  if (target.Telegram) delete target.Telegram["Login"];
};
