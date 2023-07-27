width = 800;
height = 600;

data = readtable('global_temperature_anomalies.csv');
years = data.Year;
temp_anomalies = data.TemperatureAnomaly__C_;
temp_anomalies = (temp_anomalies - min(temp_anomalies)) / (max(temp_anomalies) - min(temp_anomalies));

% Interpolate the years and temperature anomalies to generate 10 data points per year
interp_years = min(years):0.1:max(years);
interp_temp_anomalies = interp1(years, temp_anomalies, interp_years, 'linear');

fig = figure;
axis tight manual;
ax = gca;
ax.set('XLim',[0 width],'YLim',[0 height]);

v = VideoWriter('theLissajousCurvesOfClimateChange.avi');
v.Quality = 100;
open(v);

for i = 1:length(interp_years)
    a = i / 100;
    b = i / 100 * interp_temp_anomalies(i);
    delta = pi / 2 * interp_temp_anomalies(i);

    t = 0:0.01:2*pi;
    x = sin(a * t + delta);
    y = sin(b * t);
    
    x = ((x + 1) / 2) * width;
    y = ((y + 1) / 2) * height;

    color = [interp_temp_anomalies(i), 0.7 - interp_temp_anomalies(i)*0.7, 0.7 - interp_temp_anomalies(i)*0.7, max(1 - i/2000, 0)]; % Brighter color with slow disappearing effect
    plot(x, y, 'Color', color, 'LineWidth', 4);

    set(gca, 'Color', 'k');

    frame = getframe(ax);
    writeVideo(v, frame);
    
    cla;
    set(gca,'Color','k');
end

close(v);
