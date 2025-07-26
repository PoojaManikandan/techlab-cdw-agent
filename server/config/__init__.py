import os
from dotenv import load_dotenv
load_dotenv()

PAYPAL_CLIENT_ID = os.environ["PAYPAL_CLIENT_ID"]
PAYPAL_CLIENT_SECRET = os.environ["PAYPAL_CLIENT_SECRET"]
MONGODB_URL = os.environ["MONGODB_URL"]
