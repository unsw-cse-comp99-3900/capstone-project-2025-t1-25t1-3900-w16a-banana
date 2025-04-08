# Backend

## 1. Installation and Running the Backend Server

| Step | Mac/Linux | Windows |
|------|-----------|---------|
| Open a terminal at the project root folder | `cd backend` | `cd backend` |
| Create a virtual environment | `python3 -m venv venv` | `python -m venv venv` |
| Activate the virtual environment | `source venv/bin/activate` | `venv\Scripts\activate` |
| Install dependencies | `pip3 install -r requirements.txt` | `pip install -r requirements.txt` |
| Initialize the database | `python3 utils/init_db.py` | `python utils/init_db.py` |
| Run the Flask server | `python3 app.py` | `python app.py` |

Visit [http://localhost:11000](http://localhost:11000) to view the API documentation.

## 2. Current Features

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
* Add/Delete/Update item to the cart

Developer
* View all menus using API Call
* View all users using API Call

## 3. View the database

The database is the file [project.db](./project.db). For viewing the sqlite database, use some online sqlite viewer, or the [SQLiteStudio](https://sqlitestudio.pl/). It has both windows and mac versions. 

The tables are defined in the [utils/init_db.py](./utils/init_db.py) file. And if you need to modify the tables, make sure apply the **reset the database** step below. 

## 4. Backend Test (pytest & Local Server)

The backend tests are written using the `pytest` framework. You can run the tests using the command,

| Step | Mac/Linux | Windows |
|------|-----------|---------|
| Open a terminal at the project root folder | `cd backend` | `cd backend` |
| Run the tests | `pytest` | `pytest` |

## 5. Backend Docker

`Dockerfile` is provided to run the backend server in a docker container.

1. Please open the `Docker Desktop` application. 

2. Open a terminal at the project root folder and run the following command

    ```sh
    cd backend      # if the terminal is not ready in the backend folder
    docker-compose up --force-recreate --build
    ```

3. (Optional) Run the pytest from the docker environment (On Different shell)

    ```sh
    cd backend      # if the terminal is not ready in the backend folder
    docker exec -it backend pytest # backend is the container name.
    ```

## 6. Reset the Database During Development

| Step | Mac/Linux | Windows |
|------|-----------|---------|
| Open a terminal at the project root folder | `cd backend` | `cd backend` |
| Run the initialization file | `python3 utils/init_db.py` | `python utils/init_db.py` |
