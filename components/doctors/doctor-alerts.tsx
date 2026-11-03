import { X } from 'lucide-react';

interface DoctorAlertsProps {
  error: string;
  success: string;
  onDismissError: () => void;
  onDismissSuccess: () => void;
}

export function DoctorAlerts({
  error,
  success,
  onDismissError,
  onDismissSuccess,
}: DoctorAlertsProps) {
  return (
    <>
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger"
        >
          <span>{error}</span>
          <button onClick={onDismissError} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-success/20 bg-success-bg px-4 py-3 text-sm text-success"
        >
          <span>{success}</span>
          <button onClick={onDismissSuccess} aria-label="Dismiss success">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}

