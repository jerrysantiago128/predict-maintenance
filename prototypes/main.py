import temperature_sensor
import battery_sensor
import vibration_sensor

if __name__ == "__main__":
    temperature_json_data = temperature_sensor.generate_temperature_data()
    print("Temperature Data:\n", temperature_json_data)

    # Optional: Save to a file
    with open("temperature_data.json", "w") as f:
        f.write(temperature_json_data)
        print("Temperature data saved to temperature_data.json")


    battery_json_data = battery_sensor.generate_battery_data()
    print("\nBattery Data:\n", battery_json_data)

    # Optional: Save to a file
    with open("battery_data.json", "w") as f:
        f.write(battery_json_data)
        print("Battery data saved to battery_data.json")


    vibration_json_data = vibration_sensor.generate_vibration_data()
    print("\nVibration Data:\n", vibration_json_data)

    # Optional: Save to a file
    with open("vibration_data.json", "w") as f:
        f.write(vibration_json_data)
        print("Vibration data saved to vibration_data.json")
