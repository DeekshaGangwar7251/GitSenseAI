import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../../components/analysis/ProgressBar/ProgressBar";
import ProgressStep from "../../components/analysis/ProgressStep/ProgressStep";

import { analysisSteps } from "../../constants/analysisSteps";

function Analysis() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev === analysisSteps.length) {
          clearInterval(timer);

          setTimeout(() => {
            navigate("/workspace");
          }, 1200);

          return prev;
        }

        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const progress = Math.round(
    (currentStep / analysisSteps.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-6">

      <div className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="text-4xl font-bold">
          Analyzing Repository...
        </h1>

        <p className="mt-3 text-gray-500">
          Please wait while GitSenseAI understands the codebase.
        </p>

        <div className="mt-10 space-y-4">

          {analysisSteps.map((step, index) => (
            <ProgressStep
              key={step}
              title={step}
              completed={index < currentStep}
              active={index === currentStep}
            />
          ))}

        </div>

        <div className="mt-10">

          <ProgressBar
            progress={progress}
          />

        </div>

      </div>

    </div>
  );
}

export default Analysis;