from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime

# Request models
class ChatMessage(BaseModel):
    message: str
    patient_id: Optional[int] = None

class ConsultationNoteRequest(BaseModel):
    doctor_name: str
    notes: str

class MemoryUpdateRequest(BaseModel):
    memory_type: str  # "medication", "allergy", "preference", "consultation"
    content: str
    additional_details: Optional[str] = ""

# Response models
class PatientInfo(BaseModel):
    patient_id: int
    name: str
    date_of_birth: Optional[str] = None
    created_at: Optional[str] = None
    last_updated: Optional[str] = None
    medical_history: Optional[List[str]] = []

class Consultation(BaseModel):
    consultation_id: str
    patient_id: int
    date: str
    doctor: str
    notes: str
    created_at: Optional[str] = None

class Medication(BaseModel):
    medication_id: str
    patient_id: int
    medication: str
    prescribed_date: str
    status: str
    created_at: Optional[str] = None

class Allergy(BaseModel):
    allergy_id: str
    patient_id: int
    allergen: str
    severity: str
    notes: str
    created_at: Optional[str] = None

class Preference(BaseModel):
    preference_id: str
    patient_id: int
    category: str
    preference: str
    notes: str
    created_at: Optional[str] = None

class PatientProfile(BaseModel):
    patient_info: PatientInfo
    consultations: List[Consultation]
    medications: List[Medication]
    allergies: List[Allergy]
    preferences: List[Preference]

class RecentPatient(BaseModel):
    patient_id: int
    name: str
    last_seen: Optional[str] = None

class APIResponse(BaseModel):
    status: str
    message: Optional[str] = None
    data: Optional[Any] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: str

class PatientBriefResponse(BaseModel):
    status: str
    patient_brief: Optional[PatientProfile] = None
    message: Optional[str] = None

class RecentPatientsResponse(BaseModel):
    status: str
    recent_patients: Optional[List[RecentPatient]] = None
    message: Optional[str] = None