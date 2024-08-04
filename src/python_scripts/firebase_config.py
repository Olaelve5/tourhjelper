import os

# Suppress gRPC and absl logging
os.environ['GRPC_VERBOSITY'] = 'ERROR'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("/Users/ola/Documents/Firebase keys/tourhjelper_private_key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def write_stages(stages):
    for stage in stages:
        try:
            doc_ref = db.collection('stages').document(f'{stage["stage"]}')
            doc_ref.set(stage)
        except Exception as e:
            print(f"An error occurred while writing stage {stage['stage']}")
            print(e)
    print("Stages written to Firestore.")



