# MedicAI - AI-Powered Medical Memory System

A proof-of-concept CLI tool that provides doctors with AI-generated patient briefs and maintains a shared memory across consultations.

## Problem

When patients visit new doctors or return after long periods, doctors lack context about the patient's history, preferences, and previous discussions. Traditional medical records are often incomplete, hard to access, or time-consuming to review.

## Solution

An AI-powered memory system that:
- Generates instant patient briefs before consultations
- Maintains context across different doctors and visits
- Updates patient memory after each consultation
- Provides natural language interface for doctors

## Architecture

**Doctor CLI** -> **AI Agent** -> **Patient Memory**

- Doctor CLI: Get brief, Add notes, List patients
- AI Agent: Generate summaries, Save updates
- Patient Memory: JSON storage, Categories, History

## Core Components

### 1. Patient Memory (PatientMemory)
- **Storage**: JSON files per patient (data/patients/{patient_id}.json)
- **Categories**: medical_history, preferences, consultations, medications, allergies
- **Operations**: Add data, retrieve by category, get full profile

### 2. AI Agent (MedicalAssistant)
- **Model**: Gemini/Claude for generating briefs
- **Tools**: Save patient info, retrieve patient data, generate summaries
- **Prompts**: Specialized for medical context and privacy

### 3. CLI Interface
- Interactive chat-based interface
- Commands for different workflows
- Session management per doctor

## Usage

### Getting Patient Brief
```bash
# Start interactive session
uv run main.py

> brief for John Smith
Patient Brief for John Smith:
- 45-year-old male with history of hypertension
- Prefers morning appointments
- Last visit: discussed medication compliance
- Current medications: Lisinopril 10mg daily
- Allergies: Penicillin
```

### Adding Consultation Notes
```bash
> update John Smith: Patient reports improved blood pressure readings, wants to discuss exercise routine next visit
Updated patient memory for John Smith
```

### Listing Patients
```bash
> list patients
Recent Patients:
- John Smith (last seen: 2 days ago)
- Sarah Johnson (last seen: 1 week ago)
- Mike Davis (last seen: 2 weeks ago)
```

## Data Structure

```json
{
  "patient_id": "john_smith",
  "name": "John Smith",
  "created_at": "2024-01-15T10:30:00Z",
  "last_updated": "2024-01-20T14:15:00Z",
  "categories": {
    "medical_history": [
      "Hypertension diagnosed 2019",
      "Family history of diabetes"
    ],
    "preferences": [
      "Prefers morning appointments",
      "Likes detailed explanations"
    ],
    "consultations": [
      {
        "date": "2024-01-20",
        "doctor": "Dr. Williams",
        "notes": "Discussed medication compliance"
      }
    ],
    "medications": [
      "Lisinopril 10mg daily"
    ],
    "allergies": [
      "Penicillin"
    ]
  }
}
```

## Setup

```bash
# Install dependencies
uv sync

# Set up environment
cp .env.example .env
# Add your Couchbase and AI API credentials

# Run
uv run main.py
```

## Demo Flow

1. **Doctor starts consultation**: `brief for John Smith`
2. **AI generates summary**: Based on all historical data
3. **Doctor conducts appointment**: Using the context provided
4. **Doctor adds notes**: `update John Smith: [consultation notes]`
5. **Memory updated**: Ready for next doctor/visit

## Future Enhancements

- Web interface
- Integration with existing EHR systems
- Advanced search and filtering
- Multi-doctor collaboration features
- Patient consent management
- Encryption and security features
