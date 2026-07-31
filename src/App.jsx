import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
// import AuthLayout from "./components/Auth/AuthLayout";
import ScrollToTop from "./components/ScrollToTop";
import StudentRoute from "./protectedRoutes/StudentRoute";
import AdminRoute from "./protectedRoutes/AdminRoute";
import PublicRoute from "./protectedRoutes/PublicRoute";
import OnboardingLayout from "./components/onboarding/OnboardingLayout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import AboutPage from "./pages/AboutPage";
import HelpCenter from "./pages/HelpCenter";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ChatPage from "./pages/ChatPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import UpdatesPage from "./pages/UpdatesPage";
import UpdateDetail from "./pages/UpdateDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CompareCourses from "./pages/CompareCourses";
import CourseView from "./pages/CourseView";
import InstituteView from "./pages/InstituteView";
import Step1 from "./components/onboarding/Step1";
import OnboardingSteps from "./components/onboarding/Onboardingsteps";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Student/Signup";
import AdminSignup from "./components/Auth/Admin/AdminSignup";
import InstituteOnboarding from "./pages/InstituteOnboarding";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import Analytics from "./pages/dashboard/admin/pages/Analytics";
import Promotions from "./pages/dashboard/admin/pages/Promotions";
import LeadsEnquiries from "./pages/dashboard/admin/pages/LeadsEnquiries";
import CoursesWorkshops from "./pages/dashboard/admin/pages/CoursesWorkshops";
import RevenuePayments from "./pages/dashboard/admin/pages/RevenuePayments";
import ProfileVerificationLanding from "./pages/dashboard/admin/pages/ProfileVerificationLanding";
import ProfileVerification from "./pages/dashboard/admin/pages/ProfileVerification";
import ReviewsRatings from "./pages/dashboard/admin/pages/ReviewsRatings";
import BatchPlanner from "./pages/dashboard/admin/pages/BatchPlanner";
import BlogsPress, { CreateUpdatePage } from "./pages/dashboard/admin/pages/BlogsPress";
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import StudentHome from "./pages/dashboard/student/pages/DashboardHome";
import Enrollments from "./pages/dashboard/student/pages/Enrollments";
import Enquiries from "./pages/dashboard/student/pages/Enquiries";
import Payments from "./pages/dashboard/student/pages/Payments";
import Profile from "./pages/dashboard/student/pages/Profile";
import Compare from "./pages/dashboard/student/pages/Compare";
import SearchResults from "./pages/SearchResults";
import InstituteOnboardingSuccess from "./pages/Instituteonboardingsuccess .jsx";
// import CountdownPage from "./components/CountdownPage";

