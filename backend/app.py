import config
from backend.config import config
from flask import Flask
from flask_restful import Api
from flask_cors import CORS #comment this on deployment
from backend.api.InventoryTableApiEndpoint import InventoryTableApiEndpoint
from backend.api.StockInventoryApiEndpoint import StockInventoryApiEndpoint
from backend.api.TonerTypesApiEndpoint import TonerTypesApiEndpoint
from backend.api.PrinterLocationApiEndpoint import PrinterLocationApiEndpoint
from backend.api.ClockInApiEndpoint import ClockInApiEndpoint
from backend.api.ClockOutApiEndpoint import ClockOutApiEndpoint
from backend.api.ShiftReportApiEndpoint import ShiftReportApiEndpoint
from backend.api.LogActivityApiEndpoint import LogActivityApiEndpoint
from backend.api.PrinterTableApiEndpoint import PrinterTableApiEndpoint
from backend.api.ReportPrinterApiEndpoint import ReportPrinterApiEndpoint
from backend.api.TonerPercentApiEndpoint import TonerPercentApiEndpoint
from backend.api.UsersApiEndpoint import UsersApiEndpoint
from backend.api.UserTasksApiEndpoint import UserTasksApiEndpoint
from backend.api.ResolveReportApiEndpoint import ResolveReportApiEndpoint
from backend.api.GetReportsApiEndpoint import GetReportsApiEndpoint
from backend.api.AssignTaskApiEndpoint import AssignTaskApiEndpoint
from backend.api.CheckRoleApiEndpoint import CheckRoleApiEndpoint
from backend.api.CompleteTaskApiEndpoint import CompleteTaskApiEndpoint

from backend.authentication.cas_auth import cas_auth    
from backend.api.UserTasksApiEndpoint import UserTasksApiEndpoint
from backend.api.UserProfileDataApiEndpoint import UserProfileDataApiEndpoint


def create_app(config_name='default'):
    stc_app = Flask(__name__)
    stc_app.config.from_object(config[config_name])
    config[config_name].init_app(stc_app)

    CORS(stc_app)  # comment this on deployment
    api = Api(stc_app)

    # Register Flask-RESTful resources
    api.add_resource(InventoryTableApiEndpoint, '/')
    api.add_resource(StockInventoryApiEndpoint, '/update_inventory')
    api.add_resource(TonerTypesApiEndpoint, '/get_toner_types')
    api.add_resource(PrinterLocationApiEndpoint, '/printers')
    api.add_resource(ClockInApiEndpoint, '/clock_in')
    api.add_resource(ClockOutApiEndpoint, '/clock_out')
    api.add_resource(ShiftReportApiEndpoint, '/shift_report')
    api.add_resource(LogActivityApiEndpoint, '/log_activity')
    api.add_resource(PrinterTableApiEndpoint, '/p_table')
    api.add_resource(ReportPrinterApiEndpoint, '/report')
    api.add_resource(TonerPercentApiEndpoint, '/percent')
    api.add_resource(UsersApiEndpoint, '/users')
    api.add_resource(UserTasksApiEndpoint, '/tasks')
    api.add_resource(ResolveReportApiEndpoint, '/resolve')
    api.add_resource(GetReportsApiEndpoint, '/get_reports')
    api.add_resource(AssignTaskApiEndpoint, '/assign')
    api.add_resource(UserProfileDataApiEndpoint, '/profile')
    api.add_resource(CheckRoleApiEndpoint, '/is_stc')
    api.add_resource(CompleteTaskApiEndpoint, '/complete')


    # Register Flask-Blueprint resources
    stc_app.register_blueprint(cas_auth, url_prefix='/cas')

    return stc_app
