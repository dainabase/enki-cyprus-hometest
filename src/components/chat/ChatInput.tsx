import { ConsentBox } from './ConsentBox';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  consent: boolean;
  consentGiven: boolean;
  shouldHighlightConsent: boolean;
  onConsentChange: (checked: boolean) => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  consent,
  consentGiven,
  shouldHighlightConsent,
  onConsentChange,
  isAnalyzing,
  disabled = false
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="input-area border-t p-4">
      {!consentGiven && (
        <ConsentBox
          consent={consent}
          shouldHighlight={shouldHighlightConsent}
          onChange={onConsentChange}
        />
      )}

      <div className="flex gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 p-3 border rounded-lg resize-none"
          rows={2}
          placeholder="Décrivez votre recherche immobilière idéale..."
          disabled={disabled || (!consentGiven && !consent)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={onSubmit}
          disabled={!consent || !value.trim() || isAnalyzing}
          className="px-6 py-3 bg-primary text-white rounded-lg disabled:opacity-50 font-medium"
        >
          {isAnalyzing ? 'Analyse...' : 'Analyser'}
        </button>
      </div>
    </div>
  );
};
