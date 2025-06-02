import json
import datetime
import random

def generate_temperature_data(num_entries=100, sensor_id_prefix="TEMP", min_temp=21, max_temp=33):
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
        timestamp = datetime.datetime.now(datetime.UTC).isoformat()  # UTC timestamp in ISO format
        sensor_id = f"{sensor_id_prefix}"  # Format sensor ID with leading zeros
        temperature_celsius = round(random.uniform(min_temp, max_temp), 1) # Round to 1 decimal place
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

    return json.dumps(data, indent=2)  # Use indent for readability


if __name__ == "__main__":
    json_data = generate_temperature_data()
    print(json_data)

    # Optional: Save to a file
    with open("100-temperature_data.json", "w") as f:
        f.write(json_data)
        print("Data saved to temperature_data.json")
