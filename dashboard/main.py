import sqlite3
import falcon
from jinja2 import Environment, FileSystemLoader
from bokeh.plotting import figure
from bokeh.embed import components

# Initialize Jinja2
env = Environment(loader=FileSystemLoader('templates'))

def load_data() -> str:
    data = ""
    with sqlite3.connect("data.db") as conn:
        cursor = conn.execute('SELECT x, y FROM measurements')
        data = cursor.fetchall()
    return data

class PlotResource:
    def on_get(self, req, resp):
        data = load_data()
        xs, ys = zip(*data)

        # Create bokeh plot to display
        p = figure(title='Measurements', x_axis_label='X', y_axis_label='Y')
        p.circle(xs, ys, size=8, color='navy', alpha=0.5)

        # Extract script & div components
        script, div = components(p)

        tmpl = env.get_template('index.html')
        html = tmpl.render(bokeh_script=script, bokeh_div=div)

        resp.content_type = falcon.MEDIA_HTML
        resp.text = html

# 5. Falcon app
app = falcon.App()
app.add_route('/', PlotResource())
