/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface Window {
  gtag: (
    command: 'config' | 'event',
    targetId: string,
    config?: Record<string, any>
  ) => void;
}
