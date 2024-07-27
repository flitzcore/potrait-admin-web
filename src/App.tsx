import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from "./pages/login-pages";
import { SignupForm } from "./pages/signup-pages";
import { HomePage } from './pages/home-page';
import { PortfolioDetail } from './pages/portfolio-detail'; // Import the new component
import { ServiceDetail } from './pages/service-detail';

function App() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/dashboard/portfolio/:id" element={<PortfolioDetail />} /> {/* New route */}
          <Route path="/dashboard/service/:id" element={<ServiceDetail />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
