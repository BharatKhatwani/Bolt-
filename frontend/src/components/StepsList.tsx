import { CheckCircle, Circle, Clock, Loader2 } from 'lucide-react';
import type { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  // Check if any step is in-progress
  const isGenerating = steps.some(step => step.status === 'in-progress');

  // Debug logs to check step updates
  console.log('Steps state:', steps);
  console.log('Any step in-progress?', isGenerating);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100">Build Steps</h2>
        <p className="text-xs text-gray-400 mt-1">
          {steps.length} {steps.length === 1 ? 'step' : 'steps'}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 relative">
        <div className="space-y-3">
          {steps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No steps yet</p>
            </div>
          ) : (
            steps.map((step) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentStep === step.id
                    ? 'bg-blue-600/20 border border-blue-400/30 shadow-lg'
                    : 'hover:bg-gray-800/50 border border-transparent'
                }`}
                onClick={() => onStepClick(step.id)}
              >
                <div className="flex items-center gap-3">
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : step.status === 'in-progress' ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-100 truncate">{step.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{step.description}</p>
                  </div>
                </div>

                {/* Progress indicator for in-progress steps */}
                {step.status === 'in-progress' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-400 h-1.5 rounded-full animate-pulse"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Bottom continuous loader */}
        {isGenerating && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
