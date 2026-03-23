export {};

declare global {
  interface Window {
    ym?: (id: number, ...args: any[]) => void;
  }
}
