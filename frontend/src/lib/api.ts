const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Types matching backend models
export interface PatientInfo {
  patient_id: number;
  name: string;
  date_of_birth?: string;
  created_at?: string;
  last_updated?: string;
  medical_history?: string[];
}

export interface Consultation {
  consultation_id: string;
  patient_id: number;
  date: string;
  doctor: string;
  notes: string;
  created_at: string;
}

export interface Medication {
  medication_id: string;
  patient_id: number;
  medication: string;
  prescribed_date: string;
  status: string;
  created_at: string;
}

export interface Allergy {
  allergy_id: string;
  patient_id: number;
  allergen: string;
  severity: string;
  notes: string;
  created_at: string;
}

export interface Preference {
  preference_id: string;
  patient_id: number;
  category: string;
  preference: string;
  notes: string;
  created_at: string;
}

export interface PatientProfile {
  patient_info: PatientInfo;
  consultations: Consultation[];
  medications: Medication[];
  allergies: Allergy[];
  preferences: Preference[];
}

export interface RecentPatient {
  patient_id: number;
  name: string;
  last_seen?: string;
}

export interface APIResponse {
  status: string;
  message?: string;
  data?: any;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export interface PatientBriefResponse {
  status: string;
  patient_brief?: PatientProfile;
  message?: string;
}

export interface RecentPatientsResponse {
  status: string;
  recent_patients?: RecentPatient[];
  message?: string;
}

// API client class
class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    console.log('📡 Base URL:', this.baseURL);
    console.log('🔗 Full URL:', url);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log('⚙️ Request config:', config);

    try {
      console.log('📤 Sending request...');
      const response = await fetch(url, config);
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Response data:', data);
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      console.error('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        url,
        baseURL: this.baseURL
      });
      throw error;
    }
  }

  // Patient endpoints
  async getRecentPatients(): Promise<RecentPatientsResponse> {
    return this.request<RecentPatientsResponse>('/patients');
  }

  async getPatientProfile(patientId: string | number): Promise<PatientBriefResponse> {
    return this.request<PatientBriefResponse>(`/patients/${patientId}`);
  }

  async addConsultationNotes(
    patientId: string | number, 
    doctorName: string, 
    notes: string
  ): Promise<APIResponse> {
    return this.request<APIResponse>(`/patients/${patientId}/consultation`, {
      method: 'POST',
      body: JSON.stringify({
        doctor_name: doctorName,
        notes: notes,
      }),
    });
  }

  async updatePatientMemory(
    patientId: string | number,
    memoryType: 'medication' | 'allergy' | 'preference' | 'consultation',
    content: string,
    additionalDetails: string = ''
  ): Promise<APIResponse> {
    return this.request<APIResponse>(`/patients/${patientId}/memory`, {
      method: 'POST',
      body: JSON.stringify({
        memory_type: memoryType,
        content: content,
        additional_details: additionalDetails,
      }),
    });
  }

  // AI endpoints
  async chatWithAI(message: string, patientId?: number): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: message,
        patient_id: patientId,
      }),
    });
  }

  async getPatientBriefAI(patientId: string | number): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/patients/${patientId}/brief`);
  }

  async getConsultationPrep(patientId: string | number): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/patients/${patientId}/consultation-prep`, {
      method: 'POST',
    });
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Test connectivity function
export const testConnection = async () => {
  try {
    const response = await fetch('/api/v1/patients');
    console.log('🔗 Direct fetch test:', response.status, response.statusText);
    const data = await response.json();
    console.log('📋 Direct fetch data:', data);
    return data;
  } catch (error) {
    console.error('❌ Direct fetch failed:', error);
    throw error;
  }
};

// Export individual functions for easier use (bound to maintain 'this' context)
export const getRecentPatients = () => apiClient.getRecentPatients();
export const getPatientProfile = (patientId: string | number) => apiClient.getPatientProfile(patientId);
export const addConsultationNotes = (patientId: string | number, doctorName: string, notes: string) => 
  apiClient.addConsultationNotes(patientId, doctorName, notes);
export const updatePatientMemory = (
  patientId: string | number,
  memoryType: 'medication' | 'allergy' | 'preference' | 'consultation',
  content: string,
  additionalDetails: string = ''
) => apiClient.updatePatientMemory(patientId, memoryType, content, additionalDetails);
export const chatWithAI = (message: string, patientId?: number) => apiClient.chatWithAI(message, patientId);
export const getPatientBriefAI = (patientId: string | number) => apiClient.getPatientBriefAI(patientId);
export const getConsultationPrep = (patientId: string | number) => apiClient.getConsultationPrep(patientId);