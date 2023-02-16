import pandas as pd
import sqlite3
import json

# Read sqlite query results into a pandas DataFrame
con = sqlite3.connect("../backend/database.db")
df = pd.read_sql_query("SELECT * from Annotation", con)
df2 = pd.read_sql_query("SELECT * from Annotation", con)
# df = pd.read_sql('../backend/database.db')

# [dx, dy, pressure, on/off]
newcol = []
for r_idx, row in df.iterrows():
    data = json.loads(row['Data'])
    new_data = []
    for d_idx, d in enumerate(data):
        if d_idx>0:
            prev_d = data[d_idx-1]
            if d[3]==1 and prev_d[3]==1:

                # print(d[0], prev_d[0])
                new_d = [d[0]-prev_d[0], d[1]-prev_d[1], d[2], 1]
            else:
                new_d = [0,0,0,0]
            new_data.append(new_d)
    newcol.append(json.dumps(new_data))

df['Data'] = newcol

newcol = []
for r_idx, row in df2.iterrows():
    data = json.loads(row['Data'])
    new_data = []
    for d_idx, d in enumerate(data):
        if d_idx>0:
            prev_d = data[d_idx-1]
            if d[3]==1 and prev_d[3]==1:
                new_d = [-d[0]+prev_d[0], d[1]-prev_d[1], d[2], 1]
            else:
                new_d = [0,0,0,0]
            new_data.append(new_d)
    newcol.append(json.dumps(new_data))
df2['Data'] = newcol
df_f = pd.concat([df, df2])
df_f.to_csv('emobrush_data.csv')