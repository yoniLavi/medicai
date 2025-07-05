from fastapi import APIRouter, HTTPException, Depends
from typing import Union
from datetime import datetime
import asyncio

from models import (
    ChatMessage, ChatResponse, ConsultationNoteRequest, MemoryUpdateRequest,
    APIResponse, PatientBriefResponse, RecentPatientsResponse, PatientProfile
)
from medical_tools import (
    get_patient_brief, add_consultation_notes, list_recent_patients, update_patient_memory
)
from medical_agent import call_medical_agent, initialize_session

router = APIRouter()

# Global identifiers for AI agent
DOCTOR_ID = "WebDoctor"
SESSION_ID = "web_session"

@router.get("/patients", response_model=RecentPatientsResponse)
async def get_recent_patients():
    """Get list of recent patients"""
    try:
        result = list_recent_patients()
        return RecentPatientsResponse(
            status=result["status"],
            recent_patients=result.get("recent_patients"),
            message=result.get("message")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patients/{patient_identifier}", response_model=PatientBriefResponse)
async def get_patient_profile(patient_identifier: Union[str, int]):
    """Get comprehensive patient profile by ID or name"""
    try:
        result = get_patient_brief(str(patient_identifier))
        return PatientBriefResponse(
            status=result["status"],
            patient_brief=result.get("patient_brief"),
            message=result.get("message")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/patients/{patient_identifier}/consultation", response_model=APIResponse)
async def add_consultation(
    patient_identifier: Union[str, int], 
    request: ConsultationNoteRequest
):
    """Add consultation notes for a patient"""
    try:
        result = add_consultation_notes(
            str(patient_identifier), 
            request.doctor_name, 
            request.notes
        )
        return APIResponse(
            status=result["status"],
            message=result["message"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/patients/{patient_identifier}/memory", response_model=APIResponse)
async def update_memory(
    patient_identifier: Union[str, int],
    request: MemoryUpdateRequest
):
    """Update patient memory (medications, allergies, preferences)"""
    try:
        result = update_patient_memory(
            str(patient_identifier),
            request.memory_type,
            request.content,
            request.additional_details
        )
        return APIResponse(
            status=result["status"],
            message=result["message"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatMessage):
    """Chat with the AI medical assistant"""
    try:
        # Initialize session if it doesn't exist
        try:
            await initialize_session(DOCTOR_ID, SESSION_ID)
        except Exception as init_error:
            # Session might already exist, which is fine
            print(f"Session initialization note: {init_error}")
        
        # Use the existing medical agent
        response = await call_medical_agent(
            query=request.message,
            doctor_id=DOCTOR_ID,
            session_id=SESSION_ID
        )
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI chat error: {str(e)}")

@router.get("/patients/{patient_identifier}/brief", response_model=ChatResponse)
async def get_patient_brief_ai(patient_identifier: Union[str, int]):
    """Get AI-generated patient brief for consultation prep"""
    try:
        # Initialize session if it doesn't exist
        try:
            await initialize_session(DOCTOR_ID, SESSION_ID)
        except Exception as init_error:
            print(f"Session initialization note: {init_error}")
        
        query = f"Generate a brief for patient {patient_identifier}"
        response = await call_medical_agent(
            query=query,
            doctor_id=DOCTOR_ID,
            session_id=SESSION_ID
        )
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Brief generation error: {str(e)}")

@router.post("/patients/{patient_identifier}/consultation-prep", response_model=ChatResponse)
async def get_consultation_prep(patient_identifier: Union[str, int]):
    """Get AI-generated consultation preparation"""
    try:
        # Initialize session if it doesn't exist
        try:
            await initialize_session(DOCTOR_ID, SESSION_ID)
        except Exception as init_error:
            print(f"Session initialization note: {init_error}")
        
        query = f"Prepare me for consultation with patient {patient_identifier}. Give me key points, alerts, and suggested questions."
        response = await call_medical_agent(
            query=query,
            doctor_id=DOCTOR_ID,
            session_id=SESSION_ID
        )
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Consultation prep error: {str(e)}")