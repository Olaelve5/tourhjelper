import os
from dotenv import load_dotenv
import logging
from firebase_admin import credentials, firestore, initialize_app

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Suppress gRPC and absl logging
os.environ['GRPC_VERBOSITY'] = 'ERROR'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Load Firebase credentials from environment variable
private_key_path = os.getenv('FIREBASE_PRIVATE_KEY_PATH')
if not private_key_path:
    logger.error("Firebase private key path is not set in environment variables.")
    raise ValueError("Firebase private key path is not set.")

# Initialize Firebase app
cred = credentials.Certificate(private_key_path)
initialize_app(cred)

# Get Firestore client
db = firestore.client()

def write_stages(stages):
    for stage in stages:
        try:
            doc_ref = db.collection('stages').document(f'{stage["stage"]}')
            doc_ref.set(stage)
            logger.info(f"Stage {stage['stage']} written successfully.")
        except Exception as e:
            logger.error(f"An error occurred while writing stage {stage['stage']}: {e}")
    logger.info("Stages written to Firestore.")

def write_riders(riders):
    batch = db.batch()
    for rider in riders:
        try:
            # Create a unique ID using the rider's name and team
            rider_id = f"{rider['name']}_{rider['team']}"
            doc_ref = db.collection('riders').document(rider_id)
            
            # Add the write operation to the batch
            batch.set(doc_ref, rider)
            logger.info(f"Rider {rider['name']} added to batch.")
        except Exception as e:
            logger.error(f"An error occurred while adding rider {rider['name']} to batch: {e}")
    
    try:
        # Commit the batch
        batch.commit()
        logger.info("Batch write to Firestore completed successfully.")
    except Exception as e:
        logger.error(f"An error occurred while committing the batch: {e}")

def write_rider_images(rider_images):
    for rider_image in rider_images:
        try:
            doc_ref = db.collection('rider_images').document(f'{rider_image["team"]}')
            doc_ref.set(rider_image)
            logger.info(f"Rider image for team {rider_image['team']} written successfully.")
        except Exception as e:
            logger.error(f"An error occurred while writing rider image for team {rider_image['team']}: {e}")
    logger.info("Rider images written to Firestore.")


