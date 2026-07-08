import re

def detect_event(raw_log:str) -> str:
    log = raw_log.lower()

    if "failed password" in log:
        return "failed_login"
    elif "accepted password" in log:
        return "successful_login"
    elif "connection" in log:
        return "network_connection"
    elif "port scan" in log:
        return "port_scan"
    elif "malware" in log:
        return "malware"
    
    return "unknown"

def extract_ip(raw_log:str):
    ips = re.findall(r"(?:\d{1,3}\.){3}\d{1,3}", raw_log)
    source_ip = ips[0] if len(ips)>0 else None
    dest_ip = ips[1] if len(ips)>1 else None

    return source_ip, dest_ip

def extract_user(raw_log:str):
    match = re.search(r"(?:for|user)\s+([a-zA-Z0-9_.-]+)", raw_log, re.IGNORECASE)
    
    if match:
        return match.group(1)
    
    return None

def extract_port(raw_log:str):
    match = re.search(r"port\s+(\d+)", raw_log, re.IGNORECASE)

    if match:
        return int(match.group(1))
    
    return None

def extract_proto(raw_log:str):
    protocols = ["TCP","UDP","ICMP"]

    for protocol in protocols:
        if protocol.lower() in raw_log.lower():
            return protocol
        
    return None