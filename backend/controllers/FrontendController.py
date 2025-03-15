from core.response import file_response

class FrontendController:
    def load_portal_page(request):
        return file_response("frontend/index.html")
        
    def load_portal_css(request):
        return file_response("frontend/style.css")
        
    def load_portal_assets(request, file):
        return file_response(f"frontend/assets/{file}")
        
    def load_portal_script(request, file):
        return file_response(f"frontend/scripts/{file}")
        
    def load_portal_module(request, module, file):
        return file_response(f"frontend/modules/{module}/{file}")
        
    def load_portal_data(request, file):
        return file_response(f"data/{file}")