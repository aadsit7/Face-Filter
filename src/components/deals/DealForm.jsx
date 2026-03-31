import { useState } from 'react';
import Button from '../ui/Button';

const emptyForm = {
  customerName: '',
  customerEmail: '',
  product: 'Right Click Tools',
  estimatedValue: '',
  expectedCloseDate: '',
  notes: '',
};

export default function DealForm({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState(
    initialData
      ? {
          customerName: initialData.customerName || '',
          customerEmail: initialData.customerEmail || '',
          product: initialData.product || 'Right Click Tools',
          estimatedValue: initialData.estimatedValue || '',
          expectedCloseDate: initialData.expectedCloseDate || '',
          notes: initialData.notes || '',
        }
      : { ...emptyForm }
  );
  const [errors, setErrors] = useState({});

  const requiredFields = ['customerName', 'customerEmail', 'estimatedValue', 'expectedCloseDate'];

  const validate = () => {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!form.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    if (!form.estimatedValue && form.estimatedValue !== 0) {
      newErrors.estimatedValue = 'Estimated value is required';
    }
    if (!form.expectedCloseDate) newErrors.expectedCloseDate = 'Expected close date is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      ...form,
      estimatedValue: Number(form.estimatedValue),
      status: initialData?.status || 'submitted',
    });
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-recast-gray-700 focus:outline-none focus:ring-2 focus:ring-recast-navy transition-colors ${
      errors[field] ? 'border-red-500' : 'border-recast-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-recast-gray-700 mb-1">
          Customer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          className={inputClass('customerName')}
          placeholder="Enter customer name"
        />
        {errors.customerName && (
          <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-recast-gray-700 mb-1">
          Customer Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="customerEmail"
          value={form.customerEmail}
          onChange={handleChange}
          className={inputClass('customerEmail')}
          placeholder="contact@company.com"
        />
        {errors.customerEmail && (
          <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-recast-gray-700 mb-1">Product</label>
        <select
          name="product"
          value={form.product}
          onChange={handleChange}
          className="w-full rounded-lg border border-recast-gray-300 px-3 py-2 text-sm text-recast-gray-700 focus:outline-none focus:ring-2 focus:ring-recast-navy transition-colors"
        >
          <option>Right Click Tools</option>
          <option>Application Workspace</option>
          <option>Privileged Access</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-recast-gray-700 mb-1">
          Estimated Value <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-recast-gray-500">
            $
          </span>
          <input
            type="number"
            name="estimatedValue"
            value={form.estimatedValue}
            onChange={handleChange}
            className={`${inputClass('estimatedValue')} pl-7`}
            placeholder="0"
            min="0"
          />
        </div>
        {errors.estimatedValue && (
          <p className="text-red-500 text-xs mt-1">{errors.estimatedValue}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-recast-gray-700 mb-1">
          Expected Close Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="expectedCloseDate"
          value={form.expectedCloseDate}
          onChange={handleChange}
          className={inputClass('expectedCloseDate')}
        />
        {errors.expectedCloseDate && (
          <p className="text-red-500 text-xs mt-1">{errors.expectedCloseDate}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-recast-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border border-recast-gray-300 px-3 py-2 text-sm text-recast-gray-700 focus:outline-none focus:ring-2 focus:ring-recast-navy transition-colors"
          placeholder="Additional notes (optional)"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? 'Update Deal' : 'Register Deal'}</Button>
      </div>
    </form>
  );
}
