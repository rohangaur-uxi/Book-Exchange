import React from 'react';
import { Auth } from './components/Auth';
import { BookListing } from './components/BookListing';
import { BookSearch } from './components/BookSearch';
import { Navigation } from './components/Navigation';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { AuthProvider } from './context/AuthContext';

const useRouter = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return { currentPath, navigate };
};

const App = () => {
  const { currentPath, navigate } = useRouter();

  const renderContent = () => {
    if (currentPath.startsWith('/reset-password/')) {
      const token = currentPath.split('/reset-password/')[1];
      return <ResetPassword onNavigate={navigate} token={token} />;
    }

    switch (currentPath) {
      case '/auth':
        return <Auth onNavigate={navigate} />;
      case '/forgot-password':
        return <ForgotPassword onNavigate={navigate} />;
      case '/books/add':
        return <BookListing />;
      case '/books/search':
        return <BookSearch />;
      default:
        return <Auth onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPath={currentPath} onNavigate={navigate} />
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;