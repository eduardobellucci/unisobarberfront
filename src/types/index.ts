export type Barber = {
  id: string;
  name: string;
  photo: string;
  description: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
};

export type Service = {
  id: string;
  barberId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

export type AppointmentStatus = "Confirmado" | "Cancelado" | "Concluído";

export type Appointment = {
  id: string;
  barberId: string;
  serviceId: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
};

export type ScheduleSlot = {
  id: string;
  barberId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "barber";
};

export type AppSettings = {
  id: string;
  name: string;
  welcomeText: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  bannerUrl: string;
  aboutText: string;
};

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};

