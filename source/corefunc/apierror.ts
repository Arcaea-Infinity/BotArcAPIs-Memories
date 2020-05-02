class APIError extends Error {

  private status: number;
  private notify: string;

  /**
   * make an error with status code
   * @param {number} status
   * @param {string} notify
   */
  constructor(status: number, notify: string) {

    super(`status: ${status}, notify: ${notify}`);

    this.name = 'APIError';
    this.status = status;
    this.notify = notify;

  }

}

export default { APIError };
