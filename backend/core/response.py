import json
import os

def text_response(text):
    return 200, "text/plain", text

def json_response(object):
    if isinstance(object, str):
        object = json.loads(object)
        
    return 200, "application/json", object

def file_response(path):
    if os.path.exists(path):
        ext = path.split(".")[-1].lower()
        mime_type = "application/octet-stream"
        if ext in ["html", "css"]:
            mime_type = f"text/{ext}"
        elif ext in ["json"]:
            mime_type = f"application/{ext}"
        elif ext == "js":
            mime_type = f"application/javascript"
        elif ext in ["png", "jpeg", "jpg", "gif", "webp"]:
            mime_type = f"application/{ext}"
        
        content = ""
        if ext in ["png", "jpeg", "jpg", "gif", "webp"]:
            with open(path, "rb") as f:
                content = f.read()
        else:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
        return 200, mime_type, json.loads(content) if mime_type == "application/json" else content
    else:
        return 404, "text/plain", "Error: File not found"