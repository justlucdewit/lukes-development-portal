import os
import signal
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess

class RestartOnChange(FileSystemEventHandler):
    def __init__(self, process):
        self.process = process

    def on_any_event(self, event):
        """Restart the server on any file change"""
        if event.src_path.endswith(".py"):
            print(f"🔄 File changed: {event.src_path}. Restarting server...")
            self.process.terminate()
            self.process.wait()
            self.process = subprocess.Popen(["python3", "backend/server.py"])

if __name__ == "__main__":
    # Start the server process
    process = subprocess.Popen(["python3", "backend/server.py"])
    
    # Watch for file changes
    event_handler = RestartOnChange(process)
    observer = Observer()
    observer.schedule(event_handler, path=".", recursive=True)
    observer.start()

    print("👀 Watching for file changes. Press Ctrl+C to stop.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        process.terminate()

    observer.join()
