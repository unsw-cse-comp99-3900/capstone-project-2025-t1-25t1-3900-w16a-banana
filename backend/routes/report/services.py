"""Helper functions for Report API"""
from typing import Optional, List
from datetime import datetime
from sqlalchemy import and_
from db_model import Order
from db_model.db_enum import OrderStatus

def filter_orders_by_user_and_date_range(
    customer_id: Optional[int] = None,
    restaurant_id: Optional[int] = None,
    driver_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[Order]:
    """
    Filters orders by customer, restaurant, or driver within an optional date range.

    At least one of customer_id, restaurant_id, or driver_id must be provided.

    Args:
        session (Session): SQLAlchemy session.
        customer_id (int, optional): Customer ID.
        restaurant_id (int, optional): Restaurant ID.
        driver_id (int, optional): Driver ID.
        start_date (datetime, optional): Start date (inclusive).
        end_date (datetime, optional): End date (inclusive).

    Returns:
        List[Order]: Filtered list of orders.
    """
    filters = []

    # At least one user ID must be provided
    if customer_id:
        filters.append(Order.customer_id == customer_id)
    if restaurant_id:
        filters.append(Order.restaurant_id == restaurant_id)
    if driver_id:
        filters.append(Order.driver_id == driver_id)

    # If no user ID is provided, you can raise an error or return empty
    if not filters:
        raise ValueError(
            "At least one of customer_id, restaurant_id, or driver_id must be specified."
        )

    # Apply date range filters
    if start_date:
        filters.append(Order.order_time >= start_date)
    if end_date:
        filters.append(Order.order_time <= end_date)

    # Only check for completed order
    filters.append(Order.order_status == OrderStatus.DELIVERED)

    return Order.query.filter(and_(*filters)).order_by(Order.order_time.asc()).all()
