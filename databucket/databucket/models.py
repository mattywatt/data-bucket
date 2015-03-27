from flask import current_app
from bson.objectid import ObjectId
from datetime import datetime
from passlib.hash import sha256_crypt # for storing password with salted hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, SignatureExpired # for auth tokens


class DataSet:

	def __init__(self):
		self.db = current_app.db

	def create(self, **kwargs):
		dataSet = { 'title': kwargs['title'],
			    'data': kwargs['data'],
			    'data_type': kwargs['x_format'],
			    'user_id': kwargs['user_id'],
			    'timestamp': datetime.now() }
		dataSetId = self.db.data.insert(dataSet)
		return str(dataSetId)

	def get(self, **kwargs):
		dataId = kwargs['id']
		dataSetDict = self.db.data.find_one({ '_id': ObjectId(dataId) })
		return dataSetDict

	def update(self, **kwargs):
		updateDict = kwargs['update_with']
		dataId = kwargs['data_id']	
		upd = self.db.data.update({ "_id": ObjectId(dataId) }, { '$set': updateDict })
		return upd


class DataActivity:

	def __init__(self):
		self.db = current_app.db

	def create(self, **kwargs):
		activity = { 'data_id': ObjectId(kwargs['data_id']),
			     'http_action': kwargs['http_action'],
			     'user_id': kwargs['user_id'],
			     'username': kwargs['username'],
			     'timestamp': datetime.now() }
		activityId = self.db.dataActivity.insert(activity)

	def get(self, **kwargs):
		queryCursor = self.db.dataActivity.find({ 'data_id': ObjectId(kwargs['data_id']) })
		# convert each ObjectId of data_set_id to string and timestamp to string
		activities = []
		for doc in queryCursor:
			activity = {}
			activity['http_action'] = doc['http_action']
			activity['data_id'] = str(doc['data_id'])
			activity['timestamp'] = str(doc['timestamp'])
			activity['username'] = doc['username']
			activity['user_id'] = doc['user_id']
			activities.append(activity);
		return activities
	

class User:

	def __init__(self):
		self.db = current_app.db

	def get(self, **kwargs):
		return self.db.users.find_one({ '_id': ObjectId(kwargs['user_id']) })

	def generate_auth_token(self, **kwargs):
		s = Serializer(current_app.config['SECRET_KEY'], expires_in = 172800)
		return s.dumps({ 'id': kwargs['user_id'] })

	@staticmethod
	def verify_auth_token(token):
		s = Serializer(current_app.config['SECRET_KEY'])
		data = s.loads(token)
		return data['id']

	def create(self, **kwargs):
		# hash password with salt
		hash = sha256_crypt.encrypt(kwargs['password'])
		userDict = { 'username': kwargs['username'], 'password': hash }
		userId = self.db.users.insert(userDict)
		return str(userId)

	def verify_password(self, **kwargs):
		username = kwargs['username']
		password = kwargs['password']
		userDict = self.db.users.find_one({ 'username': username })
		# if the password is verified then return user id so a token can be fetched
		if sha256_crypt.verify(password, userDict['password']):
			return str(userDict['_id'])
		else:
			return None

	def validation_errors(self, userDict):
		# exception is thrown if these keys aren't in dictionary/posted data	
		username = userDict['username']
		password = userDict['password']
		
		# fields validation
		if len(username) < 2 or len(username) > 12:
			return False
		if len(password) < 6 or len(password) > 12:
			return False
		# ensure username isn't used already
		if self.db.users.find({ 'username': username }).count():
			return 'Username is taken, choose another'
		return None






