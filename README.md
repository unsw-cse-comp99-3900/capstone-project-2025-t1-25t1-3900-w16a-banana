# Food Delivery App - Team 3900-W16A-Banana

## 1. Project Description

With the growing demand for on-demand food delivery, restaurants are seeking efficient solutions to connect with customers and manage orders seamlessly. Many current food delivery platforms face challenges such as inefficient order management, poor communication between customers, restaurants, and delivery drivers. To address these issues, this project proposes a food delivery mobile application that provides a seamless and user-friendly experience for all participants. We will present our solutions to improve order efficiency, enhance communication, and optimize the delivery process, ensuring a smooth and reliable service for both businesses and customers. In addition, we integrate the ChatGPT API. We encourage restaurant managers to build their own chatbots for automated customer interaction during ordering and menu recommendations. Furthermore, customers can also use the chatbots to get quick responses to common queries, such as order status and payment inquiries.

---

## 2. Backend Setup & Testing
## 2-1A. Setup Server (Local)
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

## 2-1B. Setup Server (Local / For Linux/WSL)
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

## 2-2A. Backend Test (pytest & Docker)
1. **Make sure that the docker for backend is running**
   ```sh
   docker-compose up --force-recreate --build
   ```
2. **Run the pytest from the docker environment (On Differenet shell)**
   ```sh
   docker exec -it backend pytest # backend is the container name.
   ```

## 2-2B. Backend Test (pytest & Local Server)
1. **Ensure that backend server is running.**

2. **Move to backend folder**
   ```sh
   cd backend
   ```

3. **Run pytest**
   ```sh
   pytest
   ```

## 2-3. Backend Database Setup (Optional)
 - Run this when you get error from DB. For example, when you made changes to DB Schema.
 - **Reset all tables**
   ```sh
   python3 backend/utils/init_db.py
   ```

__________________________________________
The **Swagger API Documentation** will be available at:  
📍 `http://localhost:11000/`

__________________________________________

The backend port is changed to 11000 to avoid port conflict on the mac os machine. 

If you want to run the frontend, please leave the backend server running.

## 3. Frontend Setup (Local Development)

The frontend includes some mobile apps using React Native and Expo. 

Detailed set up will be updated soon...

---

## 4. Docker Setup (for week 5, week 8, week 10 demo)
To run the project using docker

1. **Clone the repository**
   ```sh
   git clone git@github.com:unsw-cse-comp99-3900/capstone-project-2025-t1-25t1-3900-w16a-banana.git
   cd capstone-project-2025-t1-25t1-3900-w16a-banana
   ```

2. **Ensure Docker Desktop is running**  
   Open **Docker Desktop** on your machine.

3. **Build and start all services**
   ```sh
   docker-compose up --force-recreate --build
   ```

4. **Access the frontend (mobile app)**

    More details will be updated soon...

---

## 5. Team Members

| Name        | ZID       | Email                        | Role                 |
|------------|----------|----------------------------|----------------------|
| Wen Yi     | Z5396337 | Z5396337@student.unsw.edu.au | Scrum Master, Frontend Developer |
| Kwok Yu Siu | Z5458029 | Z5458029@student.unsw.edu.au | Frontend Developer  |
| Tong Ding  | Z5490086 | Z5490086@student.unsw.edu.au | Frontend Developer  |
| Xianyu Cai | Z5454843 | Z5454843@student.unsw.edu.au | Backend Developer   |
| Qiyao Zhou | Z5306160 | Z5306160@student.unsw.edu.au | Backend Developer   |
| Seokho Yang | Z5337452 | Z5337452@student.unsw.edu.au | Project Owner, Backend Developer   |
