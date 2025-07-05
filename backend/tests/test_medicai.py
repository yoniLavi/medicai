"""
Test suite for MedicAI patient memory system
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from patient_memory import patient_memory
from medical_tools import (
    get_patient_brief,
    add_consultation_notes,
    list_recent_patients,
)


def test_get_patient_profile_by_id():
    """Test retrieving patient profile by numeric ID"""
    profile = patient_memory.get_patient_profile(12345)

    assert profile is not None
    assert profile["patient_info"]["name"] == "Brigid O'Sullivan"
    assert profile["patient_info"]["patient_id"] == 12345
    assert "consultations" in profile
    assert "medications" in profile
    assert "allergies" in profile
    assert "preferences" in profile


def test_get_patient_profile_not_found():
    """Test retrieving non-existent patient"""
    profile = patient_memory.get_patient_profile(99999)
    assert profile is None


def test_get_patient_by_name():
    """Test finding patient by name"""
    patient = patient_memory.get_patient_by_name("Brigid O'Sullivan")

    assert patient is not None
    assert patient["patient_id"] == 12345
    assert patient["name"] == "Brigid O'Sullivan"


def test_get_patient_by_partial_name():
    """Test finding patient by partial name"""
    patient = patient_memory.get_patient_by_name("Cian")

    assert patient is not None
    assert patient["patient_id"] == 12346
    assert "Cian Murphy" in patient["name"]


def test_get_patient_by_name_not_found():
    """Test searching for non-existent patient name"""
    patient = patient_memory.get_patient_by_name("NonExistent Patient")
    assert patient is None


def test_list_recent_patients():
    """Test listing recent patients"""
    patients = patient_memory.list_recent_patients(limit=5)

    assert isinstance(patients, list)
    assert len(patients) <= 5
    assert len(patients) >= 3  # We have 3 patients in mock data

    # Check structure of returned data
    if patients:
        patient = patients[0]
        assert "patient_id" in patient
        assert "name" in patient


def test_get_patient_brief_by_id():
    """Test getting patient brief by ID"""
    result = get_patient_brief("12345")

    assert result["status"] == "success"
    assert "patient_brief" in result
    assert result["patient_brief"]["patient_info"]["name"] == "Brigid O'Sullivan"


def test_get_patient_brief_by_name():
    """Test getting patient brief by name"""
    result = get_patient_brief("Orla Flanagan")

    assert result["status"] == "success"
    assert "patient_brief" in result
    assert result["patient_brief"]["patient_info"]["patient_id"] == 12347


def test_get_patient_brief_not_found():
    """Test getting brief for non-existent patient"""
    result = get_patient_brief("99999")

    assert result["status"] == "error"
    assert "not found" in result["message"].lower()


def test_add_consultation_notes_by_id():
    """Test adding consultation notes by patient ID"""
    result = add_consultation_notes(
        "12346", "Dr. Test", "Test consultation notes for automated testing"
    )

    assert result["status"] == "success"
    assert "notes added" in result["message"].lower()


def test_add_consultation_notes_by_name():
    """Test adding consultation notes by patient name"""
    result = add_consultation_notes(
        "Cian Murphy", "Dr. Test", "Another test consultation note"
    )

    assert result["status"] == "success"
    assert "notes added" in result["message"].lower()


def test_add_consultation_notes_patient_not_found():
    """Test adding notes for non-existent patient"""
    result = add_consultation_notes("99999", "Dr. Test", "This should fail")

    assert result["status"] == "error"
    assert "not found" in result["message"].lower()


def test_list_recent_patients_tool():
    """Test the list recent patients tool function"""
    result = list_recent_patients()

    assert result["status"] == "success"
    assert "recent_patients" in result
    assert isinstance(result["recent_patients"], list)
    assert len(result["recent_patients"]) >= 3


def test_all_patients_have_required_fields():
    """Test that all patients have required fields"""
    patients = patient_memory.list_recent_patients(limit=10)

    for patient in patients:
        assert "patient_id" in patient
        assert "name" in patient
        assert isinstance(patient["patient_id"], int)
        assert isinstance(patient["name"], str)


def test_consultation_notes_persist():
    """Test that added consultation notes are retrievable"""
    # Add a test note
    add_result = add_consultation_notes(
        "12345", "Dr. Test Persistence", "Testing note persistence"
    )
    assert add_result["status"] == "success"

    # Retrieve and verify the note exists
    brief_result = get_patient_brief("12345")
    assert brief_result["status"] == "success"

    consultations = brief_result["patient_brief"]["consultations"]
    test_notes = [c for c in consultations if c.get("doctor") == "Dr. Test Persistence"]
    assert len(test_notes) >= 1
    assert "Testing note persistence" in test_notes[0]["notes"]


def test_add_medication():
    """Test adding a medication to patient memory"""
    result = patient_memory.add_medication(12345, "Aspirin 100mg daily")
    assert result == True

    # Verify it was added
    profile = patient_memory.get_patient_profile(12345)
    medications = profile["medications"]
    aspirin_meds = [m for m in medications if "Aspirin" in m.get("medication", "")]
    assert len(aspirin_meds) >= 1


def test_add_allergy():
    """Test adding an allergy to patient memory"""
    result = patient_memory.add_allergy(12345, "Pollen", "mild", "Seasonal hay fever")
    assert result == True

    # Verify it was added
    profile = patient_memory.get_patient_profile(12345)
    allergies = profile["allergies"]
    pollen_allergies = [a for a in allergies if a.get("allergen") == "Pollen"]
    assert len(pollen_allergies) >= 1
    assert pollen_allergies[0]["severity"] == "mild"


def test_add_preference():
    """Test adding a preference to patient memory"""
    result = patient_memory.add_preference(
        12345, "communication", "Email reminders preferred"
    )
    assert result == True

    # Verify it was added
    profile = patient_memory.get_patient_profile(12345)
    preferences = profile["preferences"]
    email_prefs = [p for p in preferences if "Email" in p.get("preference", "")]
    assert len(email_prefs) >= 1


def test_update_patient_memory_flexible():
    """Test the flexible update_patient_memory tool"""
    from medical_tools import update_patient_memory

    # Test medication update
    result = update_patient_memory("12346", "medication", "Ibuprofen 400mg as needed")
    assert result["status"] == "success"
    assert "medication" in result["message"]

    # Test allergy update with severity
    result = update_patient_memory("12346", "allergy", "Shellfish", "severe reaction")
    assert result["status"] == "success"
    assert "allergy" in result["message"]

    # Test preference update
    result = update_patient_memory("12346", "preference", "Prefers video consultations")
    assert result["status"] == "success"
    assert "preference" in result["message"]
