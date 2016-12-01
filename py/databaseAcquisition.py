import psycopg2
import json

class databaseAcquisition:
    limit_max = 1000

    def __init__(self):
        self.connection = None
        self.attribute_temp = None
        self.table_temp = None
        self.where_temp=None
        self.limit_temp= self.limit_max
        self.groupby_temp = None
        
    def connect_database(self, database_name):
        #connecting database
        #database_name is string
        self.connection = psycopg2.connect(database=str(database_name), user="postgres", password="", host="127.0.0.1", port="5432")
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
        cursor.execute("select * from desc_table limit 1")
        desc_stat = cursor.description

        #formating return type
        list_desc_temp = []
        for att in desc_temp:
            list_desc_temp.append(str(att.name))

        list_desc_stat = []
        for att in desc_stat:
            list_desc_stat.append(str(att.name))

        return {'desc_stat':list_desc_stat,'desc_temp': list_desc_temp}

    def set_att_table(self,attribute,table):
        #set temporal attribute and table
        #both in list format
        self.attribute_temp = str(attribute)
        self.table_temp = str(table)
        return{'att': self.attribute_temp, 'table': self.table_temp}

    def limit(self,limit):
        if(limit<=self.limit_max):
            self.limit_temp= limit
            return {"message":"limit changed to "+str(limit)}
        else:
            return {"message":"maximum limit "+str(self.limit_max)}

    def add_where(self,statement):
        self.where_temp=statement
        data = self.access_data()
        data["message"]="success add statement"
        return data

    # def remove_where(self, statement):
    #     self.where_temp.remove(statement)
    
    def sql_statement(self):
        sql_query = ""

        #validate and make the standart sql command
        if(self.connection == None): return {"message":"database not connected"}
        elif(self.attribute_temp == None or self.table_temp == None): return {"meesege":"attribute or table still null"}
        else:
            sql_query = "select "+ self.attribute_temp+" from "+self.table_temp
            
        #adding another sql commmand for where, limit and group by
        if(self.where_temp != None):
            where_stat = self.where_temp
            sql_query += " where " + where_stat
        if(self.limit_temp != None):
            sql_query += " limit "+str(self.limit_temp)
        if(self.groupby_temp != None):
            sql_query += " group by "+self.groupby_temp

        return sql_query
    
    def access_data(self):
        #execute commad
        return self.executor(self.sql_statement())

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
        return {"attribute":[attribute],"data_tuple": datalist}
