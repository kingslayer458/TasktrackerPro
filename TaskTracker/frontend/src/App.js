import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ScaleLoader } from 'react-spinners';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import Preloader from './components/layout/Preloader';
import PageTransition from './components/layout/PageTransition';
import ScrollToTop from './components/layout/ScrollToTop';
import NotificationProvider from './components/layout/NotificationSystem';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import SearchTasks from './pages/SearchTasks';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// AnimatedRoutes component to handle route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <PrivateRoute><Dashboard /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Register />
          </PageTransition>
        } />
        <Route path="/projects/new" element={
          <PageTransition>
            <PrivateRoute><CreateProject /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/projects/:id" element={
          <PageTransition>
            <PrivateRoute><ProjectDetails /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <PrivateRoute><Profile /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="/search" element={
          <PageTransition>
            <PrivateRoute><SearchTasks /></PrivateRoute>
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition>
            <NotFound />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
    
    // Simulate loading time for preloader
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Short delay before showing app content for smooth transition
      setTimeout(() => {
        setAppReady(true);
      }, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
        <AnimatePresence>
          {loading && <Preloader />}
        </AnimatePresence>
        
        {!loading && !appReady && (
          <div className="app-loading-transition d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <ScaleLoader color={"#0d6efd"} height={50} width={5} radius={2} margin={2} />
          </div>
        )}
        
        {appReady && (
          <Router>
            <div className="App">
              <Navbar />
              <main className="container">
                <AnimatedRoutes />
              </main>
              <Footer />
              <ScrollToTop />
            </div>
          </Router>
        )}
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
