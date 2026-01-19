import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export interface Application {
  id: number;
  title: string;
  company: string;
  city: string;
  status: "Draft" | "Applied" | "Interviewing" | "Offered" | "Rejected";
}

export const authAPI = {
  checkAuth: () => axios.get("/me"),
  login: (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    return axios.post("/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      withCredentials: true,
    });
  },
  register: (username: string, password: string) =>
    axios.post("/register", { username, password }),
  logout: () => axios.post("/logout"),
};

export const applicationAPI = {
  getAll: () => axios.get<Application[]>("/application/get"),
  create: (title: string, company: string, city: string) =>
    axios.post<Application>("/application/create", { title, company, city }),
  delete: (id: number) => axios.delete(`/application/delete/${id}`),
  updateStatus: (id: number, status: Application["status"]) =>
    axios.put(`/application/update/${id}`, { status }),
};
