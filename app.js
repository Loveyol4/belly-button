/// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // get the metadata field
    let metadata = data.metadata;
    //console.log(metadata);
    // Select panel element by ID
    let panel = d3.select("#sample-metadata");
    panel.html("");  // Clear any existing metadata
    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(meta => meta.id == sample)[0];
    // Append metadata to the panel
    if (result) {
      Object.entries(result).forEach(([id, value]) => {
        panel.append("h6").text(`${id}: ${value}`);
      });
    } else {
      panel.append("h6").text("No metadata found for this sample.");
    }
  });
}
// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let object = data.samples.filter(sampleObj => sampleObj.id == sample)[0];
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = object.otu_ids;
    let otu_labels = object.otu_labels;
    let sample_values = object.sample_values;
    // Build a Bar Chart
    let trace = {
      x: sample_values.slice(0,10),
      y: otu_ids.slice(0,10).map(id => `OTU ${id}`),
      type: 'bar',
      text: otu_labels.slice(0,10),
      orientation: 'h'
    };
    // Layout for Bar Chart
    let barLayout = {
      title: "Top 10 OTUs",
      margin: { t: 30, l: 150 }
    };
    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: 'purple'  // Color specified as a string
      },
      text: otu_labels
    };
    // Layout for Bubble Chart
    let bubbleLayout = {
      title: "OTU ID Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };
    // Render the charts
    Plotly.newPlot('bar', [trace], barLayout);
    Plotly.newPlot('bubble', [trace1], bubbleLayout);
  });
}
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let sampleNames = data.names;
    let dropdown = d3.select("#selDataset");
    // Populate the dropdown options
    sampleNames.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });
    // Use the first sample to build initial plots
    const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}
// Function for event listener
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
// Initialize the dashboard
init();