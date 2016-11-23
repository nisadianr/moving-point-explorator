from flask import Flask, jsonify, request
from flask.ext.cors import CORS
import json
import psycopg2
from to_postgre import get_max_time_point, connect_database, close_database,function_test,get_attribute

#REST setup
app = Flask(__name__)
CORS(app)

connection=None


@app.route('/')
def function():
	return str("success")

@app.route('/connect-database',methods=['GET'])
def connectToDatabase():
	global connection
	connection = connect_database();
	return str("connection successfull :)")

@app.route('/close-database',methods=['GET'])
def closeDatabase():
	return close_database(connection);

@app.route('/linestring',methods=['GET'])
def testingFunction():
        return jsonify(function_test(connection));

@app.route('/get-point',methods=['GET'])
def getPoint():
	if(connection == None):
		return "connection lost"
	else:
		point = get_max_time_point(connection);
		return jsonify(point)

@app.route('/get-attribute',methods=['GET'])
def getAttribute():
	if(connection == None):
		return "connection lost"
	else:
		attribute = get_attribute(connection);
		return jsonify(attribute)


# @app.route('/set-date', methods=['POST', 'OPTIONS'])
# def setDate():
# 	req = request.json
# 	date = req["date"]
# 	# mungkin datenya bisa buat filter/input ke database

# 	#return sebenernya ga [perlu sih]
# 	return jsonify({"date":date,"status":"success"})	

if __name__ == '__main__':
	app.run(port=8090,debug=True)
