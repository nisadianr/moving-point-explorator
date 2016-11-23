from databaseAcquisition import databaseAcquisition 

x = databaseAcquisition()
x.connect_database("TA")
print(x.get_attribute())
x.access_data(['gid','point'],['temp_table'])
print(x.execute())
