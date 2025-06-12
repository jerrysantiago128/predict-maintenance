# Sensor Simulator Prototypes

This directory holds the python code to simulate sensor data, format said data into JSON, and save to an appropritate file for further analysis and processing.

The approach is to write specific data sensor simulators, in order to modularize the testing and simulation process for development.

Spend less time worrying about the data simulators, and more time of the data analysis.


## Setting up your environment

Install Python 3.6 or greater

Reference the link https://www.python.org/downloads/ for specific release versions.

The version used for testing the scripts is 3.8.17 and 3.13.2

## Running the Simulators

The run the simulator(s), run:

    python main.py

You should see you python code execute as intended, with 3 JSON files produced as a result.

If you plan to reformat the data produced, uncomment the `print` statements in `main.py` to see the results of the new format changes.


## Appendix

### Sensor Output formats

#### Temperature Sensor

    "timestamp": "2025-06-02T17:26:28.461198+00:00",
    "sensor_id": "TEMP-001",
    "temperature_celsius": 20.0,
    "temperature_fahrenheit": 68.0,
    "notes": "Generated Temperature Data"

#### Battery Sensor 

    "timestamp": "2025-06-02T17:26:28.473143+00:00",
    "sensor_id": "BAT-001",
    "battery_level": 89,
    "voltage": 3.3,
    "current": 0.73,
    "charging_status": "Idle",
    "notes": "Generated Battery Data"

#### Vibration Sensor

    "timestamp": "2025-06-02T17:26:28.490595+00:00",
    "sensor_id": "VIB-001",
    "x_axis": -1.28,
    "y_axis": -0.53,
    "z_axis": -1.24,
    "frequency": 65.2,
    "notes": "Generated Vibration Data"

To modify the formats above, make changes to the individual python files (battery_sensor.py, temperature_sensor.py, vibration_sensor.py)
