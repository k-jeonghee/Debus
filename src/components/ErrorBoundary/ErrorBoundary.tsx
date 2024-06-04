import { Component, ComponentType, ErrorInfo, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  Fallback: ComponentType<{ error: Error; onReset: () => void }>;
  onReset?: VoidFunction;
};

type State = {
  error: Error | null;
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // fallback 렌더링 후 호출: 에러 로깅
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  //호출 시점에 this 정보를 알 수 없음
  resetError = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const { Fallback } = this.props;
      return <Fallback error={this.state.error} onReset={this.resetError} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
