import { Component, type ReactNode } from "react";

const RELOAD_FLAG = "ibai_chunk_reload_attempted";

function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /dynamically imported module|Failed to fetch|Loading chunk|Importing a module script failed/i.test(message);
}

export default class ChunkErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (isChunkLoadError(error) && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, "1");
      window.location.reload();
      return;
    }
    sessionStorage.removeItem(RELOAD_FLAG);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#faf9f6] px-6 text-center">
          <p className="text-[15px] text-[#363b42]">Something went wrong loading this page.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-pill-primary"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
