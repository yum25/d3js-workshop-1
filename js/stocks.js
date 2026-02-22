// ============================================================================
// STOCK PRICE VISUALIZATION ASSIGNMENT
// ============================================================================
// Your task: Complete this script to create a multi-line chart showing
// stock prices for Apple (AAPL), Google (GOOG), and Amazon (AMZN)
//
// Follow the TODO comments and refer to demo.js Section 5 for guidance
// ============================================================================

// ============================================================================
// DATA LOADING
// ============================================================================
// Load CSV files for three stocks in parallel
// Pattern: d3.csv("filename").then(data => ({name: "SYMBOL", values: data}))

let stocks = await Promise.all([
  d3.csv("data/AAPL.csv").then((data) => ({ name: "AAPL", values: data })),
  // TODO: Load GOOG.csv with name "GOOG"
  d3.csv("data/GOOG.csv").then((data) => ({ name: "GOOG", values: data })),
  // TODO: Load AMZN.csv with name "AMZN"
  d3.csv("data/AMZN.csv").then((data) => ({ name: "AMZN", values: data })),

  d3.csv("data/MSFT.csv").then((data) => ({ name: "MSFT", values: data })),
  d3.csv("data/IBM.csv").then((data) => ({ name: "IBM", values: data })),
]);

console.log("Loaded stocks:", stocks);

// ============================================================================
// DATA PROCESSING
// ============================================================================
// Convert string values to proper types (dates and numbers)
// Remember: CSV data loads as strings!

stocks.forEach((stock) => {
  stock.values.forEach((d) => {
    // TODO: Convert d.Date from string to Date object
    // Hint: new Date(d.Date)
    d.Date = new Date(d.Date);
    // TODO: Convert d.Close from string to number
    // Hint: Use the + operator like +d.Close
    d.Close = +d.Close;
    // TODO: Convert these additional fields to numbers
    // d.Open, d.High, d.Low, d.Volume
    d.Open = +d.Open;
    d.High = +d.High;
    d.Low = +d.Low;
    d.Volume = +d.Volume;
  });

  // TODO: Sort stock.values by date (oldest to newest)
  stock.values.sort((a, b) => a.Date - b.Date);
});

console.log("Processed first stock:", stocks[0].values[0]);

// ============================================================================
// CHART DIMENSIONS
// ============================================================================
// Set up the size and margins for the chart
// This is provided - the margin convention is standard D3 practice

const margin = { top: 50, right: 160, bottom: 50, left: 100 };
const width = 1000 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// ============================================================================
// SVG SETUP
// ============================================================================
// Create the SVG container and add a group for margins
// This is provided - focus on the scales and drawing instead

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// ============================================================================
// CREATE SCALES
// ============================================================================
// Scales map data values to pixel positions

// Get all data points from all stocks (we need this for the domains)
const allValues = stocks.flatMap((s) => s.values);

// X Scale - Maps dates to horizontal positions
// TODO: Create a time scale using d3.scaleUtc()
// Hint: Look at demo.js Section 5 for the pattern
const x = d3
  .scaleUtc()
  .domain(
    /* TODO: Define domain for x axis */
    d3.extent(allValues, (d) => d.Date),
  )
  .range(
    /* TODO: Define width range in pixels */
    [0, width],
  );

// Y Scale - Maps prices to vertical positions
// TODO: Create a linear scale using d3.scaleLinear()
const y = d3
  .scaleLinear()
  .domain([
    // TODO: Get minimum Close price from all stocks
    d3.min(allValues, (value) => value.Close),
    // TODO: Get maximum Close price from all stocks
    d3.max(allValues, (value) => value.Close),
  ])
  .range(
    /* TODO: define height range in pixels */
    [height, 0],
  );

// Color Scale - Maps stock names to colors
// TODO: Create an ordinal color scale
// Hint: d3.scaleOrdinal(d3.schemeCategory10).domain(mapping goes here)
const color = d3
  .scaleOrdinal(d3.schemeCategory10)
  .domain(stocks.map((s) => s.name)); /* TODO: Your code here */

// ============================================================================
// ADD AXES
// ============================================================================
// Create and position the x and y axes

// X Axis - Shows years along the bottom
const xAxis = // TODO: Define X axis, format ticks to show only years
  d3
    .axisBottom(x)
    .ticks(d3.timeYear.every(1)) // Set ticks to be every year
    .tickFormat(d3.timeFormat("%Y")); // Format ticks to show only the year (e.g., 2020)

svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis)
  .selectAll("text")
  .style("font-size", "12px");

// Y Axis - Shows prices along the left side
const yAxis = // TODO: Define Y axis, format ticks to show $ sign
  d3
    .axisLeft(y)
    .ticks(10)
    .tickFormat((d) => `$${d.toFixed(2)}`); // Format ticks to show dollar amounts with 2 decimal places

svg
  .append("g")
  .attr("class", "y-axis")
  .call(yAxis)
  .selectAll("text")
  .style("font-size", "12px");

// ============================================================================
// DRAW LINES
// ============================================================================
// Create a line for each stock

// TODO: Create a line generator using d3.line()
const line = d3
  .line()
  .x(/* TODO: map Date to x-axis */ (d) => x(d.Date))
  .y(/* TODO: map 'Close' price to y-axis */ (d) => y(d.Close))
  .curve(d3.curveMonotoneX);

// TODO: Loop through each stock and draw a line
stocks.forEach((stock) => {
  // TODO: Append a 'path' element
  // TODO: Bind the stock.values data using .datum(stock.values)
  // TODO: Set attributes:
  //   - fill: 'none' (we don't want to fill under the line)
  //   - stroke: use the color scale to get the color for this stock
  //   - stroke-width: 2
  //   - d: line (this uses the line generator to create the path)
  svg
    .append("path")
    .datum(stock.values) // Bind the values for this region to the path element
    .attr("fill", "none") // We don't want to fill under the line, so set fill to 'none'
    .attr("stroke", color(stock.name)) // Set the stroke color based on the region name using the color scale
    .attr("stroke-width", 2) // Set the stroke width to 2 pixels
    .attr("d", line); // Use the line generator to create the 'd' attribute for the path, which defines the shape of the line based on the data
});

// ============================================================================
// ADD LABELS
// ============================================================================
// Add title and axis labels to make the chart readable

// Chart Title
// TODO: Add a text element for the title
svg
  .append("text")
  .attr("class", "chart-title")
  .attr("x" /* TODO: center the title */, width / 2)
  .attr("y" /* TODO: put the title above the chart */, 0)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("font-weight", "bold")
  .text(/* TODO: add your title */ "Stock Closing Prices (2010-2020)");

// X Axis Label
// TODO: Add a label below the x-axis
svg
  .append("text")
  .attr("class", "x-axis-label")
  .attr("x" /* TODO: center the label */, width / 2)
  .attr("y" /* TODO: put the label below x-xis */, height + margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .text(/* TODO: add axis label */ "Date");

// Y Axis Label
// TODO: Add a label to the left of the y-axis (rotated)
svg
  .append("text")
  .attr("class", "y-axis-label")
  .attr("transform" /* TODO: 'rotate(-90)' */, "rotate(-90)")
  .attr("x" /* TODO: center the label */, -width / 2)
  .attr("y" /* TODO: put the label to the left of y-axis */, -margin.right / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .text(/* TODO: add axis label */ "Closing Price (USD)");

// ============================================================================
// ADD LEGEND
// ============================================================================
// Create a legend showing which color represents which stock

const legend = svg
  .append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width + 20}, 0)`);

// TODO: For each stock, create a legend entry
stocks.forEach((stock, i) => {
  const legendRow = legend
    .append("g")
    .attr("transform", `translate(0, ${i * 20})`);

  // TODO: Add a colored line showing the stock's color
  legendRow
    .append("line")
    .attr("x1", 0 /* TODO: define x-coordinate of the line starting point */)
    .attr("y1", 5 /* TODO: define y-coordinate of the line starting point */)
    .attr("x2", 15 /* TODO: define x-coordinate of the line ending point */)
    .attr("y2", 5 /* TODO: define y-coordinate of the line ending point */)
    .attr(
      "stroke",
      color(stock.name) /* TODO: use color variable that we defined above) */,
    )
    .attr("stroke-width", 2);

  // TODO: Add text label with the stock name
  legendRow
    .append("text")
    .attr(
      "x",
      25 /* TODO: define x-coordinate of the text label starting point */,
    )
    .attr(
      "y",
      10 /* TODO: define y-coordinate of the text label starting point */,
    )
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .text(/* TODO: add stock name */ stock.name);
});

// ============================================================================
// BONUS
// ============================================================================

/**
 * Edit the code above to also add IBM and MSFT stock price visualization
 */
