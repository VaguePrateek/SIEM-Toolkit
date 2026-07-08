from core.pipeline import process_log

raw_log = "Failed password for admin from 192.168.1.15 using TCP port 22"

event = process_log(raw_log)

print(event.to_dict())