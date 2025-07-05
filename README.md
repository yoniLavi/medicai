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

- Doctor CLI: Interactive CLI in `backend/cli.py`
- AI Agent: Generate summaries, Save updates
- Patient Memory: Couchbase collections (patients, consultations, medications, allergies, preferences)

## Project Structure

```
medicai/
├── backend/
│   ├── cli.py              # Main CLI interface
│   ├── medical_agent.py    # AI agent with Gemini 2.0
│   ├── medical_tools.py    # Tool functions for AI agent
│   ├── patient_memory.py   # Couchbase data layer
│   ├── scripts/
│   │   ├── mock_data/
│   │   │   └── patients.json
│   │   └── reset_couchbase_data.py
│   └── tests/
│       └── test_medicai.py
├── README.md
├── pyproject.toml
└── uv.lock
```

## Core Components

### 1. Patient Memory (PatientMemory)
- **Storage**: Couchbase collections in medicai scope
- **Collections**: patients, consultations, medications, allergies, preferences
- **Operations**: Add data, retrieve by collection, get full patient profile

### 2. AI Agent (MedicalAssistant)
- **Model**: Gemini 2.0 Flash for generating briefs and natural language processing
- **Tools**: Patient brief generation, consultation notes, memory updates, patient listing
- **Prompts**: Specialized for medical context and privacy
- **Features**: Natural language processing for flexible memory updates

### 3. CLI Interface
- Interactive chat-based interface
- Natural language commands for all workflows
- Session management per doctor
- Support for Ctrl+D exit and error handling

## Usage

### Getting Patient Brief
```bash
# Start interactive session
uv run backend/cli.py

> brief for patient 12345
Patient Brief for John Smith (ID: 12345):
- 45-year-old male with history of hypertension
- Prefers morning appointments
- Last visit: discussed medication compliance
- Current medications: Lisinopril 10mg daily
- Allergies: Penicillin
```

### Adding Consultation Notes
```bash
> update patient 12345: Patient reports improved blood pressure readings, wants to discuss exercise routine next visit
Updated patient memory for patient 12345
```

### Updating Patient Memory
```bash
> Brigid is now taking metformin 500mg twice daily
> add penicillin allergy for patient 12345
> patient prefers morning appointments
> Cian is allergic to latex - severe reaction
```

### Listing Patients
```bash
> list patients
Recent Patients:
- John Smith (ID: 12345, last seen: 2 days ago)
- Sarah Johnson (ID: 12346, last seen: 1 week ago)
- Mike Davis (ID: 12347, last seen: 2 weeks ago)
```

## Data Structure

### Collections Schema

**patients collection:**
```json
{
  "patient_id": 12345,
  "name": "John Smith",
  "date_of_birth": "1979-03-15",
  "created_at": "2024-01-15T10:30:00Z",
  "last_updated": "2024-01-20T14:15:00Z",
  "medical_history": [
    "Hypertension diagnosed 2019",
    "Family history of diabetes"
  ]
}
```

**consultations collection:**
```json
{
  "consultation_id": "12345_20240120",
  "patient_id": 12345,
  "date": "2024-01-20",
  "doctor": "Dr. Williams",
  "notes": "Discussed medication compliance",
  "created_at": "2024-01-20T14:15:00Z"
}
```

**medications collection:**
```json
{
  "medication_id": "12345_lisinopril",
  "patient_id": 12345,
  "medication": "Lisinopril 10mg daily",
  "prescribed_date": "2024-01-01",
  "status": "active"
}
```

**allergies collection:**
```json
{
  "allergy_id": "12345_penicillin",
  "patient_id": 12345,
  "allergen": "Penicillin",
  "severity": "severe",
  "notes": "Causes rash and breathing difficulties"
}
```

**preferences collection:**
```json
{
  "preference_id": "12345_scheduling",
  "patient_id": 12345,
  "category": "scheduling",
  "preference": "Prefers morning appointments",
  "notes": "Works best with 9-11am slots"
}
```

## Setup

```bash
# Install dependencies
uv sync

# Set up environment
cp .env.example .env
# Add your Couchbase and AI API credentials

# Load mock data (optional)
if false ; then 
  uv run backend/scripts/reset_couchbase_data.py
fi

# Run tests
uv run pytest backend/tests/test_medicai.py -v

# Run the CLI
uv run backend/cli.py
```

## Development Status

### ✅ Completed
- **Couchbase Integration**: Multi-collection schema with patient data
- **PatientMemory Class**: Data retrieval and storage operations
- **Medical Tools**: Patient brief generation, consultation notes, patient listing, flexible memory updates
- **AI Agent**: Gemini 2.0 Flash-based medical assistant with natural language processing
- **CLI Interface**: Interactive chat interface with session management
- **Mock Data**: Realistic patient personas (Brigid, Cian, Orla)
- **Test Suite**: 15 comprehensive tests with full coverage

### 🎯 Ready for Next Phase
- **Web Frontend Integration**: System ready for web interface development

### 📋 Testing
```bash
# Run all tests
uv run pytest backend/tests/test_medicai.py -v

# Test specific functionality
cd backend && uv run python -c "from medical_tools import get_patient_brief; result = get_patient_brief('12345'); print(result)"
```

## Demo Flow (Target)

1. **Doctor starts consultation**: `brief for patient 12345`
2. **AI generates summary**: Based on all historical data
3. **Doctor conducts appointment**: Using the context provided
4. **Doctor adds notes**: `update patient 12345: [consultation notes]`
5. **Memory updated**: Ready for next doctor/visit

## Future Enhancements

- Web interface
- Integration with existing EHR systems
- Advanced search and filtering
- Multi-doctor collaboration features
- Patient consent management
- Encryption and security features
