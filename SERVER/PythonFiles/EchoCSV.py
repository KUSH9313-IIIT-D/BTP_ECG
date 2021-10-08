import sys
filepath = sys.argv[1]


import json    

json_string = sys.argv[1]
#json_string = json_string.replace('"',"$")
#json_string = json_string.replace("'",'"')
#json_string = json_string.replace("$","'")
print(json_string)


obj = json.loads(json_string)


print(obj)
