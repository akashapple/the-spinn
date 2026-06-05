import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import Channel from './pages/Channel';
import AdminUpload from './pages/admin/Upload';
import AdminCreateAccount from './pages/admin/CreateAccount';
import TeamUpload from './pages/TeamUpload';
import ArtistSubmission from './pages/ArtistSubmission';
import AdminReview from './pages/admin/AdminReview';
import ArtistProfile from './pages/artist/Profile';
import Join from './pages/Join';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/channel/:id" element={<Channel />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/admin/create-account" element={<AdminCreateAccount />} />
        <Route path="/team-upload" element={<TeamUpload />} />
        <Route path="/submit" element={<ArtistSubmission />} />
        <Route path="/admin/reviews" element={<AdminReview />} />
        <Route path="/artist/profile" element={<ArtistProfile />} />
        <Route path="/join" element={<Join />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App