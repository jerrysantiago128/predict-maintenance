+----------------------------------------------------+
|                RoboTrack Warehouse                 |
|  (Fleet of Autonomous Robots with IoT Sensors)     |
|                                                    |
|  +-----------------+   +----------------------+    |
|  | Robot 1         |   | Robot 2              |    |
|  | Temp, Vibe, Batt|   | Temp, Vibe, Batt     |    |
|  +-----------------+   +----------------------+    |
|        ...                    ...                  |
|  +-----------------+   +-----------------------+   |
|  | Robot N         |   |  Robot N              |   |
|  | Temp, Vibe, Batt|   |  Temp, Vibe, Batt     |   |
|  |                 |   |                       |   |
|  +-----------------+   +-----------------------+  |
+----------------------------------------------------+
                 |                     |
                 | Sensor Data Streams |
                 v                     v
+----------------------------------------------------+
|              Data Collection Layer                 |
|  - Receives real-time sensor data from robots      |
|  - Stores data in a central repository             |
+----------------------------------------------------+
                 |
                 v
+----------------------------------------------------+
|                Data Analysis Engine                |
|  - Processes sensor data (threshold checks, rules) |
|  - Detects anomalies and potential failures        |
|  - Triggers alerts based on analysis               |
+----------------------------------------------------+
                 |
                 v
+----------------------------------------------------+
|              Maintenance Dashboard UI              |
|  - Displays robot status (Healthy/Alert)           |
|  - Lists current alerts and system logs            |
|  - Allows user actions (acknowledge, resolve)      |
+----------------------------------------------------+
                 |
                 v
+----------------------------------------------------+
|              Maintenance Team (End-Users)          |
|  - Monitors dashboard                              |
|  - Responds to alerts                              |
|  - Performs maintenance actions as needed          |
+----------------------------------------------------+
