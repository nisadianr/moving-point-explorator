import psycopg2
import json

def connect_database():
    conn = psycopg2.connect(database="TA", user="postgres", password="", host="127.0.0.1", port="5432")
    return conn

def get_max_time_point(connection):
    cursor=connection.cursor()
    cursor.execute("select gid, ST_AsText(point) as location from temp_table where time in (select max(time) from temp_table group by gid) group by gid, point")
    value=[{cursor.description[0].name:cursor.description[1].name}]
    data = cursor.fetchall()    
    for tuple in data:
        value.append({tuple[0]:tuple[1]})
    return value

def get_attribute(connection):
    cursor = connection.cursor()
    cursor.execute("select * from temp_table limit 1")
    desc_temp = cursor.description
    cursor.execute("select * from desc_table limit 1")
    desc_stat = cursor.description
    list_desc_temp = []
    for att in desc_temp:
        list_desc_temp.append(str(att.name))
    list_desc_stat = []
    for att in desc_stat:
        list_desc_stat.append(str(att.name))
    #comp = str({list_desc_stat},{list_desc_temp})
    return [{'desc_stat':list_desc_stat,'desc_temp': list_desc_temp}]

def function_test(connection):
    cursor=connection.cursor()
    cursor.execute("select gid,ST_AsText(ST_MakeLine(ST_AsText(point))) from temp_table where time>='2008-10-23 00:00:00' and time<='2008-10-23 09:59:59' group by gid")
    data = cursor.fetchall()
    list = [(cursor.description[0].name,cursor.description[1].name)]
    for tuple in data:
        list.append([tuple[0],tuple[1]])
    return list

def close_database(conn):
    if(conn!=None):
        conn.close()
        return str("success")
