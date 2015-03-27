from flask import Flask
app = Flask(__name__)
app.config.from_object('config') # Now we can access the configuration variables via app.config["VAR_NAME"].

# MongoDB connection added to app
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
app.db = client.database

import databucket.views