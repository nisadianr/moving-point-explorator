from flask import Flask, jsonify, request
from flask.ext.cors import CORS
import json
import psycopg2
from databaseAcquisition import databaseAcquisition,unixTime

#REST setup
app = Flask(__name__)
CORS(app)

database_getter = databaseAcquisition()
time_changer =  unixTime()

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

@app.route('/get-data/<string:command>', methods=['GET'])
# @crossdomain(origin="*")
def getData(command=""):
	temp_command = command
	where = None
	# checking filter
	if(" FILTER " in command):
		where = command[command.index("FILTER")+7:]
		temp_command = command[0:command.index(" FILTER")]

	# getting attribute and table
	tab = temp_command[temp_command.index("--")+2:]
	att = temp_command[0:temp_command.index("--")]

	if(tab != "temp_table" and tab != "stat_table" and tab !="temp_table natural join stat_table"):
		return jsonify({"message":"table name not found"})

	# replace point
	if("point" in att):
		att = att.replace("point","ST_AsText(point) as point")

	# generate query
	query = "select "+att+" from "+tab
	if (where != None):
		query = query +" where "+ where
	
	return jsonify(database_getter.executor(query))

@app.route('/set-limit/<int:limit>', methods=['GET'])
def setLimit(limit):
	return jsonify(database_getter.limit(limit))

@app.route('/get-trajectory/<string:command>', methods=['GET'])
def getTrajectory(command):
	temp_command = command.split("--")
	gid = temp_command[0]
	start = temp_command[1]
	if("DATETIME" in start):
		start = start[start.index("(")+1:start.index(")")]
	finish = temp_command[2]
	if("DATETIME" in finish):
		finish = finish[finish.index("(")+1:finish.index(")")]
	return jsonify(database_getter.executor("select ST_AsText(point) as point from temp_table where gid="+gid+" and time>="+str(time_changer.datetime_to_unix(start))+" and time<="+ str(time_changer.datetime_to_unix(finish))+"order by time asc"))

if __name__ == '__main__':
	app.run(port=8070,debug=True)