function App() {
  // Persists a referrer's uid from a shared link like /?ref=<uid> so it
  // survives navigation through to the signup form, wherever the user lands.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) {
      localStorage.setItem("referralCode", ref);
    }
  }, []);

  const LoginPage = () => {
    const navigate = useNavigate();
    return <Login onSignUpClick={() => navigate("/signup")} />;
  };

  const SignupPage = () => {
    const navigate = useNavigate();
    return <Signup switchToLogin={() => navigate("/login")} />;
  };

  const OnboardingSelection = () => {
    const navigate = useNavigate();
    return (
      <Step1
        onStudentSignup={() => navigate("/get-started/login/student/signup")}
        onInstitutionSignup={() => navigate("/get-started/login/educator/signup")}
        onLoginClick={() => navigate("/get-started/login/student")}
      />
    );
  };

  const OnboardingLogin = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const redirectPath = role === "student" ? "/dashboard" : "/admin/dashboard";

    const handleSignUpClick = () => {
      navigate(`/get-started/login/${role}/signup`);
    };

    const handleBackClick = () => {
      navigate('/get-started');
    };

    return (
      <Login
        onLoginSuccess={() => navigate(redirectPath)}
        onSignUpClick={handleSignUpClick}
        onBackClick={handleBackClick}
        successPath={redirectPath}
      />
    );
  };

  const OnboardingSignup = () => {
    const { role } = useParams();
    const navigate = useNavigate();

    if (role !== "student") {
      return (
        <AdminSignup
          switchToLogin={() => navigate(`/get-started/login/${role}`)}
          switchToSelect={() => navigate('/get-started')}
          onSignupSuccess={() =>
            navigate("/institute/onboarding", {
              state: { fromEducatorSignup: true },
            })
          }
        />
      );
    }

    return (
      <OnboardingSteps
        back={() => navigate(`/get-started/login/${role}`)}
        parentFormData={{}}
      />
    );
  };

  // Countdown logic ko abhi ke liye band kar diya hai
  // const [isLocked, setIsLocked] = useState(false);

  // useEffect(() => {
  //   const targetDate = new Date("July 1, 2026 00:00:00").getTime();

  //   const checkTime = () => {
  //     const now = new Date().getTime();
  //     if (now >= targetDate) {
  //       setIsLocked(false);
  //     } else {
  //       setIsLocked(true);
  //     }
  //   };

  //   checkTime();
  //   const interval = setInterval(checkTime, 60000);

  //   return () => clearInterval(interval);
  // }, []);

  // if (isLocked) {
  //   return <CountdownPage />;
  // }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            
            {/* Public/Auth Routes - Redirects to Home if already logged in */}
            <Route element={<PublicRoute />}>
              <Route path="/get-started/*" element={<OnboardingLayout />}>
                <Route index element={<OnboardingSelection />} />
                <Route path="login/:role" element={<OnboardingLogin />} />
                <Route path="login/:role/signup" element={<OnboardingSignup />} />
                <Route
                  path="signup"
                  element={
                    <OnboardingSteps back={() => {}} parentFormData={{}} />
                  }
                />
                <Route
                  path="*"
                  element={<Navigate to="/get-started" replace />}
                />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            <Route path="/categories" element={<Categories />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/updates/:updateId" element={<UpdateDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/:courseId" element={<CheckoutPage />} />
            <Route path="/compare-courses" element={<CompareCourses />} />
            <Route path="/courseview" element={<CourseView />} />
            <Route path="/courseview/:courseId" element={<CourseView />} />
            <Route path="/instituteview" element={<InstituteView />} />
            <Route path="/instituteview/:instituteId" element={<InstituteView />} />
            <Route path="/institute/onboarding" element={<InstituteOnboarding />} />
            <Route path="/institute/onboarding/success" element={<InstituteOnboardingSuccess />} />

            {/* Protected Student Routes */}
            <Route element={<StudentRoute />}>
              <Route path="/dashboard/*" element={<StudentDashboard />}>
                <Route index element={<Navigate to="enrollments" replace />} />
                <Route
                  path="enquiries"
                  element={<Enquiries mode="enquiries" />}
                />
                <Route path="enrollments" element={<Enrollments />} />
                <Route path="payments" element={<Payments />} />
                <Route path="profile" element={<Profile />} />
                <Route path="compare" element={<Compare />} />
              </Route>
            </Route>

            {/* Protected Admin/Institute Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard/*" element={<AdminDashboard />}>
                <Route index element={<Navigate to="analytics" replace />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="leads" element={<LeadsEnquiries />} />
                <Route path="courses" element={<CoursesWorkshops />} />
                <Route path="payments" element={<RevenuePayments />} />
                <Route path="profile" element={<ProfileVerificationLanding />} />
                <Route path="profile/edit" element={<ProfileVerification />} />
                <Route path="reviews" element={<ReviewsRatings />} />
                <Route path="batches" element={<BatchPlanner />} />
                <Route path="blogs" element={<BlogsPress />} />
                <Route path="blogs/create" element={<CreateUpdatePage />} />
                <Route path="*" element={<Navigate to="analytics" replace />} />
              </Route>
            </Route>

            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
