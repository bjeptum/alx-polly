import '@testing-library/jest-dom';

// Next.js 13+ app router: mock next/navigation redirects when imported in server actions
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Silence Radix UI portal warnings in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfills required by Next internals in Jest environment
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;


