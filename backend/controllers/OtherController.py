from core.response import text_response
import subprocess
import os

class OtherController:
    def ping(request):
        text_response("Pong")
        
    def execute_action(request, action):
        action_args = []
        if request["query_params"].get("args"):
            action_args = request["query_params"].get("args")[0]
        
        if os.path.exists(f"actions/{action}.sh"):
            command = [ "bash", f"actions/{action}.sh" ]
            if action_args:
                command += action_args.split(" ")
            
            print(command)
            subprocess.run(command)
            return text_response("Action succesfully finished!")
        else:
            return 404, "text/plain", "Action does not exist"