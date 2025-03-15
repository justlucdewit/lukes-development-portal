from controllers.FileSystemController import FileSystemController
from controllers.OtherController import OtherController
from controllers.FrontendController import FrontendController
from core.route import route

# Frontend setup
route.GET("/", FrontendController.load_portal_page)
route.GET("/style.css", FrontendController.load_portal_css)
route.GET("/assets/<file>", FrontendController.load_portal_assets)
route.GET("/scripts/<file>", FrontendController.load_portal_script)
route.GET("/modules/<module>/<file>", FrontendController.load_portal_module)
route.GET("/data/<file>", FrontendController.load_portal_data)

# Filesystem controller
route.GET("/files", FileSystemController.get_all_files)

# Other routes
route.GET("/ping", OtherController.ping)
route.GET("/actions/<action>", OtherController.execute_action)