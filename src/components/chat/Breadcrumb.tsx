import { MessageSquare, Grid3x3, Home, TrendingDown } from 'lucide-react';

type BreadcrumbStep = 'analysis' | 'results' | 'property' | 'lexaia';

interface BreadcrumbProps {
  currentStep: BreadcrumbStep;
}

export const Breadcrumb = ({ currentStep }: BreadcrumbProps) => {
  const steps = [
    { id: 'analysis' as BreadcrumbStep, label: 'Analysis', icon: MessageSquare },
    { id: 'results' as BreadcrumbStep, label: 'Results', icon: Grid3x3 },
    { id: 'property' as BreadcrumbStep, label: 'Property', icon: Home },
    { id: 'lexaia' as BreadcrumbStep, label: 'Lexaia', icon: TrendingDown },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= currentIndex;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 transition-colors ${
                isCurrent
                  ? 'bg-black text-white'
                  : isActive
                  ? 'bg-black/10 text-black'
                  : 'bg-black/5 text-black/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium whitespace-nowrap">
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <svg
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-black/20' : 'text-black/10'
                }`}
                viewBox="0 0 16 16"
                fill="none"
              >
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};
