import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../../components/analysis/ProgressBar/ProgressBar";
import ProgressStep from "../../components/analysis/ProgressStep/ProgressStep";

import { analysisSteps } from "../../constants/analysisSteps";

function Analysis() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const repositoryInfo =
      sessionStorage.getItem("repositoryInfo");

    if (!repositoryInfo) {
      navigate("/");
      return;
    }

    let step = 0;

    const timer = setInterval(() => {
      step++;

      setCurrentStep(step);

      if (step >= analysisSteps.length) {
        clearInterval(timer);

        setTimeout(() => {
          navigate("/workspace");
        }, 1000);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [navigate]);

  const progress = Math.round(
    (currentStep / analysisSteps.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl bg-white p-5 shadow-lg sm:rounded-3xl sm:p-8 md:p-10">

          {/* Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">
              Repository Analyzed Successfully
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              GitSenseAI has analyzed the repository.
              Preparing your workspace...
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
            {analysisSteps.map((step, index) => (
              <ProgressStep
                key={step}
                title={step}
                completed={index < currentStep}
                active={index === currentStep}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8 sm:mt-10">
            <ProgressBar progress={progress} />
          </div>

          <p className="mt-3 text-center text-xs text-gray-400 sm:text-sm">
            {progress}% complete
          </p>

        </div>
      </div>
    </div>
  );
}

export default Analysis;