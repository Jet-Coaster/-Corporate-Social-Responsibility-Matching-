import axios, {AxiosInstance, AxiosResponse} from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  PIN,
  CSRRep,
  Company,
  ServiceCategory,
  PINRequest,
  Shortlist,
  Match,
  LoginRequest,
  LoginResponse,
  CreatePINRequest,
  CreateShortlistRequest,
  CreateMatchRequest,
  PaginatedResponse,
  RequestFilter,
  MatchFilter,
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL = (Constants.expoConfig?.extra as any)?.apiBaseUrl || 'http://localhost:8080';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      async config => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear storage
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
      },
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post(
      '/auth/login',
      credentials,
    );
    return response.data;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    console.log('API Service: Making registration request to:', this.baseURL + '/auth/register');
    console.log('API Service: Request data:', userData);
    
    const response: AxiosResponse<User> = await this.api.post(
      '/auth/register',
      userData,
    );
    
    console.log('API Service: Registration response:', response.data);
    return response.data;
  }

  // User Profile
  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/api/v1/profile');
    return response.data;
  }

  async updateProfile(userData: {email?: string}): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(
      '/api/v1/profile',
      userData,
    );
    return response.data;
  }

  // PIN Endpoints
  async createPINProfile(pinData: {
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
    emergency_contact?: string;
    medical_info?: string;
    special_needs?: string;
  }): Promise<PIN> {
    const response: AxiosResponse<PIN> = await this.api.post(
      '/api/v1/pin/profile',
      pinData,
    );
    return response.data;
  }

  async getPINProfile(): Promise<PIN> {
    const response: AxiosResponse<PIN> = await this.api.get('/api/v1/pin/profile');
    return response.data;
  }

  async updatePINProfile(pinData: Partial<PIN>): Promise<PIN> {
    const response: AxiosResponse<PIN> = await this.api.put(
      '/api/v1/pin/profile',
      pinData,
    );
    return response.data;
  }

  async createPINRequest(requestData: CreatePINRequest): Promise<PINRequest> {
    const response: AxiosResponse<PINRequest> = await this.api.post(
      '/api/v1/pin/requests',
      requestData,
    );
    return response.data;
  }

  async getPINRequests(): Promise<PINRequest[]> {
    const response: AxiosResponse<PINRequest[]> = await this.api.get(
      '/api/v1/pin/requests',
    );
    return response.data;
  }

  async getPINRequest(id: number): Promise<PINRequest> {
    const response: AxiosResponse<PINRequest> = await this.api.get(
      `/api/v1/pin/requests/${id}`,
    );
    return response.data;
  }

  async updatePINRequest(id: number, requestData: Partial<PINRequest>): Promise<PINRequest> {
    const response: AxiosResponse<PINRequest> = await this.api.put(
      `/api/v1/pin/requests/${id}`,
      requestData,
    );
    return response.data;
  }

  async getPINHistory(filters?: MatchFilter): Promise<PaginatedResponse<Match>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const response: AxiosResponse<PaginatedResponse<Match>> = await this.api.get(
      `/api/v1/pin/history?${params.toString()}`,
    );
    return response.data;
  }

  // CSR Rep Endpoints
  async createCSRProfile(csrData: {
    company_id: number;
    first_name: string;
    last_name: string;
    phone?: string;
    department?: string;
    position?: string;
  }): Promise<CSRRep> {
    const response: AxiosResponse<CSRRep> = await this.api.post(
      '/api/v1/csr/profile',
      csrData,
    );
    return response.data;
  }

  async getCSRProfile(): Promise<CSRRep> {
    const response: AxiosResponse<CSRRep> = await this.api.get('/api/v1/csr/profile');
    return response.data;
  }

  async updateCSRProfile(csrData: Partial<CSRRep>): Promise<CSRRep> {
    const response: AxiosResponse<CSRRep> = await this.api.put(
      '/api/v1/csr/profile',
      csrData,
    );
    return response.data;
  }

  async searchRequests(filters?: RequestFilter): Promise<PaginatedResponse<PINRequest>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const response: AxiosResponse<PaginatedResponse<PINRequest>> = await this.api.get(
      `/api/v1/csr/requests?${params.toString()}`,
    );
    return response.data;
  }

  async getRequest(id: number): Promise<PINRequest> {
    const response: AxiosResponse<PINRequest> = await this.api.get(
      `/api/v1/csr/requests/${id}`,
    );
    return response.data;
  }

  async addToShortlist(shortlistData: CreateShortlistRequest): Promise<Shortlist> {
    const response: AxiosResponse<Shortlist> = await this.api.post(
      '/api/v1/csr/shortlist',
      shortlistData,
    );
    return response.data;
  }

  async getShortlist(): Promise<Shortlist[]> {
    const response: AxiosResponse<Shortlist[]> = await this.api.get(
      '/api/v1/csr/shortlist',
    );
    return response.data;
  }

  async removeFromShortlist(id: number): Promise<void> {
    await this.api.delete(`/api/v1/csr/shortlist/${id}`);
  }

  async createMatch(matchData: CreateMatchRequest): Promise<Match> {
    const response: AxiosResponse<Match> = await this.api.post(
      '/api/v1/csr/matches',
      matchData,
    );
    return response.data;
  }

  async getCSRMatches(filters?: MatchFilter): Promise<PaginatedResponse<Match>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const response: AxiosResponse<PaginatedResponse<Match>> = await this.api.get(
      `/api/v1/csr/matches?${params.toString()}`,
    );
    return response.data;
  }

  async getMatch(id: number): Promise<Match> {
    const response: AxiosResponse<Match> = await this.api.get(
      `/api/v1/csr/matches/${id}`,
    );
    return response.data;
  }

  async updateMatch(id: number, matchData: Partial<Match>): Promise<Match> {
    const response: AxiosResponse<Match> = await this.api.put(
      `/api/v1/csr/matches/${id}`,
      matchData,
    );
    return response.data;
  }

  async getCSRHistory(filters?: MatchFilter): Promise<PaginatedResponse<Match>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const response: AxiosResponse<PaginatedResponse<Match>> = await this.api.get(
      `/api/v1/csr/history?${params.toString()}`,
    );
    return response.data;
  }

  // Admin Endpoints
  async getCompanies(): Promise<Company[]> {
    const response: AxiosResponse<Company[]> = await this.api.get(
      '/api/v1/admin/companies',
    );
    return response.data;
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    const response: AxiosResponse<ServiceCategory[]> = await this.api.get(
      '/api/v1/admin/categories',
    );
    return response.data;
  }

  // Utility methods
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }
}

export default new ApiService();
