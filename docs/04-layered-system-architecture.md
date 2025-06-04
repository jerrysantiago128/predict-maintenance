```mermaid
graph TD
  subgraph Warehouse
    R[Autonomous Warehouse Robots with Sensors]
  end
  DC[Data Collection Layer]
  AE[Analysis Engine]
  MD[Maintenance Dashboard]

  R --> DC
  DC --> AE
  AE --> MD
