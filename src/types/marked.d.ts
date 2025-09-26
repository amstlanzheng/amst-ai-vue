// Type definitions for marked usage
declare module 'marked' {
  interface MarkedOptions {
    breaks?: boolean;
    gfm?: boolean;
    renderer?: Renderer;
    highlight?(code: string, lang: string): string;
  }

  class Renderer {
    link(options: any): string;
  }

  function setOptions(options: MarkedOptions): void;
  function parse(src: string): string;

  const marked: {
    setOptions(options: MarkedOptions): void;
    parse(src: string): string;
    Renderer: typeof Renderer;
  };

  export { marked, Renderer };
  export default marked;
}