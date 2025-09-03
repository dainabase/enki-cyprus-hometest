import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SearchErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface SearchErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class SearchErrorBoundary extends React.Component<
  SearchErrorBoundaryProps,
  SearchErrorBoundaryState
> {
  state: SearchErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): SearchErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ SearchErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Erreur de recherche
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              Une erreur est survenue lors de la recherche. Veuillez réessayer.
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={this.handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Recharger la page
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer">
                  Détails de l'erreur (dev)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}