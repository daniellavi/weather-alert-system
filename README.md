## How to Run the Project

1. Clone the repository and navigate to the project folder:
   ```bash
   git clone <repo-url>
   cd weather-alert-system
2. Create a .env file in the root directory with the following values:
3. ```bash
   TOMORROW_API_KEY=your_api_key
   PORT=3000
   ALERT_EVAL_INTERVAL_MINUTES=1
   SENDGRID_API_KEY=your_api_key
   FROM_EMAIL=your_verified_email
4. Install dependencies:
   ```bash
   npm install
6. Start the server:
   ```bash
   npm start
7. Run the client:
   ```bash
   npm run dev
8. Open http://localhost:5173 in your browser to view the web app.
9. Login credentials:
   - Username: Any value
   - Password: weather123
