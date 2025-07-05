import os
import time
from dotenv import load_dotenv
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions
from couchbase.auth import PasswordAuthenticator

# Load environment variables
load_dotenv()

def test_couchbase_connection():
    """Test basic Couchbase connection and query"""
    try:
        # Connect to Couchbase
        conn_str = os.getenv("COUCHBASE_CONN_STR")
        username = os.getenv("COUCHBASE_USERNAME")
        password = os.getenv("COUCHBASE_PASSWORD")
        bucket_name = os.getenv("COUCHBASE_BUCKET")
        
        print(f"Connecting to: {conn_str}")
        print(f"Username: {username}")
        print(f"Bucket: {bucket_name}")
        
        cluster = Cluster(conn_str, ClusterOptions(PasswordAuthenticator(username, password)))
        
        # Test query first - this doesn't require bucket access
        print("Testing cluster connection with SELECT 1...")
        result = cluster.query("SELECT 1 as test")
        for row in result:
            print(f"✅ Cluster connection successful: {row}")
        
        # Try to list available buckets via query
        print("Checking available buckets...")
        try:
            buckets_result = cluster.query("SELECT name FROM system:buckets")
            print("Available buckets:")
            for row in buckets_result:
                print(f"  - {row['name']}")
        except Exception as e:
            print(f"Could not list buckets: {e}")
        
        # Now try bucket access
        print(f"Testing bucket access: {bucket_name}")
        print("Waiting 3 seconds for bucket to be ready...")
        time.sleep(3)
        
        bucket = cluster.bucket(bucket_name)
        scope = bucket.scope("medicai")
        
        # Test access to all required collections
        collections = ["patients", "consultations", "medications", "allergies", "preferences"]
        for collection_name in collections:
            collection = scope.collection(collection_name)
            print(f"✅ Connected to collection: {collection_name}")
        
        print("✅ Connected to Couchbase successfully!")
        print(f"Connected to bucket: {bucket_name}")
        print(f"Using scope: medicai with collections: {', '.join(collections)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Couchbase connection failed: {e}")
        return False

def main():
    print("--- MedicAI - Testing Couchbase Connection ---")
    
    if test_couchbase_connection():
        print("\n🎉 Ready to build the medical AI memory system!")
    else:
        print("\n⚠️  Please check your .env file and Couchbase setup")

if __name__ == "__main__":
    main()
