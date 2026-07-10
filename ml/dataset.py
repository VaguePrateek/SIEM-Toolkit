from storage.database import get_connection
import json
import  pandas as pd


def load_dataset():
    conn = get_connection()
    query = """
    SELECT
        features_json,
        risk_score,
        event_type,
        severity
    FROM events
    """
    
    df = pd.read_sql_query(query, conn)
    conn.close()
    records = []

    for _,row in df.iterrows():
        if not row['features_json']:
            continue
        features = json.loads(row['features_json'])
        features['risk_score'] = row['risk_score']
        features['event_type'] = row['event_type']
        features['severity'] = row['severity']
        
        records.append(features)
    
    dataset = pd.DataFrame(records)
    dataset['label'] = (dataset['risk_score']>=40).astype(int)
    X = dataset.drop(columns=[
        "label",
        "risk_score",
        "event_type",
        "severity"
    ])

    Y = dataset["label"]


    return X,Y



