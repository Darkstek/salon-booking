import React from "react";

interface State {
  hasError: boolean;
  error: string;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", backgroundColor: "#000" }}>
          <h1>Chyba:</h1>
          <p>{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
