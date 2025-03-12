# Backend

## Installation

1. `pip install -r requirements.txt` or `pip3 install -r requirements.txt`

2. `python app.py` or `python3 app.py`

Then open the [http://localhost:11000](http://localhost:11000) in your browser.

## Current Features

General - for everyone after login
* view profile

Admin:
* login
* approve or reject pending applications (driver, restaurant)

Driver:
* login
* register a new account - this application will be pending until the admin approves it
* update profile - some important information require admin approval, for example (first name, last name, license number, car number, registration paper), so the admin will look at that again.

Restaurant:
* login
* register a new account - this application will be pending until the admin approves it
* update profile - some important information require admin approval, for example (restaurant name, address), so the admin will look at that again.
* create, update, delete menu categories
* create, update, delete menu items (items are under category)

Customer:
* login
* register a new account
* update profile (does not require admin approval)

## View the database

The database is the file [project.db](./project.db). For viewing the sqlite database, use some online sqlite viewer, or the [SQLiteStudio](https://sqlitestudio.pl/). It has both windows and mac versions. 

The tables are defined in the [utils/init_db.py](./utils/init_db.py) file. And if you need to modify the tables, make sure apply the **reset the database** step below. 

## Reset the database

At the **backend folder**, open a terminal and run `python utils/init_db.py` or `python3 utils/init_db.py`.
