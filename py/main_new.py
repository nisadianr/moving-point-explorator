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

@app.route('/cal_length/<string:sql>',methods=['GET'])
def cal_length(sql):
	x = database_getter.executor(sql)
	return jsonify(x["data_tuple"][0][0])

@app.route('/get-data/<string:command>', methods=['GET'])
# @crossdomain(origin="*")
def getData(command=""):
	temp_command = command
	where = None
	temp_command = temp_command.split("},{")
	# getting attribute and table
	att = temp_command[0][1:].strip()
	tab = temp_command[1].strip()


	# checking filter
	if(len(temp_command)>2):
		where =temp_command[2][0:len(temp_command[2])-1].strip()
		if("datetime" in where):
			temp_where=where.split("datetime(")
			where =temp_where[0]
			temp_where=temp_where[1:]
			for s in temp_where:
				datetime_s=s[0:s.index(")")]
				datetime_s=str(time_changer.datetime_to_unix(datetime_s))
				where+=datetime_s+s[s.index(")")+1:]

	# checcking table
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
	# formating command
	temp_command = command.split(",")
	gid = temp_command[0].strip()
	start = temp_command[1].strip()
	if("datetime" in start):
		start = start[start.index("(")+1:start.index(")")].strip()
	finish = temp_command[2].strip()
	if("datetime" in finish):
		finish = finish[finish.index("(")+1:finish.index(")")].strip()

	# getting point and another info
	point = database_getter.executor("select ST_AsText(point) as point from temp_table where gid="+gid+" and time>="+str(time_changer.datetime_to_unix(start))+" and time<="+ str(time_changer.datetime_to_unix(finish))+"order by time asc")
	data_point = point['data_tuple']
	max_time = None
	min_time =None
	if(len(data_point)!=0):
		max_time = database_getter.executor("select max(time) as time from temp_table where time in (select time from temp_table where gid="+gid+" and time>="+str(time_changer.datetime_to_unix(start))+" and time<="+ str(time_changer.datetime_to_unix(finish))+"order by time asc limit "+str(database_getter.limit_temp)+")")
		max_time = max_time["data_tuple"][0][0]
		min_time = database_getter.executor("select min(time) as time from temp_table where time in (select time from temp_table where gid="+gid+" and time>="+str(time_changer.datetime_to_unix(start))+" and time<="+ str(time_changer.datetime_to_unix(finish))+"order by time asc limit "+str(database_getter.limit_temp)+")")
		min_time = min_time["data_tuple"][0][0]
		total_time = time_changer.datetime_to_unix(max_time)-time_changer.datetime_to_unix(min_time)

		# formating add info about trajectory
		info_traject = {"gid":str(gid), "start_time":str(min_time), "finish_time":str(max_time), "total_time":str(total_time)+" seconds"}
		point["info"]=info_traject
	return jsonify(point)

if __name__ == '__main__':
	app.run(port=8070,debug=True)
