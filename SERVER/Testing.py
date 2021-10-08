# Import WebSocket client library
from websocket import create_connection

import json
import pandas as pd
 
# reading csv file
data=pd.read_csv("./uploads/covid1.csv")

# Connect to WebSocket API and subscribe to trade feed for XBT/USD and XRP/USD
ws = create_connection("ws://localhost:8080/")
print(ws.recv())
d={"Email":"mkk9313@gmail.com","Password":"123456789","Type":"EchoCSV","Data":data.to_json(orient="values")}
#ws.send("""{"Email":"mkk9313@gmail.com","Password":"123456789","Type":"EchoCSV","Data":{"Hello":25,"Bye":[1,2,3,4]}}""")
ws.send(json.dumps(d))
# Infinite loop waiting for WebSocket data

print(ws.recv())