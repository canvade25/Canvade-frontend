import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import Sidebar from '../components/Sidebar';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.replace(/^\/dashboard\/?/, '').split('/')[0] || 'dashboard';

  const handleTabChange = (tab) => {
    navigate(tab === 'dashboard' ? '/dashboard' : `/dashboard/${tab}`);
  };

  return (
    <DashboardLayout sidebar={<Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />}>
      <Outlet />
    </DashboardLayout>
  );
};

export default StudentDashboard;
