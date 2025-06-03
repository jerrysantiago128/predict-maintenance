# Project Tech Stack

Warehouse/Robots: MQTT, Python, ESP32, various Sensors

Data Collection: MQTT to Kakfa Broker, **MongoDB** for raw storage

Data Analysis: Apache Spark?, Java OR Python (library rich), Redis Cache, PostgreSQL for data aggregation
    - java may be easier based on experience, python may be faster and allow future ML additions for predicton, etc

Dashboard: **React.js(jsx, tsx)** for baseline, **Recharts** or Chart.js for charting and data visualization (potentially custom CSS), Dedicated API for frontend (intermediary for querying postgres and redis), **Axios or native fetch**
