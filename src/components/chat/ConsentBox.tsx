interface ConsentBoxProps {
  consent: boolean;
  shouldHighlight?: boolean;
  onChange: (checked: boolean) => void;
}

export const ConsentBox = ({ consent, shouldHighlight, onChange }: ConsentBoxProps) => {
  return (
    <div className={`consent-box mb-4 p-3 rounded border ${
      shouldHighlight
        ? 'bg-amber-50 border-amber-200'
        : 'bg-amber-50 border-amber-200'
    }`}>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-sm">
          J'accepte le traitement de mes données pour des recommandations personnalisées
        </span>
      </label>
    </div>
  );
};
