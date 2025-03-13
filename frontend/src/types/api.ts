// Freelancer types
export interface Freelancer {
  id: number;
  name: string;
  email: string;
  specialization: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
}

export interface FreelancerRegistrationRequest {
  name: string;
  email: string;
  password: string;
  specialization: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
}

// Project types
export interface Project {
  id: number;
  title: string;
  description?: string;
  technologiesUsed: string[];
  createdAt: string;
  freelancer: Freelancer;
}

export interface ProjectRequest {
  title: string;
  description?: string;
  technologiesUsed: string[];
} 