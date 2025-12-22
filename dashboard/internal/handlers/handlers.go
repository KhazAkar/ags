package handlers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
	"sync"

	"dashboard/internal/config"
	"dashboard/internal/database"
	"dashboard/internal/models"

	"github.com/go-echarts/go-echarts/v2/charts"
	"github.com/go-echarts/go-echarts/v2/opts"
	"github.com/go-echarts/go-echarts/v2/types"
)

type Handler struct {
	db     *database.DB
	cfg    *config.Config
	tmpl   *template.Template
	tmplMu sync.RWMutex
}

func New(db *database.DB, cfg *config.Config) (*Handler, error) {
	h := &Handler{
		db:  db,
		cfg: cfg,
	}
	if err := h.loadTemplates(); err != nil {
		return nil, err
	}
	return h, nil
}

func (h *Handler) loadTemplates() error {
	h.tmplMu.Lock()
	defer h.tmplMu.Unlock()

	// Parse all templates in the templates directory
	pattern := filepath.Join(h.cfg.TemplatesPath, "*.html")
	tmpl, err := template.ParseGlob(pattern)
	if err != nil {
		return fmt.Errorf("failed to parse templates from %s: %w", pattern, err)
	}
	h.tmpl = tmpl
	return nil
}

func (h *Handler) Ingest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var reading models.SensorReading
	if err := json.NewDecoder(r.Body).Decode(&reading); err != nil {
		http.Error(w, fmt.Sprintf("Invalid JSON: %v", err), http.StatusBadRequest)
		return
	}

	// Use request context
	if err := h.db.InsertReading(r.Context(), reading); err != nil {
		log.Printf("Error inserting reading: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(map[string]string{"status": "success"}); err != nil {
		log.Printf("Error encoding response: %v", err)
	}
}

func (h *Handler) Dashboard(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Use request context
	readings, err := h.db.GetReadings(r.Context())
	if err != nil {
		log.Printf("Error loading data: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		h.renderTemplate(w, "error.html", map[string]interface{}{
			"error": "Failed to load sensor data. Please try again later.",
		})
		return
	}

	// Render empty dashboard if no data
	if len(readings) == 0 {
		h.renderTemplate(w, "index.html", map[string]interface{}{"charts": []template.HTML{}})
		return
	}

	chartList := []*charts.Line{
		createLineChart("Air Pressure (hPa)", readings, func(r models.SensorReading) float64 { return r.AirPressure }),
		createLineChart("Light Intensity (%)", readings, func(r models.SensorReading) float64 { return r.LightIntensity }),
		createLineChart("Soil Temperature (°C)", readings, func(r models.SensorReading) float64 { return r.SoilTemp }),
		createLineChart("Soil Moisture (%)", readings, func(r models.SensorReading) float64 { return r.SoilMoisture }),
		createLineChart("Air Temperature (°C)", readings, func(r models.SensorReading) float64 { return r.AirTemp }),
		createLineChart("Air Humidity (%)", readings, func(r models.SensorReading) float64 { return r.AirHumidity }),
	}

	var chartComponents []template.HTML
	for i, chart := range chartList {
		chartID := fmt.Sprintf("chart_%d", i)
		chart.SetGlobalOptions(charts.WithInitializationOpts(opts.Initialization{
			Theme:   types.ThemeWesteros,
			Width:   "100%",
			Height:  "400px",
			ChartID: chartID, // Set ID explicitly for echarts
		}))

		// Render chart JSON
		chartJSON, _ := json.Marshal(chart.JSON())

		// The original script logic was manual, but go-echarts helps a bit.
		// However, to match the original template structure which expects HTML snippets:
		script := fmt.Sprintf(
			`<div id="%s" style="width:100%%;height:400px;"></div>
			<script>
				var %s = echarts.init(document.getElementById('%s'), 'westeros'); 
				%s.setOption(%s);
			</script>`,
			chartID, chartID, chartID, chartID, string(chartJSON))

		chartComponents = append(chartComponents, template.HTML(script))
	}

	h.renderTemplate(w, "index.html", map[string]any{"charts": chartComponents})
}

func (h *Handler) renderTemplate(w http.ResponseWriter, name string, data interface{}) {
	h.tmplMu.RLock()
	defer h.tmplMu.RUnlock()

	if err := h.tmpl.ExecuteTemplate(w, name, data); err != nil {
		log.Printf("Error executing template %s: %v", name, err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

func createLineChart(title string, readings []models.SensorReading, getValue func(models.SensorReading) float64) *charts.Line {
	line := charts.NewLine()
	line.SetGlobalOptions(
		charts.WithTitleOpts(opts.Title{Title: title}),
		charts.WithTooltipOpts(opts.Tooltip{Show: true, Trigger: "axis"}),
		charts.WithXAxisOpts(opts.XAxis{Name: "Time"}),
		charts.WithYAxisOpts(opts.YAxis{Name: title}),
		// Initialization opts are set in the loop to handle IDs
	)

	var xData []string
	var yData []opts.LineData

	for _, reading := range readings {
		xData = append(xData, reading.Timestamp.Format("15:04"))
		yData = append(yData, opts.LineData{Value: getValue(reading)})
	}

	line.SetXAxis(xData).AddSeries(title, yData).SetSeriesOptions(
		charts.WithLineChartOpts(opts.LineChart{Smooth: true}),
	)
	return line
}
