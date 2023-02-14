import pandas as pd
import sqlite3
import json

# Read sqlite query results into a pandas DataFrame
con = sqlite3.connect("../backend/database.db")
df = pd.read_sql_query("SELECT * from Annotation", con)
# df = pd.read_sql('../backend/database.db')

# [dx, dy, pressure, on/off]
for r_idx, row in df.iterrows():
    data = json.loads(row['Data'])
    new_data = []
    for d_idx, d in enumerate(data):
        if d_idx>0:
            prev_d = data[d_idx-1]
            if d[3]==1:

                # print(d[0], prev_d[0])
                new_d = [d[0]-prev_d[0], d[1]-prev_d[1], d[2], 1]
            else:
                new_d = [0,0,0,0]
            new_data.append(new_d)
    print(df.iloc[r_idx]['DataId']==row['DataId'])
    df.iloc[r_idx]['Data'] = json.dumps(new_data)
df.to_csv('emobrush_data.csv')