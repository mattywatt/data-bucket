from databucket import app
from flask import render_template, request, abort, Response
from bson import json_util
from validation import Validation
#from werkzeug.http import parse_authorization_header
from functools import wraps
from itsdangerous import SignatureExpired

from models import DataSet, DataActivity, User
import json
import re


@app.route("/")
def root():
	return render_template('index.html')

# http://flask.pocoo.org/snippets/8/
def check_auth(authStr):
	user = User()
	if authStr:
		try:
			token = authStr.split(' ')[1]
			userId = user.verify_auth_token(token) # deserialise token to get user id
			return userId
		except SignatureExpired:
			return abort(401, 'Token expired')
		except Exception as e:
			print e
			return abort(401, 'Could not verify token.')
	else:
		return abort(401)

# decorator for endpoints that need auth token
def requires_auth(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		authStr = request.headers.get('Authorization') # 'Bearer thisisatokenstrhere'
		userId = check_auth(authStr) # check if expired
		if not check_auth(authStr):
			return abort(401)
		return f(*args, **kwargs)
	return decorated

@app.route('/api/data', methods=['POST'])
@requires_auth
def post_data():
	postDict = request.get_json()
	validator = Validation()
	# validation not complete yet
	errorsResp = validator.validate(x_format='date-time', data=postDict)
	if not errorsResp:
		authStr = request.headers.get('Authorization')
		userId = check_auth(authStr) # get user id out of token
		user = User() # regret choosing nosql
		userDict = user.get(user_id=userId)
		dataSet = DataSet()
		dataId = dataSet.create(data=postDict['data'],
								x_format=postDict['x_format'],
								title=postDict['title'],
								user_id=userId)
		if dataId:
			dataActivity = DataActivity()
			dataActivity.create(data_id=dataId,
								user_id=userId,
								username=userDict['username'],
								http_action='POST')
		respDict = { 'id': dataId }
		# insert id is included in response
		return json.dumps(respDict, default=json_util.default)
	else:
		# tell UI
		pass

@app.route('/api/data/<dataId>', methods=['GET'])
@app.route('/api/data', methods=['GET'])
@requires_auth
def get_data(dataId=None):
	
	# Just get one if id is included in url
	if dataId:
		dataSet = DataSet()
		dataSetDict = dataSet.get(id=dataId)
		return json.dumps(dataSetDict, default=json_util.default)
	else:
		# get list if no id in url
		pass

@app.route('/api/data/<dataId>', methods=['PUT'])
@requires_auth
def put_data(dataId):
	putDict = request.get_json()
	updateDict = {}
	if 'title' in putDict:
		updateDict['title'] = putDict['title']
	if 'data' in putDict:
		updateDict['data'] = putDict['data']

	dataSet = DataSet()
	updated = dataSet.update(update_with=updateDict, data_id=dataId)
	if updated:
		# recording the occurance for the activity feed of the data
		# the activity will need user details, no table joins :(
		authStr = request.headers.get('Authorization')
		userId = check_auth(authStr) # get user id out of token
		user = User()
		userResult = user.get(user_id=userId)
		dataActivity = DataActivity()
		dataActivity.create(data_id=dataId,
							http_action='PUT',
							user_id=userId,
							username=userResult['username'])
		return json.dumps({}, default=json_util.default)
	return abort(400)

@app.route('/api/data/activity/<dataId>', methods=['GET'])
def get_data_activity(dataId):
	dataActivity = DataActivity()
	dataActivityList = dataActivity.get(data_id=dataId)
	# convert cursor to list so it can be serialised to json
	return json.dumps(dataActivityList, default=json_util.default)

@app.route('/api/users', methods=['POST'])
def post_user():
	userDict = request.get_json()
	user = User()
	validationErrors = user.validation_errors(userDict)
	if not validationErrors:
		# created user will have id and token
		userId = user.create(username=userDict.get('username'), password=userDict.get('password'))
		authToken = user.generate_auth_token(user_id=userId)
		# store token with user id

		# respond with token to be stored in local storage
		createdUserDict = { 'user_id': userId, 'token': authToken.decode('ascii'), 'user_image': 's3.boto' }
		return json.dumps(createdUserDict, default=json_util.default)
	else:
		return abort(400, validationErrors)

@app.route('/api/login', methods=['POST'])
def get_auth_token():
	print 'verifying user'
	userDict = request.get_json()
	user = User()
	userId = user.verify_password(username=userDict.get('username'), password=userDict.get('password'))
	# user password is verified if user id returned
	if userId:
		authToken = user.generate_auth_token(user_id=userId)
		verifiedUserDict = { 'user_id': userId, 'token': authToken.decode('ascii'), 'user_image': 's3.boto' }
		return json.dumps(verifiedUserDict, default=json_util.default)
	else:
		print 'user verification failed!'


