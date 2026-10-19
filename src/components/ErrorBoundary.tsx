import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Sanjeevani Setu:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('sanjeevani_reminders');
      localStorage.removeItem('sanjeevani_text_scale');
      localStorage.removeItem('sanjeevani_activity_logs');
      localStorage.removeItem('sanjeevani_vitals');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0E2423',
          color: '#F1E8D6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '540px',
            backgroundColor: 'rgba(22, 57, 56, 0.9)',
            border: '2px solid #F4B183',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌸</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F4B183', marginBottom: '12px' }}>
              Sanjeevani Setu Care Bridge
            </h1>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#F1E8D6', marginBottom: '24px' }}>
              We noticed an unexpected display issue. Your elder's routines and settings are safe.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: 'transparent',
                  color: '#F4B183',
                  border: '1px solid #F4B183',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Reset to Default Routines
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
