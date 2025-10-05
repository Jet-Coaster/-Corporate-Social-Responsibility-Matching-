export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'csr_rep' | 'pin' | 'platform';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PIN {
  id: number;
  user_id: number;
  user: User;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  date_of_birth?: string;
  emergency_contact: string;
  medical_info: string;
  special_needs: string;
  created_at: string;
  updated_at: string;
}

export interface CSRRep {
  id: number;
  user_id: number;
  user: User;
  company_id: number;
  company: Company;
  first_name: string;
  last_name: string;
  phone: string;
  department: string;
  position: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PINRequest {
  id: number;
  pin_id: number;
  pin: PIN;
  category_id: number;
  category: ServiceCategory;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  preferred_date?: string;
  location: string;
  special_notes: string;
  view_count: number;
  shortlist_count: number;
  created_at: string;
  updated_at: string;
}

export interface Shortlist {
  id: number;
  csr_rep_id: number;
  csr_rep: CSRRep;
  request_id: number;
  request: PINRequest;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: number;
  csr_rep_id: number;
  csr_rep: CSRRep;
  request_id: number;
  request: PINRequest;
  pin_id: number;
  pin: PIN;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  completed_at?: string;
  rating?: number;
  feedback?: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreatePINRequest {
  title: string;
  description: string;
  category_id: number;
  urgency?: string;
  preferred_date?: string;
  location?: string;
  special_notes?: string;
}

export interface CreateShortlistRequest {
  request_id: number;
  notes?: string;
  priority?: string;
}

export interface CreateMatchRequest {
  request_id: number;
  start_date?: string;
  notes?: string;
}

export interface Pagination {
  page: number;
  page_size: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface RequestFilter {
  category_id?: number;
  status?: string;
  urgency?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface MatchFilter {
  csr_rep_id?: number;
  pin_id?: number;
  category_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}



