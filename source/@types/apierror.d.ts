declare class APIError extends Error {
  constructor(status: number, notify: string);
}
