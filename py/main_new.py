from flask import Flask, jsonify, request
from flask.ext.cors import CORS
import json
import psycopg2
from databaseAcquisition import databaseAcquisition

#REST setup
app = Flask(__name__)
CORS(app)

database_getter = databaseAcquisition()

@app.route('/')
def function():
	return str("success")

@app.route('/connect-database/<string:database_name>',methods=['GET'])
def connectToDatabase(database_name):
	return jsonify(database_getter.connect_database(database_name))

@app.route('/close-database',methods=['GET'])
def closeDatabase():
	return jsonify(database_getter.close_database())

@app.route('/get-attribute',methods=['GET'])
def getAttribute():
	return jsonify(database_getter.get_attribute())

@app.route('/get-data/<string:att>/<string:tab>', methods=['GET'])
# @crossdomain(origin="*")
def getData(att=None,tab=None):
	database_getter.set_att_table(str(att),str(tab))
	return jsonify(database_getter.access_data())

@app.route('/set-limit/<int:limit>', methods=['GET'])
def setLimit(limit):
	return jsonify(database_getter.limit(limit))

# @app.route('/access', methods=['GET'])
# def setLimit(limit):
# 	return jsonify(database_getter.access_data())

if __name__ == '__main__':
	app.run(port=8070,debug=True)
