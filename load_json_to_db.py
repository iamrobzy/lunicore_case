import mysql.connector
import json

db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database="car_db"
) 

f = open('data.json')
data = json.load(f)

global mycursor
mycursor = db.cursor()

def create_tables():
    for table in data['carshop']:
        rows = []
        for row in data['carshop'][table][0]:
            x = data['carshop'][table][0][row]
            rows.append((row,isinstance(x,int)))
        
        w = [f'{row[0]} INT' if row[1] else f'{row[0]} VARCHAR(255)' for row in rows]
        w = [f"{w[i]}" if i==len(w)-1 else f"{w[i]}, " for i in range(len(w))]
        w = ''.join(w)
        
        sql = f"CREATE TABLE {table} ({w})"
        print(f"Created table {table}.")        
        mycursor.execute(sql)
        
        sql = f"ALTER TABLE {table} ADD PRIMARY KEY(id);"
        mycursor.execute(sql)
       
        
def delete():
    for table in data['carshop']:
        mycursor.execute(f"DROP TABLE {table}")
    print('Tables deleted.\n')
    
            
def insert_data():
    for table in data['carshop']:
        keys = tuple(data['carshop'][table][0].keys())
        keys = str(keys).replace("'","")
        #print(f"Keys: {keys}")
        
        row_data = []
        for row in data['carshop'][table]:
            single_row = tuple([element[1] for element in row.items()])
            sql = f"INSERT INTO {table} {keys} VALUES {single_row};"
            mycursor.execute(sql)
        
    db.commit()
        
        
        
if __name__ == "__main__":
     
    delete()    
    create_tables() 
    insert_data()
    #delete()

    print("\nTables:\n")
    mycursor.execute("SHOW TABLES")

    for x in mycursor:
        print(x) 
    
    print('\nComplete.')
  
            
            
