import { useState, useCallback } from "react";
import { type Application, applicationAPI } from "../services/api";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      const res = await applicationAPI.getAll();
      setApplications(res.data.sort((a, b) => a.company.localeCompare(b.company)));
    } catch {
      alert("Failed to fetch applications");
    }
  }, []);

  const submitApplication = useCallback(async () => {
    if (!title || !company || !city) return;

    try {
      const res = await applicationAPI.create(title, company, city);
      setApplications((prev) => [...prev, res.data].sort((a, b) => a.company.localeCompare(b.company)));
      setTitle("");
      setCompany("");
      setCity("");
    } catch {
      alert("Failed to create application");
    }
  }, [title, company, city]);

  const deleteApplication = useCallback(async (id: number) => {
    try {
      await applicationAPI.delete(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch {
      alert("Delete failed");
    }
  }, []);

  const updateStatus = useCallback(async (id: number, newStatus: Application["status"]) => {
    try {
      await applicationAPI.updateStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app,
        ),
      );
    } catch {
      alert("Status update failed");
    }
  }, []);

  return {
    applications,
    title,
    setTitle,
    company,
    setCompany,
    city,
    setCity,
    fetchApplications,
    submitApplication,
    deleteApplication,
    updateStatus,
  };
};