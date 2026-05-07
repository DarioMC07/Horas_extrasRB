import './bootstrap';

import Alpine from 'alpinejs';
import { createChart, ColorType, CrosshairMode, LineSeries, HistogramSeries } from 'lightweight-charts';

window.Alpine = Alpine;
window.createChart = createChart;
window.ColorType = ColorType;
window.CrosshairMode = CrosshairMode;
window.LineSeries = LineSeries;
window.HistogramSeries = HistogramSeries;

Alpine.start();