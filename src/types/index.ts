export interface User {
  id: string; // or number, depending on backend. Usually string with UUIDs or number with TypeORM defaults. Assuming number based on standard NestJS scaffold unless specified UUID. Let's check or assume generic ID.
  // Context says sub is userId.
  email: string;
  role: 'admin' | 'gestor' | 'coder';
  name?: string;
}

export interface Vacancy {
  id: number;
  title: string;
  description: string;
  maxApplicants: number;
  requirements?: string[]; // Optional in frontend or change to fields
  isActive: boolean; // Field name from entity
  // Other fields from entity
  company?: string;
  location?: string;
  salaryRange?: string;
  seniority?: string;
  technologies?: string;
  softSkills?: string;
  modality?: 'remote' | 'onsite' | 'hybrid';
  created_at?: string;
}

export interface Application {
  id: number;
  vacancyId: number;
  userId: number;
  status?: string;
  created_at: string;
  vacancy?: Vacancy;
}

export interface AuthResponse {
  token: string;
  user: User; // Backend context says payload has sub, email, role. Usually login returns access_token.
  // Wait, Context says "Payload incluye: sub, email, role". Login response typically returns `access_token`. 
  // I will check the backend auth controller/service if I can, or handle standard NestJS JWT response which is usually { access_token: string }. 
  // Context says "ResponseInterceptor: success: true, data: {}, message: ...". 
  // So response will be { success: true, data: { access_token: string }, ... }
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
