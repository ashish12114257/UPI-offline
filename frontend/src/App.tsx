import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useTheme } from './context/ThemeContext';

function ThemedToaster() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isDark ? '#0f172a' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0',
        },
      }}
    />
  );
}

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ThemedToaster />
    </ErrorBoundary>
  );
}

export default App;
