import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import AdminSidebar from './AdminSidebar';
import CourseCreateForm from '../../../components/Coursecreateform';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.replace(/^\/admin\/dashboard\/?/, '').split('/')[0] || 'analytics';
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (activeTab !== 'courses') {
      setShowCreateForm(false);
    }
  }, [activeTab]);

  const handleSetActiveTab = (tab) => {
    if (tab !== 'courses') {
      setShowCreateForm(false);
    }
    navigate(`/admin/dashboard/${tab}`);
  };

  return (
    <DashboardLayout
      sidebar={
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={handleSetActiveTab} 
        />
      }
    >
      <div className="w-full h-full">
        {activeTab === 'courses' && showCreateForm ? (
          <CourseCreateForm onCancel={() => setShowCreateForm(false)} />
        ) : (
          <Outlet />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;