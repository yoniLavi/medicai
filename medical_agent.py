import sys
import io
from contextlib import redirect_stderr
from dotenv import load_dotenv

from google.adk.agents import Agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

from medical_tools import get_patient_brief, add_consultation_notes, list_recent_patients, update_patient_memory

# Load environment variables
load_dotenv()

def set_user_context(func, user_id: str):
    """Set user context for tool functions (similar to travel example)"""
    setattr(func, "user_id", user_id)

# Create the medical AI agent
medical_agent = Agent(
    name="medical_assistant",
    model="gemini-2.0-flash-exp",  # Using the latest Gemini model
    description="An AI medical assistant that helps doctors access patient information and manage consultation notes.",
    instruction="""
You are a professional medical AI assistant designed to help doctors prepare for consultations and manage patient records.

Your primary functions:
1. **Patient Briefs**: Generate comprehensive pre-consultation summaries using get_patient_brief
2. **Consultation Notes**: Help doctors add consultation notes using add_consultation_notes
3. **Patient Management**: List and search recent patients using list_recent_patients
4. **Update Patient Memory**: Flexibly add medications, allergies, preferences using update_patient_memory

Guidelines:
- Always prioritize patient privacy and confidentiality
- Provide clear, concise medical summaries focusing on relevant clinical information
- When generating patient briefs, highlight critical information like allergies, current medications, and recent concerns
- Format information in a way that's quickly scannable for busy doctors
- For consultation notes, ensure accurate recording of symptoms, assessments, and plans
- Use medical terminology appropriately but keep summaries accessible
- Be contextually aware: if you just discussed a particular patient(s), remember their IDs for follow-up questions
- When a doctor refers to a patient by first name or mentions "the last session with [name]", use the patient ID you know from context (unless there's ambiguity)

Patient Brief Workflow:
1. Use get_patient_brief with either patient ID (e.g., "12345") or patient name (e.g., "Brigid O'Sullivan")
2. Generate a structured summary highlighting:
   - Key demographics and medical history
   - Current medications and allergies
   - Recent consultations and concerns
   - Patient preferences for care

Consultation Notes Workflow:
1. Use add_consultation_notes with patient identifier, doctor name, and detailed notes
2. Include symptoms, assessment, treatment plan, and follow-up requirements
3. Confirm successful recording of notes

Patient Listing Workflow:
1. Use list_recent_patients to show recent patient activity
2. Help doctors identify patients for follow-up or review

Memory Update Workflow:
1. Listen for natural language requests to add medications, allergies, or preferences
2. Use update_patient_memory with appropriate memory_type:
   - For medications: "medication" (handles "prescribed", "started on", "taking", etc.)
   - For allergies: "allergy" (handles "allergic to", "reacts to", "can't tolerate", etc.)
   - For preferences: "preference" (handles "prefers", "likes", "wants", etc.)
3. Extract key information from natural phrasing
4. Include severity details for allergies when mentioned

Examples of flexible phrasing you should handle:
- "Patient is now taking metformin 500mg twice daily"
- "Add penicillin allergy - severe reaction"
- "She prefers afternoon appointments"
- "Started on lisinopril today"
- "He's allergic to latex"
- "Note that patient likes detailed explanations"

Remember: You are assisting healthcare professionals in providing better patient care through organized information access. Be flexible with how doctors phrase their updates.
""",
    tools=[get_patient_brief, add_consultation_notes, list_recent_patients, update_patient_memory],
)

# Session service for managing conversations
session_service = InMemorySessionService()
APP_NAME = "medicai_assistant"

# Runner for executing the agent
runner = Runner(
    agent=medical_agent,
    app_name=APP_NAME,
    session_service=session_service,
)

async def call_medical_agent(query: str, doctor_id: str, session_id: str):
    """
    Call the medical AI agent with a query

    Args:
        query: Doctor's question or request
        doctor_id: Identifier for the doctor
        session_id: Session identifier for conversation continuity

    Returns:
        AI agent's response
    """
    content = types.Content(role="user", parts=[types.Part(text=query)])

    # Set user context for tools (similar to travel example)
    set_user_context(get_patient_brief, doctor_id)
    set_user_context(add_consultation_notes, doctor_id)
    set_user_context(list_recent_patients, doctor_id)
    set_user_context(update_patient_memory, doctor_id)

    # Suppress warning messages from Google ADK about function calls
    stderr_capture = io.StringIO()

    with redirect_stderr(stderr_capture):
        async for event in runner.run_async(
            user_id=doctor_id, session_id=session_id, new_message=content
        ):
            if event.is_final_response() and event.content and event.content.parts:
                # Extract only text parts to avoid function call warnings
                text_parts = [part.text for part in event.content.parts if hasattr(part, 'text') and part.text]
                if text_parts:
                    return ''.join(text_parts)
                else:
                    # Fallback to first part if no text parts found
                    final_response = event.content.parts[0].text
                    return final_response

    return "No response received from medical assistant."

async def initialize_session(doctor_id: str, session_id: str):
    """Initialize the session service"""
    await session_service.create_session(
        app_name=APP_NAME, user_id=doctor_id, session_id=session_id
    )
