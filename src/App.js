import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './pages/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// New iTerra Wellness pages
import Home from './pages/Home';
import WellnessIntake from './pages/WellnessIntake';
import WellnessIntakeResult from './pages/WellnessIntakeResult';
import SpecializedIntake from './pages/SpecializedIntake';
import ServiceDetail from './pages/ServiceDetail';
import HomeEssentials from './pages/HomeEssentials';
import LeadershipWisdom from './pages/LeadershipWisdom';
import BackOffice from './pages/BackOffice';

// Legacy pages (from PR #1)
import Associate from './components/Associate';
import Admin from './components/Admin';
import Redirect from './components/Redirect';

import './App.css';
import './index.css';

// Create a wrapper component that uses useLocation inside the Router context
function AppContent() {
  const location = useLocation();
  
  // Determine if we should use the layout (for new pages only)
  const useLayout = !['/associate', '/admin', '/go/'].some(path => location.pathname.startsWith(path));
  
  const routes = (
    <Routes>
      {/* Main iTerra Wellness Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/wellness-intake" element={<WellnessIntake />} />
      <Route path="/wellness-intake-result" element={<WellnessIntakeResult />} />
      <Route path="/specialized-intake" element={<SpecializedIntake />} />
      <Route path="/service-detail" element={<ServiceDetail />} />
      <Route path="/home-essentials" element={<HomeEssentials />} />
      <Route path="/leadership-wisdom" element={<LeadershipWisdom />} />
      <Route path="/back-office" element={<BackOffice />} />
      
      {/* Legacy routes (from PR #1) */}
      <Route path="/associate" element={<Associate />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/go/:slug" element={<Redirect />} />
      
      {/* Old capitalized routes for compatibility */}
      <Route path="/Home" element={<Home />} />
      <Route path="/WellnessIntake" element={<WellnessIntake />} />
      <Route path="/WellnessIntakeResult" element={<WellnessIntakeResult />} />
      <Route path="/SpecializedIntake" element={<SpecializedIntake />} />
      <Route path="/ServiceDetail" element={<ServiceDetail />} />
      <Route path="/HomeEssentials" element={<HomeEssentials />} />
      <Route path="/LeadershipWisdom" element={<LeadershipWisdom />} />
      <Route path="/BackOffice" element={<BackOffice />} />
    </Routes>
  );
  
  if (useLayout) {
    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
  
  return routes;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
