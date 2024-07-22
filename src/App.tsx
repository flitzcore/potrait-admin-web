import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from "./pages/login-pages";
import { SignupForm } from "./pages/signup-pages";
function App() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          {/* <Route path="/home" element={<Home />} /> */}
        </Routes>
      </Router>
    </main>

  );
}

export default App;
