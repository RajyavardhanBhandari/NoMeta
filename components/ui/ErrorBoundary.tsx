'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './Button';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') console.error('NoMeta UI error:', error, info);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="nm-error-page" role="alert">
        <div className="nm-error-card">
          <span className="nm-eyebrow">Something went wrong</span>
          <h1>We couldn’t finish that step.</h1>
          <p>Your original image is still on your device. Nothing needs to be re-uploaded to recover.</p>
          <div className="nm-error-actions">
            <Button type="button" onClick={this.reset}>Try again</Button>
            <Button href="/clean" variant="secondary">Start over</Button>
          </div>
        </div>
      </main>
    );
  }
}
