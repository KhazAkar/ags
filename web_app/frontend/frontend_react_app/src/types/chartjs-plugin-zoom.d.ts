import 'chart.js';
import { ZoomOptions } from 'chartjs-plugin-zoom';

declare module 'chart.js' {
  interface PluginOptionsByType<TType> {
    zoom?: ZoomOptions;
  }
}