from collector.sys_log import collect_sys_log
from collector.net_log import collect_net_logs
from collector.parse import save_logs

system = collect_sys_log()
network = collect_net_logs()

save_logs("logs/collected_logs.jsonl", {"system": system,"network": network})

print("Logs Collected Sucessfully!")
