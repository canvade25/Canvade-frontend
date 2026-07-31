import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Step1 from "./Step1";
import OnboardingSteps from "./OnboardingSteps"; // merged Step2 + Step3 + Step4
import Canvadelogin from "../Auth/Student/Login";
import Signup from "../Auth/Student/Signup";

export default function Onboarding({ initialFlow }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const flow = params.get("flow") || "";
  const role = params.get("role") || "";

  const [step, setStep] = useState(1);
  const [userChoice, setUserChoice] = useState({ role: "", flow: "" });
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (flow === "login") {
      setUserChoice({ role: role || "student", flow: "login" });
      setStep(2);
    } else if (flow === "signup") {
      setUserChoice({ role: role || "student", flow: "signup" });
      setStep(2);
    } else {
      setUserChoice({ role: "", flow: "" });
      setStep(1);
    }
  }, [flow, role]);

  const handleBack = () => {
    if (location.search) {
      navigate("/get-started");
      return;
    }
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLoginChoice = (selectedRole) => {
    navigate(`/get-started?flow=login&role=${selectedRole}`);
  };

  const handleSignupChoice = () => {
    navigate(`/get-started?flow=signup&role=student`);
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col items-center">
      {step === 1 && (
        <Step1
          onStudentSignup={handleSignupChoice}
          onInstitutionSignup={() => navigate(`/get-started?flow=signup&role=educator`)}
          onLoginClick={() => handleLoginChoice("student")}
        />
      )}

      {step === 2 && (
        userChoice.flow === "signup" ? (
          <Signup
            onSignupSuccess={() => setStep(3)}
            switchToLogin={() => navigate(`/get-started?flow=login&role=${userChoice.role || "student"}`)}
          />
        ) : (
          <Canvadelogin
            onLoginSuccess={() => setStep(3)}
            onSignUpClick={handleSignupChoice}
          />
        )
      )}

      {/* Steps 2 + 3 + 4 merged — OnboardingSteps handles its own internal navigation */}
      {step === 3 && (
        <OnboardingSteps
          back={handleBack}
          parentFormData={formData}
        />
      )}

    </div>
  );
}
