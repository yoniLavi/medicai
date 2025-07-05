import os
import asyncio
from dotenv import load_dotenv
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions
from couchbase.auth import PasswordAuthenticator

from medical_agent import call_medical_agent, initialize_session

# Load environment variables
load_dotenv()

# Global identifiers
DOCTOR_ID = "Jones"
SESSION_ID = "session_001"


def test_couchbase_connection():
    """Test basic Couchbase connection and query"""
    try:
        # Connect to Couchbase
        conn_str = os.getenv("COUCHBASE_CONN_STR")
        username = os.getenv("COUCHBASE_USERNAME")
        password = os.getenv("COUCHBASE_PASSWORD")
        bucket_name = os.getenv("COUCHBASE_BUCKET")

        cluster = Cluster(
            conn_str, ClusterOptions(PasswordAuthenticator(username, password))
        )

        # Test query first - this doesn't require bucket access
        result = cluster.query("SELECT 1 as test")
        list(result)  # Consume the result to test connection

        # Test bucket access
        bucket = cluster.bucket(bucket_name)
        scope = bucket.scope("medicai")

        # Test access to all required collections
        collections = [
            "patients",
            "consultations",
            "medications",
            "allergies",
            "preferences",
        ]
        for collection_name in collections:
            scope.collection(collection_name)

        return True

    except Exception as e:
        print(f"❌ Couchbase connection failed: {e}")
        return False


async def interactive_medical_chat():
    """
    Interactive chat session with the medical AI assistant
    """
    print("=" * 60)
    print("🏥 MedicAI - Medical Assistant")
    print("=" * 60)
    print("Welcome, Doctor! I'm here to help you access patient information")
    print("and manage consultation notes efficiently.")
    print("")
    print("Commands you can try:")
    print("- 'brief for patient 12345' or 'brief for Brigid O'Sullivan'")
    print("- 'list recent patients'")
    print("- 'update patient 12345: [consultation notes]'")
    print("- 'patient is now taking metformin 500mg'")
    print("- 'add penicillin allergy for patient 12345'")
    print("- 'Brigid prefers morning appointments'")
    print("- Type 'quit' to exit")
    print("=" * 60)

    while True:
        try:
            user_query = input("\n🔍 Doctor > ").strip()

            if user_query.lower() in ["quit", "exit", "bye"]:
                print("\n👋 Thank you for using MedicAI. Have a great day!")
                break

            if not user_query:
                continue

            response = await call_medical_agent(
                query=user_query, doctor_id=DOCTOR_ID, session_id=SESSION_ID
            )
            print(f"\n<<< MedicAI: {response}")

        except KeyboardInterrupt:
            print("\n\n👋 Session ended. Thank you for using MedicAI!")
            break
        except EOFError:
            print("\n\n👋 Session ended. Thank you for using MedicAI!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("Please try again or type 'quit' to exit.")


async def main():
    """Main function to start MedicAI"""
    print("🚀 Starting MedicAI...")

    # Check Couchbase connection
    print("🔍 Testing Couchbase connection...")
    if not test_couchbase_connection():
        print("\n⚠️  Please check your Couchbase configuration in .env file")
        return
    print("✅ Couchbase connection successful")

    try:
        # Initialize AI session
        print("🤖 Initializing medical AI assistant...")
        await initialize_session(DOCTOR_ID, SESSION_ID)
        print("✅ Medical AI session initialized")

        # Start interactive chat
        await interactive_medical_chat()

    except Exception as e:
        print(f"❌ Failed to start medical assistant: {e}")
        print("This is likely due to missing or invalid Google API credentials.")
        print(
            "Please check your .env file and ensure GOOGLE_API_KEY is configured correctly."
        )


if __name__ == "__main__":
    asyncio.run(main())
