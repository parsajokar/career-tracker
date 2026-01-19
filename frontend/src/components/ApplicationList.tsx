import { type ReactNode } from "react";
import { type Application } from "../services/api";

interface ApplicationListProps {
  applications: Application[];
  onStatusChange: (id: number, status: Application["status"]) => void;
  onDelete: (id: number) => void;
}

export function ApplicationList({
  applications,
  onStatusChange,
  onDelete,
}: ApplicationListProps): ReactNode {
  return (
    <div className="list">
      {applications.map((app) => (
        <div key={app.id} className="item">
          <div>
            <div className="role">{app.title}</div>
            <div className="company">{app.company}</div>
            <div className="city">{app.city}</div>
          </div>
          <div className="item-actions">
            <select
              className="status-select"
              value={app.status}
              onChange={(e) =>
                onStatusChange(app.id, e.target.value as Application["status"])
              }
            >
              <option value="Draft">Draft</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button className="delete-btn" onClick={() => onDelete(app.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
