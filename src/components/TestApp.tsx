import React from 'react';

const TestApp = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Application Test
        </h1>
        <p className="text-muted-foreground">
          Si vous voyez ceci, l'application fonctionne correctement.
        </p>
      </div>
    </div>
  );
};

export default TestApp;