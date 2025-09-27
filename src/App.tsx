import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

// Composant de test minimal
const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>🔧 Mode de récupération ENKI Reality</h1>
      <p>L'application se charge correctement.</p>
      <p>Nous pouvons maintenant restaurer progressivement les fonctionnalités.</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
        <h2>État du système :</h2>
        <ul>
          <li>✅ React fonctionne</li>
          <li>✅ Le DOM se charge</li>
          <li>✅ Les routes de base fonctionnent</li>
        </ul>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<TestComponent />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
