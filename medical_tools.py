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

def update_patient_memory(patient_identifier: str, memory_type: str, content: str, additional_details: str = "") -> dict:
    """
    Flexible tool to update various types of patient memory.
    
    Args:
        patient_identifier: Either patient ID (number) or patient name (string)
        memory_type: Type of memory to update - "medication", "allergy", "preference", or "consultation"
        content: The main content to add (medication name, allergen, preference, or consultation notes)
        additional_details: Optional additional details (severity, category, notes, etc.)
    
    Returns:
        Dictionary with success status and message
    """
    try:
        # Get patient ID
        try:
            patient_id = int(patient_identifier)
        except ValueError:
            patient_info = patient_memory.get_patient_by_name(patient_identifier)
            if patient_info:
                patient_id = patient_info['patient_id']
            else:
                return {
                    "status": "error",
                    "message": f"Patient not found: {patient_identifier}"
                }
        
        # Route to appropriate update method based on memory type
        memory_type_lower = memory_type.lower()
        
        if "medic" in memory_type_lower or "drug" in memory_type_lower or "prescription" in memory_type_lower:
            success = patient_memory.add_medication(patient_id, content)
            memory_desc = "medication"
            
        elif "allerg" in memory_type_lower or "reaction" in memory_type_lower:
            # Parse severity from additional details if provided
            severity = "moderate"  # default
            if additional_details:
                if "severe" in additional_details.lower() or "serious" in additional_details.lower():
                    severity = "severe"
                elif "mild" in additional_details.lower() or "minor" in additional_details.lower():
                    severity = "mild"
            
            success = patient_memory.add_allergy(patient_id, content, severity, additional_details)
            memory_desc = "allergy"
            
        elif "prefer" in memory_type_lower or "like" in memory_type_lower or "want" in memory_type_lower:
            # Determine category from content or details
            category = "general"
            if "appointment" in content.lower() or "scheduling" in content.lower():
                category = "scheduling"
            elif "communicat" in content.lower() or "contact" in content.lower():
                category = "communication"
            elif "treatment" in content.lower() or "care" in content.lower():
                category = "treatment"
                
            success = patient_memory.add_preference(patient_id, category, content, additional_details)
            memory_desc = "preference"
            
        elif "consult" in memory_type_lower or "note" in memory_type_lower or "visit" in memory_type_lower:
            # This is a consultation note
            doctor_name = additional_details if additional_details else "Dr. Unknown"
            success = patient_memory.add_consultation_note(patient_id, doctor_name, content)
            memory_desc = "consultation note"
            
        else:
            return {
                "status": "error",
                "message": f"Unknown memory type: {memory_type}. Use 'medication', 'allergy', 'preference', or 'consultation'."
            }
        
        if success:
            return {
                "status": "success",
                "message": f"Successfully added {memory_desc} for patient {patient_id}"
            }
        else:
            return {
                "status": "error",
                "message": f"Failed to add {memory_desc}"
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error updating patient memory: {str(e)}"
        }