from flask_restx import Namespace, Resource, fields, reqparse
from flask import request, abort
from werkzeug.datastructures import FileStorage
from db_model import *

api = Namespace('test', description='APIs for Testing for developers')


@api.route('/<string:user_type>')
class Users(Resource):
    def get(self, user_type):
        """Get all existing users"""

        if user_type == "driver":
            drivers = []
            for driver in Driver.query.all():
                drivers.append(driver.dict())
            return {"Drivers": drivers}, 200
        
        elif user_type == "customer":
            customers = []
            for customer in Customer.query.all():
                customers.append(customer.dict())
            return {"Customers": customers}, 200
        
        elif user_type == "admin":
            admins = []
            for admin in Admin.query.all():
                admins.append(admin.dict())
            return {"Admins": admins}, 200
        
        elif user_type == "restaurant":
            restaurants = []
            for restaurant in Restaurant.query.all():
                restaurants.append(restaurant.dict())
            return {"Restaurants": restaurants}, 200
        
        else:
            return {"message": "Wrong type"}, 400
        

@api.route('/menus')
class Users(Resource):
    def get(self):
        """Get all existing users"""

        menuItems = []
        for menuItem in MenuItem.query.all():
            menuItems.append(menuItem.dict())

        return {"Menus": menuItems}, 200

        