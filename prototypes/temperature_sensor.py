import json
import datetime
import random

def generate_temperature_data(num_entries=100, sensor_id_prefix="TEMP", min_temp=15, max_temp=30):
    """
    Generates a list of temperature sensor data entries in JSON format.

    Args:
        num_entries: The number of data entries to generate.
        sensor_id_prefix: A prefix for the sensor ID (e.g., "TEMP").
        min_temp: The minimum temperature value (Celsius).
        max_temp: The maximum temperature value (Celsius).

    Returns:
        A string containing a JSON array of temperature data entries.
    """

    data = []
    for i in range(num_entries):
        timestamp = datetime.datetime.now(datetime.UTC).isoformat()
        sensor_id = f"{sensor_id_prefix}-{i + 1:03}"
        temperature_celsius = round(random.uniform(min_temp, max_temp), 1)
        temperature_fahrenheit = round((temperature_celsius * 9/5) + 32, 1)
        notes = "Generated Temperature Data"

        entry = {
            "timestamp": timestamp,
            "sensor_id": sensor_id,
            "temperature_celsius": temperature_celsius,
            "temperature_fahrenheit": temperature_fahrenheit,
            "notes": notes
        }
        data.append(entry)

    return json.dumps(data, indent=2)
