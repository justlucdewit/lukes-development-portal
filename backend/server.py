from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from urllib.parse import parse_qs, urlparse
from routes import route

routes = route.routes

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.handle_request("GET")

    def do_POST(self):
        self.handle_request("POST")

    def handle_request(self, method):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query_params = parse_qs(parsed_url.query)  # Extract query parameters

        handler, params = route.match_route(method, path)

        if handler:
            request_data = {
                "query_params": query_params,
                "headers": dict(self.headers),
                "body": {}
            }

            if method == "POST":
                content_length = int(self.headers.get("Content-Length", 0))
                post_data = self.rfile.read(content_length).decode("utf-8")
                request_data["body"] = json.loads(post_data) if post_data else {}

            # Call the handler with extracted parameters and request data
            status, content_type, response_body = handler(request_data, **params)

            self._send_response(status, content_type, response_body)
        else:
            self.send_error(404, "Route not found")

    def _send_response(self, status, content_type, response_body):
        """Handles sending responses in JSON, HTML, or plain text"""
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.end_headers()

        if isinstance(response_body, bytes):
            self.wfile.write(response_body)  # No encoding needed, just send the raw bytes
        else:
            if content_type == "application/json":
                response_body = json.dumps(response_body)

            self.wfile.write(response_body.encode("utf-8"))

if __name__ == "__main__":
    server_address = ("", 8000)
    httpd = HTTPServer(server_address, APIHandler)
    print("🚀 API Server running on http://localhost:8000")
    httpd.serve_forever()
