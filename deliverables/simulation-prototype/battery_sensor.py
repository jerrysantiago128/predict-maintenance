import json
import datetime
import random

def generate_battery_data(num_entries=100, sensor_id_prefix="BAT", min_level=20, max_level=100):
    """
    Generates a list of battery sensor data entries in JSON format.

    Args:
        num_entries: The number of data entries to generate.
        sensor_id_prefix: A prefix for the sensor ID (e.g., "BAT").
        min_level: The minimum battery level percentage.
        max_level: The maximum battery level percentage.

    Returns:
        A string containing a JSON array of battery data entries.
    """

    data = []
    for i in range(num_entries):
        timestamp = datetime.datetime.now(datetime.UTC).isoformat()
        sensor_id = f"{sensor_id_prefix}-{i + 1:03}"
        battery_level = random.randint(min_level, max_level)
        voltage = round(random.uniform(3.0, 4.2), 2)  # Example voltage range
        current = round(random.uniform(-0.5, 1.0), 2) # Example current range (negative for discharge)
        charging_status = random.choice(["Charging", "Discharging", "Idle"])
        notes = "Generated Battery Data"

        entry = {
            "timestamp": timestamp,
            "sensor_id": sensor_id,
            "battery_level": battery_level,
            "voltage": voltage,
            "current": current,
            "charging_status": charging_status,
            "notes": notes
        }
        data.append(entry)

    return json.dumps(data, indent=2)
