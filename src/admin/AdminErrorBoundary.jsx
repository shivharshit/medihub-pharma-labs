import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Portal Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Portal Initialization Notice</h1>
              <p className="text-xs text-slate-400 mt-2">
                {this.state.error?.message || 'An unexpected rendering issue occurred while loading the management console.'}
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Admin Console</span>
              </button>
              <a
                href="/"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return to Storefront</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
