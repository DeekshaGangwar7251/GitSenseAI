import { workflow } from "../../../constants/workflow";
import WorkflowStep from "../WorkflowStep";

function Workflow() {
  return (
    <section className="mx-auto mt-32 max-w-7xl px-6">

      <div className="text-center">

        <p className="font-semibold uppercase tracking-widest text-violet-600">
          HOW IT WORKS
        </p>

        <h2 className="mt-3 text-4xl font-bold text-gray-900">
          From Repository to AI Insights
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          GitSenseAI follows an intelligent LLM + RAG pipeline to understand
          your repository and answer complex questions accurately.
        </p>

      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {workflow.map((step, index) => (
          <WorkflowStep
            key={step.title}
            {...step}
            index={index}
          />
        ))}

      </div>

    </section>
  );
}

export default Workflow;