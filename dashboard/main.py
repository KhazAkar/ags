import json
import sqlite3

import falcon
import falcon.asgi
import pandas as pd
import uvicorn
from bokeh.embed import components
from bokeh.layouts import row
from bokeh.plotting import figure
from jinja2 import Environment, FileSystemLoader

# Initialize Jinja2
env = Environment(loader=FileSystemLoader('templates'))
env.filters['zip'] = zip

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
    timestamp, soil_moisture, light_intensity, soil_temp, air_temp, air_humidity, air_pressure = data_line.split(',')
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
        try:
            data = load_data()
            # Create bokeh plot to display
            sensors = {
                'air_pressure': 'Air Pressure (hPa)',
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
                    width=800,
                    height=300,
                    sizing_mode='scale_both',
                    tools="pan,wheel_zoom,box_zoom,reset,save",
                    active_drag="pan",
                    active_scroll="wheel_zoom"
                )
                p.line(pd.to_datetime(data['timestamp']), data[key].to_numpy(), line_width=8, color='green', alpha=0.8)
                p.scatter(pd.to_datetime(data['timestamp']), data[key], size=6, color='navy', alpha=0.6)
                p.xaxis.axis_label = 'Time'
                p.yaxis.axis_label = label
                plots.append(p)
            # layout = gridplot(grid)
            layout = row(*plots)
            # Generate separate div and script pairs for each plot
            bokeh_divs = []
            bokeh_scripts = []
            for plot in plots:
                script, div = components(plot)
                bokeh_scripts.append(script)
                bokeh_divs.append(div)

            tmpl = env.get_template('index.html')
            html = tmpl.render(bokeh_scripts=bokeh_scripts, bokeh_divs=bokeh_divs)

            resp.status = falcon.HTTP_200
            resp.content_type = falcon.MEDIA_HTML
            resp.text = html
        except Exception as e:
            print(f"Error in on_get: {e}")
            resp.status = falcon.HTTP_500
            resp.text = f"Internal Server Error: {e}"

class IngestResource():
    async def on_post(self, req, resp):
        try:
            data = await req.stream.readall()
            data_json = json.loads(data)
            status = insert_data(data_json["data"])
            resp.status = falcon.HTTP_200
            if not status:
                resp.status = falcon.HTTP_403
        except Exception as e:
            print(f"Error in on_post: {e}")
            resp.status = falcon.HTTP_500
            resp.text = f"Internal Server Error: {e}"

app = falcon.asgi.App()
app.add_route('/', PlotResource())
app.add_route('/ingest', IngestResource())

if __name__ == "__main__":
    init_db()
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
