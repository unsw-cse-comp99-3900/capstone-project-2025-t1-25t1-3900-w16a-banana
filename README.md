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

3. **Build and start all services**

    Open a terminal and run the `docker-compose` command to build and start the services.

    ```sh
    docker-compose up --force-recreate --build
    ```

    Visit the following urls:

    | Platform | URL |
    |----------|-----|
    | Frontend (**main app**) | [http://localhost:19006](http://localhost:19006) |
    | Backend (API Documentation) | [http://localhost:11000](http://localhost:11000) |

4. We recommend using the Google Chrome browser. In order to use the app screen, press `ctrl + shift + i` to open the developer tools. Then click on the toogle device toolbar icon (or press `ctrl + shift + m`) to switch to mobile view. You can also use the simulator in the Expo DevTools.

    We recommend using the `iphone-12-pro-max` device in the simulator.

    <img src="./docs/readme_images/iphone-device-developer-option.png" alt="iphone device screen" width="300" height="450">

5. Default data

    The project has default data for all user types. Please view [demo-materials/README.md](./demo-materials/README.md) for more information. And we have also prepared some images for you to upload during using the app. They are in the [demo-materials folder](./demo-materials/).

6. When you login as a `customer` or `driver`, please turn on the location service in the Chrome browser. Otherwise, the app will not be able to demo the full functionality.

    <!-- | Image | Description |
    |-------|-------------|
    | <img src="./docs/readme_images/location dialog.png" alt="location dialog" height="400"> | When the location service is off, the app will show a dialog window to ask for opening the location |
    | <img src="./docs/readme_images/turn on location in chrome.png" alt="turn on location in chrome" height="400"> | Please click the icon next to the URL and open the location service |
    | <img src="docs\readme_images\location turn on customer effect.png" alt="location turn on customer effect" height="400"> | After the location service is turned on, the app will show the location of the customer relative to each restaurant. | -->

    | Image | Description |
    |-------|-------------|
    | ![location dialog](./docs/readme_images/location_dialog.png) | When the location service is off, the app will show a dialog window to ask for opening the location |
    | ![turn on location in chrome](./docs/readme_images/location_turn_on_in_chrome.png) | Please click the icon next to the URL and open the location service |
    | ![location turn on customer effect](./docs/readme_images/location_turned_on_in_customer.png) | After the location service is turned on, the app will show the location of the customer relative to each restaurant. And the suburb where the customer is currently at is also shown on the top of the page |

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
