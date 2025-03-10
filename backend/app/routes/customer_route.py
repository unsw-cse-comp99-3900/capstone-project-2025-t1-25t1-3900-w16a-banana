from flask_restx import Namespace, Resource, fields
from flask import request, jsonify


customer_ns = Namespace("customer", description="APIs for customer features")

