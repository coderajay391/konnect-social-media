import React, { useState } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Button } from '../../common/Button/Button';
import { useToast } from '../../../context/ToastContext';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  'Spam or misleading content',
  'Hate speech or harassment',
  'Inappropriate or adult content',
  'Violence or harmful behavior',
  'Intellectual property violation',
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      success('Thank you. Our moderation team will review this report.', 'Report Submitted');
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Post" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Help us keep the community safe. Why are you reporting this post?
        </p>

        <div className="space-y-2">
          {REPORT_REASONS.map((reason) => (
            <label
              key={reason}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <input
                type="radio"
                name="reportReason"
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="text-brand-600 focus:ring-brand-500/30"
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>

        <textarea
          rows={2}
          placeholder="Additional details (optional)..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" type="submit" isLoading={isSubmitting}>
            Submit Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};
