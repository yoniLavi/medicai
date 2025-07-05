#!/usr/bin/env python3
"""
Reset Couchbase Data Script
Deletes all existing data in collections and loads mock patient data.
"""

import os
import json
import sys
from pathlib import Path
from dotenv import load_dotenv
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions
from couchbase.auth import PasswordAuthenticator
from couchbase.exceptions import DocumentNotFoundException

# Load environment variables
load_dotenv()


def connect_to_couchbase():
    """Connect to Couchbase cluster and return bucket/scope references"""
    conn_str = os.getenv("COUCHBASE_CONN_STR")
    username = os.getenv("COUCHBASE_USERNAME")
    password = os.getenv("COUCHBASE_PASSWORD")
    bucket_name = os.getenv("COUCHBASE_BUCKET")

    if not all([conn_str, username, password, bucket_name]):
        raise ValueError("Missing required Couchbase environment variables")

    cluster = Cluster(
        conn_str, ClusterOptions(PasswordAuthenticator(username, password))
    )
    bucket = cluster.bucket(bucket_name)
    scope = bucket.scope("medicai")

    return cluster, scope


def clear_collection(scope, collection_name, cluster, bucket_name):
    """Clear all documents from a collection"""
    print(f"Clearing {collection_name} collection...")
    collection = scope.collection(collection_name)

    try:
        # Query to get all document IDs in the collection
        query = f"SELECT META().id FROM `{bucket_name}`.medicai.{collection_name}"
        result = cluster.query(query)

        doc_ids = [row["id"] for row in result]
        print(f"Found {len(doc_ids)} documents in {collection_name}")

        # Delete each document
        for doc_id in doc_ids:
            try:
                collection.remove(doc_id)
            except DocumentNotFoundException:
                pass  # Document already deleted

        print(f"✅ Cleared {len(doc_ids)} documents from {collection_name}")

    except Exception as e:
        print(f"⚠️  Error clearing {collection_name}: {e}")


def load_mock_data(scope, data_file_path):
    """Load mock data from JSON file into collections"""
    print(f"Loading mock data from {data_file_path}...")

    with open(data_file_path, "r") as f:
        data = json.load(f)

    collections = {
        "patients": scope.collection("patients"),
        "consultations": scope.collection("consultations"),
        "medications": scope.collection("medications"),
        "allergies": scope.collection("allergies"),
        "preferences": scope.collection("preferences"),
    }

    # Load data for each collection
    for collection_name, collection_obj in collections.items():
        if collection_name in data:
            items = data[collection_name]
            print(f"Loading {len(items)} items into {collection_name}...")

            for item in items:
                # Determine document ID based on collection type
                if collection_name == "patients":
                    doc_id = str(item["patient_id"])
                elif collection_name == "consultations":
                    doc_id = item["consultation_id"]
                elif collection_name == "medications":
                    doc_id = item["medication_id"]
                elif collection_name == "allergies":
                    doc_id = item["allergy_id"]
                elif collection_name == "preferences":
                    doc_id = item["preference_id"]

                try:
                    collection_obj.upsert(doc_id, item)
                except Exception as e:
                    print(f"Error inserting {doc_id}: {e}")

            print(f"✅ Loaded {len(items)} items into {collection_name}")


def main():
    """Main function to reset Couchbase data"""
    print("🔄 MedicAI - Resetting Couchbase Data")
    print("=" * 50)

    try:
        # Connect to Couchbase
        cluster, scope = connect_to_couchbase()
        bucket_name = os.getenv("COUCHBASE_BUCKET")
        print("✅ Connected to Couchbase")

        # Clear all collections
        collections_to_clear = [
            "patients",
            "consultations",
            "medications",
            "allergies",
            "preferences",
        ]
        for collection_name in collections_to_clear:
            clear_collection(scope, collection_name, cluster, bucket_name)

        print("\n📥 Loading mock data...")

        # Load mock data
        script_dir = Path(__file__).parent
        data_file = script_dir / "mock_data" / "patients.json"

        if not data_file.exists():
            print(f"❌ Mock data file not found: {data_file}")
            sys.exit(1)

        load_mock_data(scope, data_file)

        print("\n🎉 Data reset complete!")
        print("\nLoaded patients:")
        print("- Brigid O'Sullivan (ID: 12345) - 72yo, from Kerry, diabetes")
        print("- Cian Murphy (ID: 12346) - 20yo, UCD student, from Sligo")
        print("- Orla Flanagan (ID: 12347) - 33yo, UX Designer, from Cork")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
