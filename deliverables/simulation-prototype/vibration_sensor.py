import json
import datetime
import random

def generate_vibration_data(num_entries=100, sensor_id_prefix="VIB", max_g=2.0, max_frequency=100):
    """
    Generates a list of vibration sensor data entries in JSON format.

    Args:
        num_entries: The number of data entries to generate.
        sensor_id_prefix: A prefix for the sensor ID (e.g., "VIB").
        max_g: The maximum g-force value (positive or negative).
        max_frequency: The maximum vibration frequency (Hz).

    Returns:
        A string containing a JSON array of vibration data entries.
    """

    data = []
    for i in range(num_entries):
        timestamp = datetime.datetime.now(datetime.UTC).isoformat()
        sensor_id = f"{sensor_id_prefix}-{i + 1:03}"
        x_axis = round(random.uniform(-max_g, max_g), 2)
        y_axis = round(random.uniform(-max_g, max_g), 2)
        z_axis = round(random.uniform(-max_g, max_g), 2)
        frequency = round(random.uniform(0.1, max_frequency), 1) # Avoid 0 Hz
        notes = "Generated Vibration Data"

        entry = {
            "timestamp": timestamp,
            "sensor_id": sensor_id,
            "x_axis": x_axis,
            "y_axis": y_axis,
            "z_axis": z_axis,
            "frequency": frequency,
            "notes": notes
        }
        data.append(entry)

    return json.dumps(data, indent=2)
