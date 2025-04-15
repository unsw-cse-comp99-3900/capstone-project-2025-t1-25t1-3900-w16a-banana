"""Helper functions for Report API"""
from typing import Optional, List
from datetime import datetime, timedelta
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


def get_per_day_data(
    restaurant_id: Optional[int] = None,
    driver_id: Optional[int] = None,
    customer_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[dict]:
    """
    Get the per day number of orders and earnings from the orders.

    Args:
        restaurant_id (int): Restaurant ID.
        start_date (datetime): Start date (inclusive).
        end_date (datetime): End date (inclusive).

    Returns:
        List[dict]: List of dictionaries containing: date, num_orders, earnings
    """

    # reset the start_date to the start of the day
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)

    # reset the end_date to the next day 0:00:00
    end_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)

    # create a list to hold the per day data
    data = []

    # start the iteration from the first day
    current_date = start_date 
    while current_date < end_date:
        # get the number of orders and earnings for the current day
        # use either restaurant_id or driver_id to filter the orders (one of the 3 variables is not None)
        orders = filter_orders_by_user_and_date_range(
            restaurant_id=restaurant_id,
            driver_id=driver_id,
            customer_id=customer_id,
            start_date=current_date,
            end_date=current_date + timedelta(days=1)
        )

        num_orders = len(orders)
        earnings = sum(order.order_price for order in orders)

        # append the data to the list
        data.append({
            'date': current_date.strftime('%Y-%m-%d'),
            'num_orders': num_orders,
            'earnings': round(earnings, 2)
        })

        # move to the next day
        current_date += timedelta(days=1)
    
    return data
