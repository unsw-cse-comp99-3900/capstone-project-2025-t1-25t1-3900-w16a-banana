# Setup Guide

0. **Requirements**
 - Terminal (Ubuntu/WSL is used here)
 - Docker
 - Git

1. **Download project files**
    
 - a. Clone the repository
    ```sh
    git clone git@github.com:unsw-cse-comp99-3900/capstone-project-2025-t1-25t1-3900-w16a-banana.git
    ```

 - b. Move into the project folder
    ```sh
    cd capstone-project-2025-t1-25t1-3900-w16a-banana
    ```

2. **Run the frontend and backend in Docker**
    ```sh
    docker-compose up --force-recreate --build
    ```


# Shutting Down the system
1. **Stop Docker**
   - `CTRL+C` to stop Docker