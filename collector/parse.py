# Utility for appending collected logs to a file.
import json

def save_logs(filename, data):
    # Append a JSON-encoded object to the target file.
    with open(filename, "a") as f:
        f.write(json.dumps(data))
        f.write(",\n")
