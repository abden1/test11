import axios from 'axios';
import { FreelancerRegistrationRequest, ProjectRequest, Freelancer, Project } from '../types/api';

// Base URL for API calls
const API_URL = 'http://10.0.2.2:8080/api/v1'; // Points to localhost for Android emulator

// For web testing, we should use localhost instead of 10.0.2.2
const isWeb = typeof document !== 'undefined';
const baseURL = isWeb ? 'http://localhost:8080/api/v1' : API_URL;

console.log('API Base URL:', baseURL); // Debug log

// API client
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Freelancer API service
export const freelancerApi = {
  // Register a new freelancer
  register: async (data: FreelancerRegistrationRequest): Promise<Freelancer> => {
    try {
      console.log('Registering freelancer with data:', data);
      const response = await apiClient.post('/register', data);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error registering freelancer:', error);
      throw error;
    }
  },
  
  // Get freelancer by ID
  getById: async (id: number): Promise<Freelancer> => {
    try {
      const response = await apiClient.get(`/freelancers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching freelancer with ID ${id}:`, error);
      throw error;
    }
  },
};

// Portfolio/Project API service
export const portfolioApi = {
  // Add a project to a freelancer's portfolio
  addProject: async (freelancerId: number, project: ProjectRequest): Promise<Project> => {
    try {
      const response = await apiClient.post(`/portfolio/add?freelancerId=${freelancerId}`, project);
      return response.data;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },
  
  // Search for projects
  searchProjects: async (query: string, page = 0, size = 10): Promise<Project[]> => {
    try {
      const response = await apiClient.get(`/portfolio/search?query=${query}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  },
  
  // Get projects by freelancer ID
  getProjectsByFreelancerId: async (freelancerId: number): Promise<Project[]> => {
    try {
      const response = await apiClient.get(`/portfolio/freelancer/${freelancerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching projects for freelancer ${freelancerId}:`, error);
      throw error;
    }
  },
}; 