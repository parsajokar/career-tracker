import { type ReactNode } from "react";

interface ApplicationFormProps {
  title: string;
  company: string;
  city: string;
  onTitleChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onSubmit: () => void;
}

export function ApplicationForm({
  title,
  company,
  city,
  onTitleChange,
  onCompanyChange,
  onCityChange,
  onSubmit,
}: ApplicationFormProps): ReactNode {
  return (
    <div className="card">
      <h2>Add Application</h2>
      <div className="form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
        />
        <input
          placeholder="City"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        />
      </div>
      <button onClick={onSubmit}>Add</button>
    </div>
  );
}
