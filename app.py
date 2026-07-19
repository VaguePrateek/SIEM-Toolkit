from core.pipeline import process_log

raw_log = "Malware detected on host from 45.33.32.156"

event = process_log(raw_log)

print(event.to_dict())