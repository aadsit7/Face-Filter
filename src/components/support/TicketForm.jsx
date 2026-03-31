import { useState } from 'react';
import Button from '../ui/Button';

const categories = [
  { value: 'deal_support', label: 'Deal Support' },
  { value: 'technical', label: 'Technical' },
  { value: 'billing', label: 'Billing' },
  { value: 'general', label: 'General' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TicketForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ ...form, status: 'open' });
  };

  const inputClasses =
    'w-full rounded-lg border border-recast-gray-300 px-3 py-2 text-sm text-recast-gray-700 focus:outline-none focus:ring-2 focus:ring-recast-navy/30 focus:border-recast-navy';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-recast-gray-700 mb-1">Subject *</label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className={inputClasses}
          placeholder="Brief description of your issue"
        />
        {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-recast-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClasses}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-recast-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClasses}
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-recast-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={inputClasses}
          placeholder="Provide details about your issue..."
        />
        {errors.description && (
          <p className="text-xs text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit Ticket</Button>
      </div>
    </form>
  );
}
