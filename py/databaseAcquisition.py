import psycopg2
from flask import jsonify 
import datetime

class databaseAcquisition:
    limit_max = 5000

    def __init__(self):
        self.connection = None
        self.limit_temp= self.limit_max
        
    def connect_database(self, database_name):
        #connecting database
        #database_name is string
        self.connection = psycopg2.connect(database=str(database_name), user="postgres", password="nisa", host="127.0.0.1", port="5432")
        return{"message":"database connected successfully"}

    def close_database(self):
        if(self.connection!=None):
            self.connection.close()
            return {"message": "cloesd successfully"}

    def get_attribute(self):
        #get table's attribute
        cursor = self.connection.cursor()
        cursor.execute("select * from temp_table limit 1")
        desc_temp = cursor.description
        cursor.execute("select * from stat_table limit 1")
        desc_stat = cursor.description

        #formating return type
        list_desc_temp = []
        for att in desc_temp:
            list_desc_temp.append(str(att.name))

        list_desc_stat = []
        for att in desc_stat:
            list_desc_stat.append(str(att.name))

        return {'desc_stat':list_desc_stat,'desc_temp': list_desc_temp}

    def limit(self,limit):
        if(limit<=self.limit_max):
            self.limit_temp= limit
            return {"message":"limit changed to "+str(limit)}
        else:
            return {"message":"maximum limit "+str(self.limit_max)}

    def executor(self,sql_command):
        #execute data
        cursor = self.connection.cursor()
        cursor.execute(sql_command+" limit "+str(self.limit_temp))
        #get data
        meta_data=cursor.description
        data = cursor.fetchall()

        #formating data
        attribute=[]
        for att in meta_data:
            attribute.append(att.name)

        time = "time" in attribute
        point = "point" in attribute

        datalist=[]
        for tuple in data:
            tuple_list = []
            for cell in tuple:
                tuple_list.append(cell)

            # change time format
            if(time != False):
                tuple_list[attribute.index("time")] = unixTime().unix_to_datetime(tuple_list[attribute.index("time")])

            #change point format
            if(point != False):
                tuple_list[attribute.index("point")] = conv_gis_gmaps(tuple_list[attribute.index("point")])

            datalist.append(tuple_list)
        return {"attribute":[attribute],"data_tuple": datalist}

    def testing(self):
        return self.executor("Select ST_AsText(point) as point from temp_table where gid = 0 and time>=1224720000 and time<=1224806399 and ST_Intersects(point, ST_GeomFromText('POLYGON((39.984698 58.1580315,39.990698 58.1580315,39.990698 58.1550315,39.984698 58.1550315,39.984698 58.1580315))',4326))")


class unixTime:
    base_date=datetime.datetime(1970,1,1,0,0,0)
    
    def datetime_to_unix(self,datetimestring):
        datetime_new=datetimestring.split(" ")
        date = datetime_new[0].split("-")
        time = datetime_new[1].split(":")

        datetime_format = datetime.datetime(int(date[0]),int(date[1]),int(date[2]),int(time[0]),int(time[1]),int(time[2]))
        delta_time = datetime_format-self.base_date
        return delta_time.total_seconds()

    def unix_to_datetime(self,unix_date):
        delta = datetime.timedelta(seconds=int(unix_date))
        new_datetime = delta+self.base_date
        date_string = str(new_datetime.year)+"-"+str(new_datetime.month).zfill(2)+"-"+str(new_datetime.day).zfill(2)
        time_string = str(new_datetime.hour)+":"+str(new_datetime.minute).zfill(2)+":"+str(new_datetime.second).zfill(2)
        return date_string+" "+time_string

def conv_gis_gmaps(string_point):
    point_= string_point[string_point.index("(")+1:string_point.index(")")-1]
    point_= point_.split(" ")
    str_lat = '"lat"'
    str_lng = '"lng"'

    lat = float(point_[0])
    lng = float(point_[1])/90*180

    return "{"+str_lat+": "+str(lat)+", "+str_lng+": "+str(lng)+"}"