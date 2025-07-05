from patient_memory import patient_memory

def get_patient_brief(patient_identifier: str) -> dict:
    """
    Get comprehensive patient brief for consultation preparation.
    
    Args:
        patient_identifier: Either patient ID (number) or patient name (string)
    
    Returns:
        Dictionary with patient brief information or error message
    """
    try:
        # Try to parse as patient ID first
        try:
            patient_id = int(patient_identifier)
            profile = patient_memory.get_patient_profile(patient_id)
        except ValueError:
            # If not a number, search by name
            patient_info = patient_memory.get_patient_by_name(patient_identifier)
            if patient_info:
                profile = patient_memory.get_patient_profile(patient_info['patient_id'])
            else:
                return {
                    "status": "error",
                    "message": f"Patient not found: {patient_identifier}"
                }
        
        if not profile:
            return {
                "status": "error", 
                "message": f"Patient not found: {patient_identifier}"
            }
        
        return {
            "status": "success",
            "patient_brief": profile
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error retrieving patient brief: {str(e)}"
        }

def add_consultation_notes(patient_identifier: str, doctor_name: str, notes: str) -> dict:
    """
    Add consultation notes for a patient.
    
    Args:
        patient_identifier: Either patient ID (number) or patient name (string)
        doctor_name: Name of the consulting doctor
        notes: Consultation notes and observations
    
    Returns:
        Dictionary with success status and message
    """
    try:
        # Try to parse as patient ID first
        try:
            patient_id = int(patient_identifier)
            # Verify patient exists
            if not patient_memory.get_patient_profile(patient_id):
                return {
                    "status": "error",
                    "message": f"Patient not found: {patient_identifier}"
                }
        except ValueError:
            # If not a number, search by name to get ID
            patient_info = patient_memory.get_patient_by_name(patient_identifier)
            if patient_info:
                patient_id = patient_info['patient_id']
            else:
                return {
                    "status": "error",
                    "message": f"Patient not found: {patient_identifier}"
                }
        
        success = patient_memory.add_consultation_note(patient_id, doctor_name, notes)
        
        if success:
            return {
                "status": "success",
                "message": f"Consultation notes added for patient {patient_id}"
            }
        else:
            return {
                "status": "error", 
                "message": "Failed to add consultation notes"
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error adding consultation notes: {str(e)}"
        }

def list_recent_patients() -> dict:
    """
    Get list of recent patients ordered by last consultation date.
    
    Returns:
        Dictionary with list of recent patients
    """
    try:
        patients = patient_memory.list_recent_patients(limit=10)
        return {
            "status": "success",
            "recent_patients": patients
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error listing patients: {str(e)}"
        }