import os
from core.response import json_response

class FileSystemController:
    def get_all_files(request):
        contents = []
        
        dir = request["query_params"].get("path")[0]
        
        for item in os.listdir(dir):
            print(dir + "/" + item)
            if os.path.isdir(dir + "/" + item):
                item_type = "dir"
            else:
                item_type = "file"
                
            item_size = os.path.getsize(item) if os.path.isfile(item) else None
                
            contents.append({
                "name": item,
                "type": item_type,
                "size": item_size
            })
            
        contents = sorted(contents, key=lambda x: (x["type"] != "dir", x["name"]))
        return json_response(contents)    
    