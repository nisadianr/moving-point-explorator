import psycopg2
import json

class databaseAcquisition:

    def __init__(self):
        self.connection = None
        self.attribute_temp = None
        self.table_temp = None
        self.where_temp=[]
        self.limit_temp=2000
        self.groupby_temp = None
        
    def connect_database(self, database_name):
        #connecting database
        #database_name is string
        self.connection = psycopg2.connect(database=str(database_name), user="postgres", password="", host="127.0.0.1", port="5432")
        return[{"messasge":"database connected successfully"}]

    def close_databse(self):
        if(self.connection!=None):
            self.connection.close()
            return [{"connection database": "cloesd successfully"}]

    def get_attribute(self):
        #get table's attribute
        cursor = self.connection.cursor()
        cursor.execute("select * from temp_table limit 1")
        desc_temp = cursor.description
        cursor.execute("select * from desc_table limit 1")
        desc_stat = cursor.description

        #formating return type
        list_desc_temp = []
        for att in desc_temp:
            list_desc_temp.append(str(att.name))

        list_desc_stat = []
        for att in desc_stat:
            list_desc_stat.append(str(att.name))

        return [{'desc_stat':list_desc_stat,'desc_temp': list_desc_temp}]

    def access_data(self,attribute,table):
        #set temporal attribute and table
        #both in list format
        self.attribute_temp = attribute
        self.table_temp = table

    def limit(self,limit):
        if(limit<=2000):
            self.limit_temp= limit
        else:
            return [{"message":"maximum limit 2000"}]

    def add_where(self,statement):
        self.where_temp.apend(statement)
        
    def execute(self):
        sql_statement = ""
        if(self.connection == None): return [{"message":"database not connected"}]
        elif(self.attribute_temp == None or self.table_temp == None): return [{"meesege":"attribute or table still null"}]
        else:
            sql_statement = "select "
            for att in self.attribute_temp:
                sql_statement += att+','
            sql_statement = sql_statement[0:len(sql_statement)-1]+" from "

            for tab in self.table_temp:
                sql_statement += tab+','
            sql_statement = sql_statement[0:len(sql_statement)-1]
        #setting where, limit, group by
        if(self.where_temp != []):
            sql_statement += " where "
            for where_clause in self.where_temp:
                sql_statement += where_clause+' and '
            sql_statement = sql_statement[0:len(sql_statement)-5]
        if(self.limit_temp != None):
            sql_statement += " limit "+str(self.limit_temp)
        if(self.groupby_temp != None):
            for tab in self.groupby_temp:
                sql_statement += tab+','
            sql_statement = sql_statement[0:len(sql_statement)-1]

        #execute commad
        print(sql_statement)
        return self.executor(sql_statement)

    def executor(self,sql_command):
        #execute data
        cursor = self.connection.cursor()
        cursor.execute(sql_command)

        #get data
        meta_data=cursor.description
        data = cursor.fetchall()

        #formating data
        attribute=[]
        for att in meta_data:
            attribute.append(att.name)
        datalist=[]
        for tuple in data:
            tuple_list = []
            for cell in tuple:
                tuple_list.append(cell)
            datalist.append(tuple_list)
        return [attribute]+datalist
