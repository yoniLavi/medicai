import os
from datetime import datetime
from dotenv import load_dotenv
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions
from couchbase.auth import PasswordAuthenticator
from couchbase.exceptions import DocumentNotFoundException

load_dotenv()


class PatientMemory:
    def __init__(
        self,
        conn_str,
        username,
        password,
        bucket_name,
        scope_name="medicai",
    ):
        self.cluster = Cluster(
            conn_str, ClusterOptions(PasswordAuthenticator(username, password))
        )
        self.bucket = self.cluster.bucket(bucket_name)
        self.scope = self.bucket.scope(scope_name)
        self.collections = {
            "patients": self.scope.collection("patients"),
            "consultations": self.scope.collection("consultations"),
            "medications": self.scope.collection("medications"),
            "allergies": self.scope.collection("allergies"),
            "preferences": self.scope.collection("preferences"),
        }
        print("[Memory System] Connected to Couchbase medical database")

    def get_patient_profile(self, patient_id: int) -> dict:
        """Get complete patient profile from all collections"""
        try:
            # Get basic patient info
            patient_doc = (
                self.collections["patients"].get(str(patient_id)).content_as[dict]
            )

            # Get related data from other collections
            profile = {
                "patient_info": patient_doc,
                "consultations": self._get_patient_data("consultations", patient_id),
                "medications": self._get_patient_data("medications", patient_id),
                "allergies": self._get_patient_data("allergies", patient_id),
                "preferences": self._get_patient_data("preferences", patient_id),
            }

            print(
                f"[Memory System] Retrieved complete profile for patient {patient_id}"
            )
            return profile

        except DocumentNotFoundException:
            print(f"[Memory System] Patient {patient_id} not found")
            return None
        except Exception as e:
            print(f"[Memory System] Error retrieving patient {patient_id}: {e}")
            return None

    def _get_patient_data(self, collection_name: str, patient_id: int) -> list:
        """Get all documents for a patient from a specific collection"""
        try:
            query = f"SELECT * FROM `{self.bucket.name}`.{self.scope.name}.{collection_name} WHERE patient_id = $1"
            result = self.cluster.query(query, patient_id)
            return [row[collection_name] for row in result]
        except Exception as e:
            print(
                f"[Memory System] Error querying {collection_name} for patient {patient_id}: {e}"
            )
            return []

    def get_patient_by_name(self, name: str) -> dict:
        """Find patient by name (for CLI convenience)"""
        try:
            query = f"SELECT * FROM `{self.bucket.name}`.{self.scope.name}.patients WHERE LOWER(name) LIKE LOWER($1)"
            result = self.cluster.query(query, f"%{name}%")

            patients = [row["patients"] for row in result]
            if patients:
                return patients[0]  # Return first match
            return None

        except Exception as e:
            print(f"[Memory System] Error searching for patient '{name}': {e}")
            return None

    def add_consultation_note(self, patient_id: int, doctor: str, notes: str) -> bool:
        """Add a new consultation note for a patient"""
        try:
            consultation_id = f"{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            consultation = {
                "consultation_id": consultation_id,
                "patient_id": patient_id,
                "date": datetime.now().strftime("%Y-%m-%d"),
                "doctor": doctor,
                "notes": notes,
                "created_at": datetime.now().isoformat(),
            }

            self.collections["consultations"].upsert(consultation_id, consultation)
            print(f"[Memory System] Added consultation note for patient {patient_id}")
            return True

        except Exception as e:
            print(
                f"[Memory System] Error adding consultation for patient {patient_id}: {e}"
            )
            return False

    def add_medication(
        self,
        patient_id: int,
        medication: str,
        prescribed_date: str = None,
        status: str = "active",
    ) -> bool:
        """Add a new medication for a patient"""
        try:
            # Clean medication name for ID
            med_name_clean = medication.lower().replace(" ", "_").replace("-", "_")[:20]
            medication_id = (
                f"{patient_id}_{med_name_clean}_{datetime.now().strftime('%Y%m%d')}"
            )

            med_record = {
                "medication_id": medication_id,
                "patient_id": patient_id,
                "medication": medication,
                "prescribed_date": prescribed_date
                or datetime.now().strftime("%Y-%m-%d"),
                "status": status,
                "created_at": datetime.now().isoformat(),
            }

            self.collections["medications"].upsert(medication_id, med_record)
            print(
                f"[Memory System] Added medication '{medication}' for patient {patient_id}"
            )
            return True

        except Exception as e:
            print(
                f"[Memory System] Error adding medication for patient {patient_id}: {e}"
            )
            return False

    def add_allergy(
        self,
        patient_id: int,
        allergen: str,
        severity: str = "moderate",
        notes: str = "",
    ) -> bool:
        """Add a new allergy for a patient"""
        try:
            # Clean allergen name for ID
            allergen_clean = allergen.lower().replace(" ", "_").replace("-", "_")[:20]
            allergy_id = f"{patient_id}_{allergen_clean}"

            allergy_record = {
                "allergy_id": allergy_id,
                "patient_id": patient_id,
                "allergen": allergen,
                "severity": severity,
                "notes": notes,
                "created_at": datetime.now().isoformat(),
            }

            self.collections["allergies"].upsert(allergy_id, allergy_record)
            print(
                f"[Memory System] Added allergy '{allergen}' for patient {patient_id}"
            )
            return True

        except Exception as e:
            print(f"[Memory System] Error adding allergy for patient {patient_id}: {e}")
            return False

    def add_preference(
        self, patient_id: int, category: str, preference: str, notes: str = ""
    ) -> bool:
        """Add a new preference for a patient"""
        try:
            # Create unique preference ID
            pref_id = (
                f"{patient_id}_{category}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            )

            preference_record = {
                "preference_id": pref_id,
                "patient_id": patient_id,
                "category": category,
                "preference": preference,
                "notes": notes,
                "created_at": datetime.now().isoformat(),
            }

            self.collections["preferences"].upsert(pref_id, preference_record)
            print(
                f"[Memory System] Added preference for patient {patient_id}: {preference}"
            )
            return True

        except Exception as e:
            print(
                f"[Memory System] Error adding preference for patient {patient_id}: {e}"
            )
            return False

    def list_recent_patients(self, limit: int = 10) -> list:
        """Get list of patients ordered by most recent consultation"""
        try:
            query = f"""
            SELECT p.patient_id, p.name, MAX(c.date) as last_seen
            FROM `{self.bucket.name}`.{self.scope.name}.patients p
            LEFT JOIN `{self.bucket.name}`.{self.scope.name}.consultations c
            ON p.patient_id = c.patient_id
            GROUP BY p.patient_id, p.name
            ORDER BY last_seen DESC NULLS LAST
            LIMIT $1
            """
            result = self.cluster.query(query, limit)
            return [row for row in result]

        except Exception as e:
            print(f"[Memory System] Error listing recent patients: {e}")
            return []


# Initialize global patient memory instance
COUCHBASE_CONN_STR = os.getenv("COUCHBASE_CONN_STR")
COUCHBASE_USERNAME = os.getenv("COUCHBASE_USERNAME")
COUCHBASE_PASSWORD = os.getenv("COUCHBASE_PASSWORD")
COUCHBASE_BUCKET = os.getenv("COUCHBASE_BUCKET")

patient_memory = PatientMemory(
    conn_str=COUCHBASE_CONN_STR,
    username=COUCHBASE_USERNAME,
    password=COUCHBASE_PASSWORD,
    bucket_name=COUCHBASE_BUCKET,
)
