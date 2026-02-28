
from flask import Flask
import os

app = Flask(__name__)

@app.route("/")
def home():
    return "Backend running"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
    '''"""
Retail Fusion Backend - FULL FIXED VERSION
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import numpy as np
from sklearn.linear_model import LinearRegression
import requests
import random
import time
from threading import Thread

app = Flask(__name__)
CORS(app)


transactions = []

products = {
    "SKU001": {"name": "Wireless Headphones", "price": 79.99, "current_stock": 150},
    "SKU002": {"name": "USB-C Cable", "price": 14.99, "current_stock": 420},
    "SKU003": {"name": "Phone Case", "price": 24.99, "current_stock": 280},
    "SKU004": {"name": "Screen Protector", "price": 9.99, "current_stock": 350},
    "SKU005": {"name": "Wireless Charger", "price": 49.99, "current_stock": 120},
}

historical_sales = {
    "SKU001": [8,9,12,11,10,13,14,11,9,12,15,14,13,11,10,12,14,13,11,12,13,14,12,11,10,13,12,14,15,13],
    "SKU002": [25,28,32,30,26,29,31,28,25,30,35,32,28,26,29,31,30,28,27,29,32,30,28,26,25,28,31,30,29,32],
    "SKU003": [15,16,18,17,14,16,19,18,15,17,20,19,17,15,16,18,19,17,16,18,19,18,17,15,14,17,18,19,20,18],
    "SKU004": [20,22,25,23,21,24,26,23,21,24,28,26,24,22,23,25,26,24,23,25,26,25,24,22,21,24,25,26,27,25],
    "SKU005": [6,7,8,7,6,7,9,8,6,7,10,9,8,7,6,8,9,8,7,8,9,8,7,6,5,7,8,9,10,8],
}

weather_data = {"temp": 28, "condition": "Clear"}

# ================= WEATHER =================
def fetch_weather():
    try:
        response = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={"latitude":13.0827,"longitude":80.2707,"current":"temperature_2m"},
            timeout=5
        )
        data = response.json()
        weather_data["temp"] = data.get("current", {}).get("temperature_2m", 28)
    except:
        pass

# ================= FORECAST =================
def forecast_demand(sku, days=7):
    sales = historical_sales.get(sku, [0]*30)
    X = np.arange(len(sales)).reshape(-1,1)
    y = np.array(sales)
    model = LinearRegression().fit(X,y)
    future = np.arange(len(sales), len(sales)+days).reshape(-1,1)
    return np.maximum(model.predict(future),0).round(0).tolist()

# ================= REORDER =================
def calculate_reorder(sku):
    product = products[sku]
    forecast = forecast_demand(sku)
    total = sum(forecast)
    reorder_point = total*1.2
    stock = product["current_stock"]

    if stock < reorder_point*0.3:
        status="critical"
    elif stock < reorder_point*0.7:
        status="low"
    else:
        status="healthy"

    suggested = int(reorder_point*1.3) if status!="healthy" else 0

    return {
        "sku":sku,
        "name":product["name"],
        "current_stock":stock,
        "forecasted_7day_demand":round(total,1),
        "reorder_point":round(reorder_point,1),
        "suggested_quantity":suggested,
        "status":status,
        "days_of_stock":round(stock/(total/7),1) if total>0 else 999
    }

# ================= SIMULATION =================
def simulate_transactions():
    while True:
        time.sleep(random.randint(2,4))
        sku=random.choice(list(products.keys()))
        qty=random.randint(1,12)

        txn={
            "id":f"TXN{int(time.time()*1000)}",
            "timestamp":datetime.now().isoformat(),
            "sku":sku,
            "product_name":products[sku]["name"],
            "quantity":qty,
            "unit_price":products[sku]["price"],
            "total_amount":qty*products[sku]["price"],
            "is_anomaly":False,
            "z_score":0
        }

        transactions.append(txn)
        products[sku]["current_stock"]=max(0,products[sku]["current_stock"]-qty)

        if len(transactions)>100:
            transactions.pop(0)

# ================= PLACE ORDER =================
@app.route("/api/place-order", methods=["POST"])
def place_order():
    data=request.json
    sku=data.get("sku")
    qty=data.get("quantity",0)

    if sku not in products:
        return jsonify({"error":"Invalid SKU"}),400

    products[sku]["current_stock"]+=qty

    return jsonify({
        "message":"Order placed",
        "sku":sku,
        "new_stock":products[sku]["current_stock"]
    })

# ================= DASHBOARD =================
@app.route("/api/dashboard")
def dashboard():
    fetch_weather()
    total_revenue=sum(t["total_amount"] for t in transactions)

    return jsonify({
        "metrics":{
            "total_transactions":len(transactions),
            "anomalies_detected":0,
            "total_revenue":round(total_revenue,2),
            "avg_transaction_value":round(total_revenue/max(len(transactions),1),2)
        },
        "recent_transactions":transactions[-10:],
        "forecasts":[{"sku":s,"name":products[s]["name"],"forecast":forecast_demand(s)} for s in products],
        "reorder_suggestions":[calculate_reorder(s) for s in products],
        "inventory":[{"sku":s,"name":products[s]["name"],"stock":products[s]["current_stock"],"price":products[s]["price"]} for s in products],
        "weather":weather_data
    })

if __name__=="__main__":
    Thread(target=simulate_transactions,daemon=True).start()
    app.run(debug=True,port=5000)
'''