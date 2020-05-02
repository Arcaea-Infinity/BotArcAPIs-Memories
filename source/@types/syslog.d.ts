declare class SystemLog {
  public static startLogging: () => void;
  public static stop: () => void;
  public static v(tag: string, ...message: Array<any>): () => void;
  public static i(tag: string, ...message: Array<any>): () => void;
  public static w(tag: string, ...message: Array<any>): () => void;
  public static e(tag: string, ...message: Array<any>): () => void;
  public static f(tag: string, ...message: Array<any>): () => void;
  public static d(...args: Array<any>): () => void;
  private static log(level: number, tag: string, ...message: Array<any>): () => void;
  private static _console(level: number, ...args: Array<any>): () => void;
}
