# Database connection helper for the SIEM application.
import sqlite3

DATABASE_NAME = "siem.db"


def get_connection():
    # Return a new SQLite connection to the local database file.
    return sqlite3.connect(DATABASE_NAME)