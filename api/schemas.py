from pydantic import BaseModel


class LogRequest(BaseModel):
    raw_log: str