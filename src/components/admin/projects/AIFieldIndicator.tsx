import React from 'react';
import { Brain, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExtractedFieldData } from '@/lib/ai-import/types';

interface AIFieldIndicatorProps {
  fieldData?: ExtractedFieldData;
  className?: string;
}

export const AIFieldIndicator: React.FC<AIFieldIndicatorProps> = ({ 
  fieldData, 
  className = '' 
}) => {
  if (!fieldData) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800 border-green-300';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Haute';
    if (confidence >= 0.7) return 'Moyenne';
    return 'Faible';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge 
              variant="outline" 
              className={`text-xs ${getConfidenceColor(fieldData.confidence)}`}
            >
              <Brain className="w-3 h-3 mr-1" />
              IA
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Rempli par IA</span>
                <Info className="w-3 h-3" />
              </div>
              <div>Source: {fieldData.documentName}</div>
              <div>
                Confiance: {getConfidenceLabel(fieldData.confidence)} 
                ({Math.round(fieldData.confidence * 100)}%)
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Badge 
        variant="secondary" 
        className={`text-xs ${getConfidenceColor(fieldData.confidence)}`}
      >
        {Math.round(fieldData.confidence * 100)}%
      </Badge>
    </div>
  );
};