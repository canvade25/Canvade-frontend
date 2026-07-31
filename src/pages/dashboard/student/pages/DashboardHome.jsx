import React from 'react';
import { Topbar, ContinueLearning, DashboardCard, RecommendedCourses, DashboardSummaryGrid, DiscoverMore, LearningOverview } from '../../layout/DashboardLayout';

const DashboardHome = () => {
  return (
    <>
      <Topbar />
      <ContinueLearning />
      <DashboardCard />
      <RecommendedCourses />
      <DashboardSummaryGrid />
      <DiscoverMore />
      <LearningOverview />
    </>
  );
};

export default DashboardHome;
