import json
import sqlite3
from datetime import datetime

import falcon
import falcon.asgi
import pandas as pd
import uvicorn
from bokeh.embed import components
from bokeh.layouts import column
from bokeh.plotting import figure
from jinja2 import Environment, FileSystemLoader

# Initialize Jinja2
env = Environment(loader=FileSystemLoader('templates'))

def load_data() -> pd.DataFrame:
    data = None
    with sqlite3.connect("data.db") as conn:
        data = pd.read_sql('SELECT * FROM readings ORDER BY timestamp', conn)
        data['timestamp'] = pd.to_datetime(data['timestamp'])
    return data

def init_db():
    with sqlite3.connect("data.db") as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS readings (
            timestamp TEXT,
            soil_moisture REAL,
            light_intensity REAL,
            soil_temp REAL,
            air_temp REAL,
            air_humidity REAL,
            air_pressure REAL
        );
        """)
        conn.commit()

def insert_data(data_line: str) -> bool:
    soil_moisture, light_intensity, soil_temp, air_temp, air_humidity, air_pressure = data_line.split(',')
    timestamp = datetime.now().isoformat()
    success = False
    with sqlite3.connect("data.db") as conn:
        _ = conn.execute("""
            INSERT INTO readings (timestamp, soil_moisture, light_intensity, soil_temp, air_temp, air_humidity, air_pressure) VALUES(?, ?, ?, ?, ?, ?, ?)
            """,
        (timestamp, soil_moisture, light_intensity, soil_temp, air_temp, air_humidity, air_pressure))
        conn.commit()
        success = True
    return success

class PlotResource:
    async def on_get(self, req, resp):
        data = load_data()
        # Create bokeh plot to display
        sensors = {
            'pressure': 'Air Pressure (hPa)',
            'light_intensity': 'Light Intensity (%)',
            'soil_temp': 'Soil Temperature (°C)',
            'soil_moisture': 'Soil Moisture (%)',
            'air_temp': 'Air Temperature (°C)',
            'air_humidity': 'Air Humidity (%)',
        }

        plots = []
        for key, label in sensors.items():
            p = figure(
                title=label,
                x_axis_type='datetime',
                width=600,
                height=300,
                sizing_mode='scale_width'
            )
            p.line(data['timestamp'], data[key], line_width=2, color='green')
            p.circle(data['timestamp'], data[key], size=4, color='black', alpha=0.5)
            p.xaxis.axis_label = 'Time'
            p.yaxis.axis_label = label
            plots.append(p)

        # Extract script & div components
        layout = column(*plots)
        script, div = components(layout)

        tmpl = env.get_template('index.html')
        html = tmpl.render(bokeh_script=script, bokeh_div=div)

        resp.content_type = falcon.MEDIA_HTML
        resp.text = html

class IngestResource():
    async def on_post(self, req, resp):
        data = await req.stream.readall()
        data_json = json.loads(data)["data"]
        resp.content_type = falcon.MEDIA_JSON
        status = insert_data(data_json)
        resp.text = {"status": "OK"}
        resp.status = falcon.HTTP_200
        if not status:
            resp.text = {"status": "NOK"}
            resp.status = falcon.HTTP_403

app = falcon.asgi.App()
app.add_route('/', PlotResource())
app.add_route('/ingest', IngestResource())

if __name__ == "__main__":
    init_db()
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
