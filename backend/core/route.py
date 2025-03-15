class Route:
    def __init__(self):
        self.routes = {"GET": {}, "POST": {}}

    def GET(self, path, handler):
        self.routes["GET"][path] = handler

    def POST(self, path, handler):
        self.routes["POST"][path] = handler

    def match_route(self, method, path):
        """Matches an incoming request path to a defined route, supporting dynamic segments."""
        if path in self.routes[method]:
            return self.routes[method][path], {}

        # Check for dynamic routes like /users/<username>
        for route, handler in self.routes[method].items():
            if "<" in route and ">" in route:
                parts = route.strip("/").split("/")
                path_parts = path.strip("/").split("/")

                if len(parts) != len(path_parts):
                    continue  # Skip if lengths don't match

                params = {}
                match = True
                for i, part in enumerate(parts):
                    if part.startswith("<") and part.endswith(">"):
                        param_name = part[1:-1]
                        params[param_name] = path_parts[i]
                    elif part != path_parts[i]:
                        match = False
                        break

                if match:
                    return handler, params  # Return handler and extracted params

        return None, None  # No route matched
    
route = Route()