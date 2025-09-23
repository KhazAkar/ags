import sqlite3
import falcon
import pandas as pd
from datetime import datetime
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
            pressure REAL,
            light_intensity REAL,
            soil_temp REAL,
            soil_moisture REAL,
            air_temp REAL,
            air_humidity REAL,
            air_pressure REAL
        );
        """)
        conn.commit()

# TODO: Fix insertion
# def insert_data(data_line: str):
#     moisture, light_intensity, soil_temp, air_temp, air_hum, pressure = data_line.split(',')
#     timestamp = datetime.now().isoformat()
#     with sqlite3.connect("data.db") as conn:
#         _ = conn.execute("""
#             INSERT INTO readings (timestamp, pressure, light_intensity, soil_temp, )VALUES(?, ?, ?, ?, ?, ?, ?)
#             """,
#         (timestamp, moisture, light_intensity, soil_temp, air_temp, air_hum, pressure))
#         conn.commit()

class PlotResource:
    def on_get(self, req, resp):
        data = load_data()
        # Create bokeh plot to display
        sensors = {
            'soil_moisture': 'Soil Moisture (%)',
            'light_intensity': 'Light Intensity (%)',
            'soil_temp': 'Soil Temperature (°C)',
            'air_temp': 'Air Temperature (°C)',
            'air_humidity': 'Air Humidity (%)',
            'pressure': 'Air Pressure (hPa)',
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
    def on_post(self, req, resp):



        resp.content_type = falcon.MEDIA_JSON
        resp.text = {"status": "OK"}
        resp.status = falcon.HTTP_200

if __name__ == "__main__":
    init_db()
    app = falcon.App()
    app.add_route('/', PlotResource())
    app.add_route('/ingest', IngestResource())
