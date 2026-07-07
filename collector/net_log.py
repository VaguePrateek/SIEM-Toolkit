import psutil

def collect_net_logs():
    logs = []

    for conn in psutil.net_connections():
        logs.append({
            "local_ip": str(conn.laddr),
            "remote_ip": str(conn.raddr),
            "status": conn.status,
            "pid": conn.pid
        })
    
    return logs

if __name__ == "__main__":
    print(collect_net_logs())