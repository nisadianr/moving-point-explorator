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

@app.route('/set-where-clause/<string:where_clause>',methods=['GET'])
def setWhereClause(where_clause):
	return jsonify(database_getter.add_where(where_clause));

@app.route('/get-data/<string:att>/<string:tab>', methods=['GET'])
# @crossdomain(origin="*")
def getData(att=None,tab=None):
	database_getter.set_att_table(str(att),str(tab))
	return jsonify(database_getter.access_data())

@app.route('/set-limit/<int:limit>', methods=['GET'])
def setLimit(limit):
	return jsonify(database_getter.limit(limit))

@app.route('/get-trajectory/<gid>/<string:start>/<string:finish>', methods=['GET'])
def getTrajectory(gid,start,finish):
	database_getter.set_att_table("gid,ST_AsText(ST_MakeLine(ST_AsText(point)))","temp_table")
	database_getter.add_where("time>="+start+" and time<="+finish)
	return jsonify(database_getter.executor(database_getter.sql_statement()+" group by gid"))

# @app.route('/access', methods=['GET'])
# def setLimit(limit):
# 	return jsonify(database_getter.access_data())

if __name__ == '__main__':
	app.run(port=8070,debug=True)
