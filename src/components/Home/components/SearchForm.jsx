import React, { memo, useMemo } from 'react';
import { FORM_OPTIONS, HERO_CONTENT } from '../constants/heroConstants';

/* ── Chevron Icon ── */
const ChevronDownIcon = memo(function ChevronDownIcon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
});

/* ── Select Field ── */
const SelectField = memo(function SelectField({
  label,
  name,
  options,
  placeholder,
  value,
  onChange,
  onBlur,
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight"
      >
        {label}
      </label>
      <div className="relative w-full">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full rounded-lg border border-gray-200 bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 pr-8 text-xs sm:text-[13px] ${
            value ? 'text-slate-700' : 'text-slate-400'
          } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all duration-200 appearance-none shadow-2xs cursor-pointer`}
          aria-label={label}
        >
          <option value="" disabled hidden className="text-slate-400">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-slate-700">{opt.label}</option>
          ))}
        </select>
        <ChevronDownIcon />
      </div>
    </div>
  );
});

/* ── Input Field ── */
const InputField = memo(function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  error = '',
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full rounded-lg border ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300'
          } bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all duration-200 shadow-2xs`}
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

/* ── Main Search Form ── */
const SearchForm = memo(function SearchForm({
  formData,
  errors,
  touched,
  onFieldChange,
  onFieldBlur,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const helperText = useMemo(() => HERO_CONTENT.searchHelper, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl lg:rounded-b-none bg-white p-4 sm:p-5 lg:p-6 shadow-xl border border-gray-100/80 transition-all duration-300"
      noValidate
      aria-label="Course search form"
    >
      <div className="flex flex-col gap-3 sm:gap-3.5">
        {/* Programs */}
        <InputField
          label="Programs & Institutions"
          name="programs"
          value={formData.programs || ''}
          onChange={onFieldChange}
          onBlur={onFieldBlur}
          placeholder={HERO_CONTENT.placeholders.programs}
          required
          error={touched.programs && errors.programs ? errors.programs : ''}
        />

        {/* Location */}
        <InputField
          label="Location"
          name="location"
          value={formData.location || ''}
          onChange={onFieldChange}
          onBlur={onFieldBlur}
          placeholder={HERO_CONTENT.placeholders.location}
          required
          error={touched.location && errors.location ? errors.location : ''}
        />

        {/* Search For + Fee Range */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <SelectField
            label="Search For"
            name="searchFor"
            value={formData.searchFor || ''}
            onChange={onFieldChange}
            onBlur={onFieldBlur}
            options={FORM_OPTIONS.searchFor}
            placeholder="eg. Institutes"
          />
          <SelectField
            label="Fee Range"
            name="feeRange"
            value={formData.feeRange || ''}
            onChange={onFieldChange}
            onBlur={onFieldBlur}
            options={FORM_OPTIONS.feeRange}
            placeholder="eg. 0 – 5000"
          />
        </div>

        {/* Learning Mode + Duration */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <SelectField
            label="Learning Mode"
            name="learningMode"
            value={formData.learningMode || ''}
            onChange={onFieldChange}
            onBlur={onFieldBlur}
            options={FORM_OPTIONS.learningMode}
            placeholder="eg. Hybrid"
          />
          <SelectField
            label="Duration"
            name="courseDuration"
            value={formData.courseDuration || ''}
            onChange={onFieldChange}
            onBlur={onFieldBlur}
            options={FORM_OPTIONS.courseDuration}
            placeholder="eg. 0 – 6 Months"
          />
        </div>

        {/* Submit + helper note */}
        <div className="flex flex-col items-start gap-2 pt-1.5 sm:pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#E2E8F0] hover:bg-[#16C79A] hover:text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
            aria-label="Search courses"
          >
            Search
          </button>
          <p className="text-[11px] sm:text-[12px] leading-snug text-red-500/90 font-medium">
            {helperText}
          </p>
        </div>
      </div>
    </form>
  );
});

export default SearchForm;