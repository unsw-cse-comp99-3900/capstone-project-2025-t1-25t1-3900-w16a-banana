# Food Delivery App - Team 3900-W16A-Banana

## 1. Project Description

With the growing demand for on-demand food delivery, restaurants are seeking efficient solutions to connect with customers and manage orders seamlessly. Many current food delivery platforms face challenges such as inefficient order management, poor communication between customers, restaurants, and delivery drivers. To address these issues, this project proposes a food delivery mobile application that provides a seamless and user-friendly experience for all participants. We will present our solutions to improve order efficiency, enhance communication, and optimize the delivery process, ensuring a smooth and reliable service for both businesses and customers. In addition, we integrate the ChatGPT API. We encourage restaurant managers to build their own chatbots for automated customer interaction during ordering and menu recommendations. Furthermore, customers can also use the chatbots to get quick responses to common queries, such as order status and payment inquiries.

## 2. Demo Setup (for week 5, week 8, week 10 demo)

1. **Clone the repository**

    ```sh
    git clone git@github.com:unsw-cse-comp99-3900/capstone-project-2025-t1-25t1-3900-w16a-banana.git
    
    cd capstone-project-2025-t1-25t1-3900-w16a-banana
    ```

2. **Ensure Docker Desktop is running**  

    Open **Docker Desktop** on your machine.

3. (Only for Windows) The backend has a shell script [backend/entrypoint.sh](./backend/entrypoint.sh) that may be converted to CRLF line endings when on Windows. So we need to convert it to LF line endings before running the docker service. We also need to `chmod +x` on the file to make sure it can run.

    ```sh
    # open a git bash terminal(!!) at the project root folder.

    dos2unix backend/entrypoint.sh
    
    # the terminal will show:
    # dos2unix: converting file backend/entrypoint.sh to Unix format ...
    # then apply the chmod +x line:

    chmod +x backend/entrypoint.sh

    # this command will not return any results.
    ```

4. **Build and start all services**

    ```sh
    docker-compose up --force-recreate --build
    ```

    Visit [http://localhost:19006](http://localhost:19006) to use the app.

5. Default data

    The project has default data for all user types. Please view [demo-materials/README.md](./demo-materials/README.md) for more information. And we have also prepared some images for you to upload during using the app. They are in the [demo-materials folder](./demo-materials/).

## 3. Backend Setup & Testing
## 3-1A. Setup Server (Local)
To set up the **backend** server, follow these steps:

1. **Navigate to the backend directory**
   ```sh
   cd backend
   ```

2. **Install dependencies**
   ```sh
   pip install -r requirements.txt  # Use pip3 if on macOS
   ```

3. **Run the Flask server**
   ```sh
   python app.py  # Use python3 if necessary
   ```

## 3-1B. Setup Server (Local / For Linux/WSL)
To set up the **backend** folder, follow these steps:

1. **Navigate to the backend directory**
   ```sh
   cd backend
   ```

2. **Creating virtual environment**
   ```sh
   python3 -m venv venv # install venv if required
   ```

3. **Activate the virtual environment**
   - Start from here if you already created virtual envrionment.
   ```sh
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```sh
   pip install -r requirements.txt
   ```

5. **Run the Flask server**
   ```sh
   python app.py
   ```

## 3-2A. Backend Test (pytest & Docker)
1. **Make sure that the docker for backend is running**
   ```sh
   docker-compose up --force-recreate --build
   ```
2. **Run the pytest from the docker environment (On Differenet shell)**
   ```sh
   docker exec -it backend pytest # backend is the container name.
   ```

## 3-2B. Backend Test (pytest & Local Server)
1. **Ensure that backend server is running.**

2. **Move to backend folder**
   ```sh
   cd backend
   ```

3. **Run pytest**
   ```sh
   pytest
   ```

## 3-3. Backend Database Setup (Optional)
 - Run this when you get error from DB. For example, when you made changes to DB Schema.
 - **Reset all tables**
   ```sh
   python3 backend/utils/init_db.py
   ```
__________________________________________

The **Swagger API Documentation** will be available at:  
📍 `http://localhost:11000/`

__________________________________________

## 4. Frontend Setup (Local Development)

The frontend includes some mobile apps using React Native and Expo. 

```sh
cd frontend

npm install

npm start
```

The Expo DevTools will show a QR code that you can scan using the Expo Go App on the mobile devices. 

Or enter `w` in the terminal to open the project in the web browser. This will open the app at [http://localhost:8081](http://localhost:8081).

If you have installed Android Studio, you can open any Android Emulator. Then enter `a` in the terminal to run the app on the emulator.

For the project to be running, make sure the backend server is running.

## 5. Team Members

| Name        | ZID       | Email                        | Role                 |
|------------|----------|----------------------------|----------------------|
| Wen Yi     | Z5396337 | Z5396337@student.unsw.edu.au | Scrum Master, Frontend Developer |
| Kwok Yu Siu | Z5458029 | Z5458029@student.unsw.edu.au | Frontend Developer  |
| Tong Ding  | Z5490086 | Z5490086@student.unsw.edu.au | Frontend Developer  |
| Xianyu Cai | Z5454843 | Z5454843@student.unsw.edu.au | Backend Developer   |
| Qiyao Zhou | Z5306160 | Z5306160@student.unsw.edu.au | Backend Developer   |
| Seokho Yang | Z5337452 | Z5337452@student.unsw.edu.au | Project Owner, Backend Developer   |
