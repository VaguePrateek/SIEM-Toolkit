import json

def save_logs(filename, data):
    with open(filename, "a") as f:
        f.write(json.dumps(data))
        f.write(",\n")
