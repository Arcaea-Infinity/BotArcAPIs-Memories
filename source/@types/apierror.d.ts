declare class APIError extends Error {
  public status: number;
  public notify: string;
  constructor(status: number, notify: string);
}
