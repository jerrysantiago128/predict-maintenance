```mermaid
graph TD
  subgraph Warehouse
    R[Autonomous Warehouse Robots with Sensors]
  end
  subgraph Business Logic
    DC[Data Collection Layer]
    DB[Data Storage]
    AE[Analysis Engine]
  end
  subgraph UI
    MD[Maintenance Dashboard]
  end

  R --> DC
  DC --> AE
  AE --> MD
  AE --> DB
