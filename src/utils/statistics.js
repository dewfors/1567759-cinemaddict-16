import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getSortedGenres} from './common.js';
import {ChartSettings} from './const.js';

const BAR_HEIGHT = 50;

export const calcChart = (statisticsCtx, state) => {
  const {filmsPeriod} = state;
  const sortGenres = getSortedGenres(filmsPeriod);

  const genreNames = [];
  const genreCounts = [];
  sortGenres.forEach(([name, count]) => {
    genreNames.push(name);
    genreCounts.push(count);
  });

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticsCtx.height = BAR_HEIGHT * sortGenres.length;


  return new Chart(statisticsCtx, {
    plugins: [ChartDataLabels],
    type: ChartSettings.TYPE,
    data: {
      labels: genreNames,
      datasets: [{
        data: genreCounts,
        backgroundColor: ChartSettings.DATASETS_BACKGROUND_COLOR,
        hoverBackgroundColor: ChartSettings.DATASETS_HOVER_BACKGROUND_COLOR,
        anchor: ChartSettings.DATASETS_ANCHOR,
        barThickness: ChartSettings.DATASETS_BAR_THICKNESS,
      }],
    },
    options: {
      responsive: ChartSettings.OPTIONS_RESPONSIVE,
      plugins: {
        datalabels: {
          font: {
            size: ChartSettings.DATALABELS_FONT_SIZE,
          },
          color: ChartSettings.DATALABELS_COLOR,
          anchor: ChartSettings.DATALABELS_ANCHOR,
          align: ChartSettings.DATALABELS_ALIGN,
          offset: ChartSettings.DATALABELS_OFFSET,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartSettings.SCALES_Y_TICKS_FONT_COLOR,
            padding: ChartSettings.SCALES_Y_TICKS_PADDING,
            fontSize: ChartSettings.SCALES_Y_TICKS_FONT_SIZE,
          },
          gridLines: {
            display: ChartSettings.SCALES_Y_GRIDLINES_DISPLAY,
            drawBorder: ChartSettings.SCALES_Y_GRIDLINES_DRAW_BORDER,
          },
        }],
        xAxes: [{
          ticks: {
            display: ChartSettings.SCALES_X_TICKS_DISPLAY,
            beginAtZero: ChartSettings.SCALES_X_TICKS_BEGIN_AT_ZERO,
          },
          gridLines: {
            display: ChartSettings.SCALES_X_GRIDLINES_DISPLAY,
            drawBorder: ChartSettings.SCALES_X_GRIDLINES_DRAW_BORDER,
          },
        }],
      },
      legend: {
        display: ChartSettings.LEGEND_DISPLAY,
      },
      tooltips: {
        enabled: ChartSettings.TOOLTIPS_ENABLED,
      },
    },
  });

};
