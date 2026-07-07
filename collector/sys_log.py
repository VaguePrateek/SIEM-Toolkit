import psutil
import json
from datetime import datetime

def collect_sys_log():
    log = {
        "timestamp": datetime.now().isoformat(),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent,
        "boot_time": psutil.boot_time(),
        "users": [u.name for u in psutil.users()]
    }
    return log

if __name__ == "__main__":
    print(json.dumps(collect_sys_log(),indent=4))