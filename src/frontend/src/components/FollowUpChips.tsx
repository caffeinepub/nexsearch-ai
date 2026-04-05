interface FollowUpChipsProps {
  chips: string[];
  onChipClick: (chip: string) => void;
}

export function FollowUpChips({ chips, onChipClick }: FollowUpChipsProps) {
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-5" data-ocid="followup.list">
      <p className="w-full text-xs text-[color:var(--nx-text-muted)] mb-1 font-medium uppercase tracking-wider">
        Follow-up questions
      </p>
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onChipClick(chip)}
          type="button"
          className="nx-chip px-3.5 py-1.5 rounded-full text-sm text-left"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
