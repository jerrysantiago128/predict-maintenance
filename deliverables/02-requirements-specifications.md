# Preliminary Requirements
---

## Functional Requirements

| ID      | Requirement Description                                                                                |
|---------|--------------------------------------------------------------------------------------------------------|
| FR-1    | The system shall collect sensor data (temperature, vibration, battery) from each robot every 1 minute. |
| FR-2    | The system shall process and analyze sensor data in real-time (within 5 seconds of collection).        |
| FR-3    | The system shall detect anomalies based on pre-defined thresholds (e.g., temperature > X°C).           |
| FR-4    | The system shall trigger an alert when a potential failure is detected.                                |
| FR-5    | The system shall display robot health status and active alerts on a dashboard.                         |
| FR-6    | The system shall allow maintenance staff to acknowledge and dismiss resolved alerts.                   |
| FR-7    | The system shall store alert logs and sensor data for later review and analysis.                       |
| FR-8    | The system shall simulate behavior using sample data (Python script or other simulation tool).         |

## Non-Functional Requirements (NFRs)

| ID    | Requirement Description                                                                                |
|-------|--------------------------------------------------------------------------------------------------------|
| NFR-1 | The system must process sensor data with a maximum 5-second delay.                                     |
| NFR-2 | The system must maintain 99.9% uptime for the monitoring service.                                      |
| NFR-3 | The dashboard UI must be intuitive and easy to navigate.                                               |
| NFR-4 | The system must support up to 100 robots in a simulated environment.                                   |   
| NFR-5 | Access to the dashboard must be restricted to authorized users only.                                   |
| NFR-6 | The system must allow configuration of thresholds for anomaly detection without modifying source code. |
| NFR-7 | The system must log alerts and system events for review and analysis.                                  |

---

