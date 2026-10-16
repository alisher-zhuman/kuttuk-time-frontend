import { Component, type ErrorInfo, type ReactNode } from "react";

import { Fallback } from "./fallback";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  override render() {
    if (this.state.hasError) {
      return <Fallback onReload={() => window.location.reload()} />;
    }

    return this.props.children;
  }
}
