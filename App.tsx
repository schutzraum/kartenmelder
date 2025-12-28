import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Success from './pages/Success';
import Rankings from './pages/Rankings';
import Admin from './pages/Admin';
import AdminFeedbackDetails from './pages/AdminFeedbackDetails';
import CityDetails from './pages/CityDetails';
import PhoneDetails from './pages/PhoneDetails';
import Feedback from './pages/Feedback';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/success/:id" element={<Success />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/city/:cityName" element={<CityDetails />} />
          <Route path="/phone/:phoneNumber" element={<PhoneDetails />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/feedback/:id" element={<AdminFeedbackDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;