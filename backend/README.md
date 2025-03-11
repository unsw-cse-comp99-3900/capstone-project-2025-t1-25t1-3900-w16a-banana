# Backend

## Installation

1. `pip install -r requirements.txt` or `pip3 install -r requirements.txt`

2. `python app.py` or `python3 app.py`

Then open the [http://localhost:5000](http://localhost:5000) in your browser.

## View the database

The database is the file [project.db](./project.db). For viewing the sqlite database, use some online sqlite viewer, or the [SQLiteStudio](https://sqlitestudio.pl/). It has both windows and mac versions. 

The tables are defined in the [utils/init_db.py](./utils/init_db.py) file. And if you need to modify the tables, make sure apply the **reset the database** step below. 

## Reset the database

At the **backend folder**, open a terminal and run `python utils/init_db.py` or `python3 utils/init_db.py`.
