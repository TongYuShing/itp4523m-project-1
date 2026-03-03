/**
 * ========================================
 * Premium Living Furniture - Charts & Data Visualization
 * Author: Premium Living Team
 * Version: 1.0
 * ========================================
 */

// Chart configuration
const ChartConfig = {
    colors: {
        primary: '#8B5A2B',
        secondary: '#2D3748',
        success: '#38A169',
        warning: '#ECC94B',
        danger: '#E53E3E',
        info: '#4299E1',
        gray: '#A0AEC0'
    },

    gradients: {
        primary: ['#8B5A2B', '#B48C5C'],
        success: ['#38A169', '#68D391'],
        danger: ['#E53E3E', '#FC8181']
    }
};

/**
 * Chart class for data visualization
 */
class Chart {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.options = {
            type: 'line',
            width: this.canvas.width,
            height: this.canvas.height,
            padding: 20,
            animation: true,
            animationDuration: 1000,
            showGrid: true,
            showLegend: true,
            showTooltips: true,
            ...options
        };

        this.data = [];
        this.labels = [];
        this.animationProgress = 0;

        this.init();
    }

    init() {
        // Set canvas dimensions
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;

        // Bind methods
        this.draw = this.draw.bind(this);
        this.animate = this.animate.bind(this);

        // Setup event listeners for tooltips
        if (this.options.showTooltips) {
            this.canvas.addEventListener('mousemove', this.handleTooltip.bind(this));
            this.canvas.addEventListener('mouseleave', this.hideTooltip.bind(this));
        }
    }

    /**
     * Set chart data
     */
    setData(data, labels) {
        this.data = data;
        this.labels = labels;
        this.maxValue = Math.max(...data) * 1.1;

        if (this.options.animation) {
            this.animate();
        } else {
            this.draw();
        }
    }

    /**
     * Animate chart drawing
     */
    animate() {
        const startTime = performance.now();
        const duration = this.options.animationDuration;

        const animateFrame = (currentTime) => {
            const elapsed = currentTime - startTime;
            this.animationProgress = Math.min(elapsed / duration, 1);
            this.draw();

            if (this.animationProgress < 1) {
                requestAnimationFrame(animateFrame);
            }
        };

        requestAnimationFrame(animateFrame);
    }

    /**
     * Draw chart based on type
     */
    draw() {
        this.ctx.clearRect(0, 0, this.options.width, this.options.height);

        switch (this.options.type) {
            case 'line':
                this.drawLineChart();
                break;
            case 'bar':
                this.drawBarChart();
                break;
            case 'pie':
                this.drawPieChart();
                break;
            case 'doughnut':
                this.drawDoughnutChart();
                break;
            case 'area':
                this.drawAreaChart();
                break;
        }
    }

    /**
     * Draw line chart
     */
    drawLineChart() {
        const { width, height, padding } = this.options;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Draw grid
        if (this.options.showGrid) {
            this.drawGrid(chartWidth, chartHeight, padding);
        }

        // Draw axes
        this.drawAxes(padding, height - padding, width - padding, padding);

        // Draw lines
        if (this.data.length > 0) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = ChartConfig.colors.primary;
            this.ctx.lineWidth = 3;

            const pointSpacing = chartWidth / (this.data.length - 1);

            this.data.forEach((value, index) => {
                const x = padding + index * pointSpacing;
                const y = height - padding - (value / this.maxValue * chartHeight) * this.animationProgress;

                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });

            this.ctx.stroke();

            // Draw points
            this.data.forEach((value, index) => {
                const x = padding + index * pointSpacing;
                const y = height - padding - (value / this.maxValue * chartHeight) * this.animationProgress;

                this.ctx.beginPath();
                this.ctx.fillStyle = 'white';
                this.ctx.arc(x, y, 5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = ChartConfig.colors.primary;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            });
        }
    }

    /**
     * Draw bar chart
     */
    drawBarChart() {
        const { width, height, padding } = this.options;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Draw grid
        if (this.options.showGrid) {
            this.drawGrid(chartWidth, chartHeight, padding);
        }

        // Draw axes
        this.drawAxes(padding, height - padding, width - padding, padding);

        // Draw bars
        if (this.data.length > 0) {
            const barWidth = (chartWidth / this.data.length) * 0.7;
            const spacing = (chartWidth / this.data.length) * 0.3;

            this.data.forEach((value, index) => {
                const barHeight = (value / this.maxValue * chartHeight) * this.animationProgress;
                const x = padding + index * (barWidth + spacing) + spacing / 2;
                const y = height - padding - barHeight;

                // Draw bar
                this.ctx.fillStyle = ChartConfig.colors.primary;
                this.ctx.fillRect(x, y, barWidth, barHeight);

                // Draw value on top of bar
                this.ctx.fillStyle = '#333';
                this.ctx.font = '12px Inter, sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(value, x + barWidth / 2, y - 5);

                // Draw label
                if (this.labels[index]) {
                    this.ctx.fillStyle = '#666';
                    this.ctx.font = '10px Inter, sans-serif';
                    this.ctx.fillText(this.labels[index], x + barWidth / 2, height - padding + 15);
                }
            });
        }
    }

    /**
     * Draw pie chart
     */
    drawPieChart() {
        const { width, height } = this.options;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2.5;

        const total = this.data.reduce((sum, value) => sum + value, 0);
        let startAngle = -Math.PI / 2;

        this.data.forEach((value, index) => {
            const sliceAngle = (value / total) * Math.PI * 2 * this.animationProgress;
            const endAngle = startAngle + sliceAngle;

            // Draw slice
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();

            // Color based on index
            const colors = Object.values(ChartConfig.colors);
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.fill();

            // Draw label
            const labelAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * radius * 1.2;
            const labelY = centerY + Math.sin(labelAngle) * radius * 1.2;

            if (this.labels[index]) {
                this.ctx.fillStyle = '#333';
                this.ctx.font = '12px Inter, sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(this.labels[index], labelX, labelY);

                // Draw percentage
                const percentage = ((value / total) * 100).toFixed(1);
                this.ctx.fillStyle = '#666';
                this.ctx.font = '10px Inter, sans-serif';
                this.ctx.fillText(percentage + '%', labelX, labelY + 15);
            }

            startAngle = endAngle;
        });
    }

    /**
     * Draw doughnut chart
     */
    drawDoughnutChart() {
        const { width, height } = this.options;
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.min(width, height) / 2.5;
        const innerRadius = outerRadius * 0.6;

        const total = this.data.reduce((sum, value) => sum + value, 0);
        let startAngle = -Math.PI / 2;

        this.data.forEach((value, index) => {
            const sliceAngle = (value / total) * Math.PI * 2 * this.animationProgress;
            const endAngle = startAngle + sliceAngle;

            // Draw donut slice
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
            this.ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            this.ctx.closePath();

            const colors = Object.values(ChartConfig.colors);
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.fill();

            startAngle = endAngle;
        });

        // Draw center hole
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
    }

    /**
     * Draw area chart
     */
    drawAreaChart() {
        const { width, height, padding } = this.options;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Draw grid
        if (this.options.showGrid) {
            this.drawGrid(chartWidth, chartHeight, padding);
        }

        // Draw axes
        this.drawAxes(padding, height - padding, width - padding, padding);

        // Draw area
        if (this.data.length > 0) {
            this.ctx.beginPath();

            const pointSpacing = chartWidth / (this.data.length - 1);

            // Draw line
            this.data.forEach((value, index) => {
                const x = padding + index * pointSpacing;
                const y = height - padding - (value / this.maxValue * chartHeight) * this.animationProgress;

                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });

            // Complete the path to create area
            const lastX = padding + (this.data.length - 1) * pointSpacing;
            this.ctx.lineTo(lastX, height - padding);
            this.ctx.lineTo(padding, height - padding);
            this.ctx.closePath();

            // Fill area
            const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, ChartConfig.colors.primary + '80');
            gradient.addColorStop(1, ChartConfig.colors.primary + '00');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Draw line on top
            this.ctx.beginPath();
            this.data.forEach((value, index) => {
                const x = padding + index * pointSpacing;
                const y = height - padding - (value / this.maxValue * chartHeight) * this.animationProgress;

                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            this.ctx.strokeStyle = ChartConfig.colors.primary;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
    }

    /**
     * Draw grid
     */
    drawGrid(chartWidth, chartHeight, padding) {
        const { width, height } = this.options;
        const gridLines = 5;

        this.ctx.strokeStyle = '#E2E8F0';
        this.ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= gridLines; i++) {
            const y = height - padding - (i / gridLines) * chartHeight;

            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width - padding, y);
            this.ctx.stroke();

            // Grid labels
            const value = ((i / gridLines) * this.maxValue).toFixed(0);
            this.ctx.fillStyle = '#999';
            this.ctx.font = '10px Inter, sans-serif';
            this.ctx.fillText(value, 5, y - 5);
        }
    }

    /**
     * Draw axes
     */
    drawAxes(x1, y1, x2, y2) {
        this.ctx.strokeStyle = '#CBD5E0';
        this.ctx.lineWidth = 2;

        // Y axis
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x1, y2);
        this.ctx.stroke();

        // X axis
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y1);
        this.ctx.stroke();
    }

    /**
     * Handle tooltip on hover
     */
    handleTooltip(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find nearest data point
        const nearest = this.findNearestPoint(x, y);

        if (nearest) {
            this.showTooltip(nearest, x, y);
        } else {
            this.hideTooltip();
        }
    }

    /**
     * Find nearest data point
     */
    findNearestPoint(mouseX, mouseY) {
        // Implementation depends on chart type
        return null;
    }

    /**
     * Show tooltip
     */
    showTooltip(point, x, y) {
        // Implementation for tooltip display
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        // Hide tooltip
    }
}

/**
 * Initialize all charts on the page
 */
document.addEventListener('DOMContentLoaded', () => {
    const chartElements = document.querySelectorAll('[data-chart]');

    chartElements.forEach(element => {
        const chartId = element.id;
        const chartType = element.getAttribute('data-chart');
        const chartData = JSON.parse(element.getAttribute('data-chart-data') || '[]');
        const chartLabels = JSON.parse(element.getAttribute('data-chart-labels') || '[]');

        const chart = new Chart(chartId, { type: chartType });
        chart.setData(chartData, chartLabels);
    });
});

// Export for use in other modules
window.Chart = Chart;
window.ChartConfig = ChartConfig;