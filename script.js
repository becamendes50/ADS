//"use strict";

var settings = document.getElementById("settings");
var openSettings = document.getElementById("openSettings");
var confirmSettings= document.getElementById("confirmSettings");

var fileEnding = "_run[0-9]+.csv$";
var separator = ";";

var upload = document.getElementById('uploadFiles');
var submit = document.getElementById('submitFiles');
var uploadForm = document.getElementById('uploadFilesForm');

var triggerUpload = document.getElementById('triggerUpload');
var triggerSubmit = document.getElementById('triggerSubmit');

var clear = document.getElementById('clearFiles');
var filesList = document.getElementById('filesList');

var plot = document.getElementById('plotGraphic');

var graphicVariablesInfo = document.getElementById('graphicVariablesInfo');
var graphicAlgorithmsInfo = document.getElementById('graphicAlgorithmsInfo');
var previousGraphic = document.getElementById('previousGraphic');
var nextGraphic = document.getElementById('nextGraphic');
var graphicSoloRepresentation = document.getElementById('graphicSoloRepresentation');
var graphicFirstDoubleRepresentation = document.getElementById('graphicFirstDoubleRepresentation');
var graphicSecondDoubleRepresentation = document.getElementById('graphicSecondDoubleRepresentation');

var averageStats = document.getElementById('averageStats');
var medianStats = document.getElementById('medianStats');
var standardDeviationStats = document.getElementById('standardDeviationStats');
var hypervolumeStats = document.getElementById('hypervolumeStats');
var statsInfo = document.getElementById('statsInfo');
var statsPreviousGraphicVariable = document.getElementById('statsPreviousGraphicVariable');
var statsCurrentGraphicVariable = document.getElementById('statsCurrentGraphicVariable');
var statsNextGraphicVariable = document.getElementById('statsNextGraphicVariable');
var statsPreviousGraphicAlgorithm = document.getElementById('statsPreviousGraphicAlgorithm');
var statsCurrentGraphicAlgorithm = document.getElementById('statsCurrentGraphicAlgorithm');
var statsNextGraphicAlgorithm = document.getElementById('statsNextGraphicAlgorithm');

var newAlgorithm = "";
var newAlgorithmFiles = [];
var filesToUpload = 0;

var currentAlgorithms = [];
var currentAlgorithmsFiles = [];
var currentAlgorithmsVariables = [];
var currentAlgorithmsPoints = [];
var currentAlgorithmsColors = [];

var chosenAlgorithms = [];
var chosenAlgorithmsVariables = [];
var chosenAlgorithmsFiles = [];
var chosenAlgorithmsPoints = [];
var chosenAlgorithmsColors = [];

var graphicsVariables = [];
var graphicsPoints = [];
var graphicsAlgorithms = [];
var graphicsColors = [];

var allGraphics = [];
var currentGraphic = 0;
var allGraphicRepresentations = [];
var currentGraphicRepresentation = 0;

var statsAlgorithms = [];
var statsVariables = [];
var statsAlgorithmsPoints = [];
var statsAllPoints = [];

var graphicAverages = [];
var graphicMedians = [];
var graphicStandardDeviations = [];

var statsAllGraphics = [];
var statsAllAlgorithms = [];
var currentStatsGraphicVariable = 0;
var currentStatsGraphicAlgorithm = 0;



function openSettingsMenu() {

  settings.style.visibility = "visible";

}


function closeSettingsMenu() {

    settings.style.visibility = "hidden";

    let chosenFileEnding = document.getElementById("fileEnding").value;
    let chosenSeparator = document.getElementById("separator").value;

    if (chosenSeparator == "tab") {

        separator = "\t";

    } else {

      separator = chosenSeparator;

    }

    if (chosenFileEnding.includes("*") == true){

      let modifiedFileEnding = chosenFileEnding.replace("*", "[0-9]+");
      fileEnding = modifiedFileEnding + "$";

    } else {

      fileEnding = chosenFileEnding + "$";

    }

}


openSettings.addEventListener('click', openSettingsMenu, false);
confirmSettings.addEventListener("click", closeSettingsMenu, false);


function getSelectedFiles() {

  newAlgorithmFiles = upload.files;
  filesToUpload = newAlgorithmFiles.length;

  let firstFile = upload.files[0];
  let path = firstFile.webkitRelativePath;
  let folder = path.split("/");

  newAlgorithm = folder[0];

}


function fileUploaded() {

  filesToUpload--;

  if (filesToUpload == 0) {
    showUploadedAlgorithm();
  }

}


function uploadAlgorithm(event) {

  let uploadedFiles = [];
  let uploadedPoints = [];

  if (newAlgorithmFiles.length > 0 && !currentAlgorithms.includes(newAlgorithm)) {

    let variablesChecked = false;

    for (let f = 0; f < newAlgorithmFiles.length; f++) {

      let file = newAlgorithmFiles[f];
      let fileName = file.name;

      if (fileName.match(fileEnding)) {

        uploadedFiles.push(fileName);

        let reader = new FileReader();

        reader.onload = (e) => {

          const fileContent = e.target.result;
          const fileLines = fileContent.split(/\r\n|\n/);

          if (!variablesChecked) {

            uploadVariables(fileLines);
            variablesChecked = true;

          }

          let filePoints = uploadPoints(fileLines);
          uploadedPoints.push(filePoints);

        };

        reader.onerror = (e) => alert(e.target.error.name);
        reader.readAsText(file);

      } else {

        fileUploaded();

      }

    }

    currentAlgorithms.push(newAlgorithm);
    newAlgorithm = "";

    currentAlgorithmsFiles.push(uploadedFiles);
    newAlgorithmFiles = [];

    currentAlgorithmsPoints.push(uploadedPoints);

    currentAlgorithmsColors.push("#000000");

  }

  event.preventDefault();

}


function uploadVariables(fileLines) {

  let uploadedVariables = [];

  let firstLine = fileLines[0];
  let variables = firstLine.split(separator);

  for (let v = 0; v < variables.length; v++) {

    let variable = variables[v];
    uploadedVariables.push(variable);

  }

  currentAlgorithmsVariables.push(uploadedVariables);

}


function uploadPoints(fileLines) {

  let filePoints = [];

  for (let l = 0; l < fileLines.length; l++) {

    let fileLine = fileLines[l];

    if (l == 0) {

      let variables = fileLine.split(separator);

      if (filePoints.length == 0) {

        for (let v = 0; v < variables.length; v++) {

          let variablePoints = [];
          filePoints.push(variablePoints);

        }

      }

    } else {

      let points = fileLine.split(separator);

      for (let p = 0; p < points.length; p++) {

        let point = points[p];

        if (point != "" && typeof point != 'undefined') {

          filePoints[p].push(point);

        }

      }

    }

  }

  fileUploaded();

  return filePoints;

}


function showUploadedAlgorithm() {

  let numberOfCurrentAlgorithms = currentAlgorithms.length;
  let uploadedAlgorithm = currentAlgorithms[numberOfCurrentAlgorithms - 1];
  let uploadedAlgorithmVariables = currentAlgorithmsVariables[numberOfCurrentAlgorithms - 1];
  let uploadedAlgorithmFiles = currentAlgorithmsFiles[numberOfCurrentAlgorithms - 1];
  let uploadedAlgorithmPoints = currentAlgorithmsPoints[numberOfCurrentAlgorithms - 1];

  let algorithmFullDiv = document.createElement("div");
  let algorithmDiv = document.createElement("div");
  let variablesFullDiv = document.createElement("div");
  let variablesDiv = document.createElement("div");
  let filesFullDiv = document.createElement("div");
  let filesDiv = document.createElement("div");
  let colorFullDiv = document.createElement("div");
  let colorDiv = document.createElement("div");

  algorithmFullDiv.id = uploadedAlgorithm + "algorithmDiv";
  variablesFullDiv.id = uploadedAlgorithm + "variablesDiv";
  filesFullDiv.id = uploadedAlgorithm + "filesDiv";
  colorFullDiv.id = uploadedAlgorithm + "colorDiv";

  for (let v = 0; v < uploadedAlgorithmVariables.length; v++) {

    let variable = uploadedAlgorithmVariables[v];

    let variableCheckBox = document.createElement("input");
    variableCheckBox.type = "checkbox";
    variableCheckBox.id = uploadedAlgorithm + "_variables_checkbox_" + v;
    variableCheckBox.name = variable;
    variableCheckBox.value = variable;

    let variableLabel = document.createElement("label");
    variableLabel.id = uploadedAlgorithm + "_variables_label_" + v;
    variableLabel.appendChild(document.createTextNode(variable));

    variablesDiv.appendChild(variableCheckBox);
    variablesDiv.appendChild(variableLabel);
    variablesDiv.appendChild(document.createElement('br'));

  }

  for (let f = 0; f < uploadedAlgorithmFiles.length; f++) {

    let file = uploadedAlgorithmFiles[f];

    let fileCheckBox = document.createElement("input");
    fileCheckBox.type = "checkbox";
    fileCheckBox.id = uploadedAlgorithm + "_files_checkbox_" + f;
    fileCheckBox.name = file;
    fileCheckBox.value = file;

    let fileLabel = document.createElement("label");
    fileLabel.id = uploadedAlgorithm + "_files_label_" + f;
    fileLabel.appendChild(document.createTextNode(file));

    filesDiv.appendChild(fileCheckBox);
    filesDiv.appendChild(fileLabel);
    filesDiv.appendChild(document.createElement('br'));

  }

  let colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.id = uploadedAlgorithm + "_color_picker";
  colorPicker.value = "#000000";
  colorPicker.addEventListener('change', changeAlgorithmColor);
  colorDiv.appendChild(colorPicker);

  let algorithmButton = document.createElement("button");
  algorithmButton.className = "mainCollapsible";
  algorithmButton.textContent = uploadedAlgorithm;

  let variablesButton = document.createElement("button");
  variablesButton.className = "subCollapsible";
  variablesButton.textContent = "Variáveis";

  let filesButton = document.createElement("button");
  filesButton.className = "subCollapsible";
  filesButton.textContent = "Ficheiros";

  let colorButton = document.createElement("button");
  colorButton.className = "subCollapsible";
  colorButton.textContent = "Cor";

  variablesFullDiv.appendChild(variablesButton);
  variablesFullDiv.appendChild(variablesDiv);
  variablesDiv.className = "collapsibleContent";
  variablesButton.addEventListener('click', collapse);

  filesFullDiv.appendChild(filesButton);
  filesFullDiv.appendChild(filesDiv);
  filesDiv.className = "collapsibleContent";
  filesButton.addEventListener('click', collapse);

  colorFullDiv.appendChild(colorButton);
  colorFullDiv.appendChild(colorDiv);
  colorDiv.className = "collapsibleContent";
  colorButton.addEventListener('click', collapse);

  algorithmDiv.appendChild(variablesFullDiv);
  algorithmDiv.appendChild(filesFullDiv);
  algorithmDiv.appendChild(colorFullDiv);
  algorithmFullDiv.appendChild(algorithmButton);
  algorithmFullDiv.appendChild(algorithmDiv);
  algorithmDiv.className = "collapsibleContent";
  algorithmButton.addEventListener('click', collapse);

  filesList.appendChild(algorithmFullDiv);

}


function clearAlgorithmsList() {

  currentAlgorithms = [];
  currentAlgorithmsFiles = [];
  currentAlgorithmsVariables = [];
  currentAlgorithmsPoints = [];
  filesList.innerHTML = "";

}


function collapse() {

  this.classList.toggle("active");
  let collapsibleContent = this.nextElementSibling;

  if (collapsibleContent.style.maxHeight) {

    collapsibleContent.style.maxHeight = null;

  } else {

    collapsibleContent.style.maxHeight = collapsibleContent.scrollHeight * 100 + "px";

  }

}


function triggerUploadButton() {
  upload.click();
}


function triggerSubmitButton() {
  submit.click();
}


function changeAlgorithmColor(event) {

  let colorID = event.target.id;
  let colorValue = event.target.value;

  let algorithmIndex = 0;

  for (let a = 0; a < currentAlgorithms.length; a++) {

    let algorithm = currentAlgorithms[a];

    if (colorID.startsWith(algorithm)) {

      algorithmIndex = a;

    }

  }

  currentAlgorithmsColors[algorithmIndex] = colorValue;

}


triggerUpload.addEventListener('click', triggerUploadButton, false);
upload.addEventListener('change', getSelectedFiles, false);

triggerSubmit.addEventListener('click', triggerSubmitButton, false);
uploadForm.addEventListener('submit', uploadAlgorithm, false);

clear.addEventListener('click', clearAlgorithmsList, false);


function setChosenAlgorithms() {

  chosenAlgorithms = [];
  chosenAlgorithmsColors = [];

  let allOptions = document.querySelectorAll("input[type=checkbox]");

  let variablesMinimum = 1;
  let filesMinimum = 1;

  for (let a = 0; a < currentAlgorithms.length; a++) {

    let algorithm = currentAlgorithms[a];
    let color = currentAlgorithmsColors[a];

    let chosenVariables = 0;
    let chosenFiles = 0;

    for (let o = 0; o < allOptions.length; o++) {

      let option = allOptions[o];

      if (option.checked == true && option.id.startsWith(algorithm)) {

        if (option.id.includes("_variables_checkbox_")) {

          chosenVariables++;

        }

        if (option.id.includes("_files_checkbox_")) {

          chosenFiles++;

        }

      }

    }

    if (chosenVariables >= variablesMinimum && chosenFiles >= filesMinimum) {

      chosenAlgorithms.push(algorithm);
      chosenAlgorithmsColors.push(color);

    }

  }

}


function setChosenAlgorithmsVariablesAndFiles() {

  chosenAlgorithmsVariables = [];
  chosenAlgorithmsFiles = [];

  let allOptions = document.querySelectorAll("input[type=checkbox]");

  for (let a = 0; a < chosenAlgorithms.length; a++) {

    let algorithm = chosenAlgorithms[a];

    let algorithmVariables = [];
    let algorithmFiles = [];

    for (let o = 0; o < allOptions.length; o++) {

      let option = allOptions[o];

      if (option.checked == true && option.id.startsWith(algorithm)) {

        if (option.id.includes("_variables_checkbox_")) {

          algorithmVariables.push(option.name);

        }

        if (option.id.includes("_files_checkbox_")) {

          algorithmFiles.push(option.name);

        }

      }

    }

    chosenAlgorithmsVariables.push(algorithmVariables);
    chosenAlgorithmsFiles.push(algorithmFiles);

  }

}


function setChosenAlgorithmsPoints() {

  chosenAlgorithmsPoints = [];

  for (let a = 0; a < chosenAlgorithms.length; a++) {

    let allAlgorithms = currentAlgorithms;
    let algorithm = chosenAlgorithms[a];
    let algorithmIndex = 0;

    for (let iA = 0; iA < allAlgorithms.length; iA++) {

      if (allAlgorithms[iA] == algorithm) {

        algorithmIndex = iA;

      }

    }

    let allAlgorithmVariables = currentAlgorithmsVariables[algorithmIndex];
    let algorithmVariables = chosenAlgorithmsVariables[a];
    let algorithmVariablesIndexes = [];

    for (let v = 0; v < algorithmVariables.length; v++) {

      for (let iV = 0; iV < allAlgorithmVariables.length; iV++) {

        if (allAlgorithmVariables[iV] == algorithmVariables[v]) {

          algorithmVariablesIndexes.push(iV);

        }

      }

    }

    let allAlgorithmFiles = currentAlgorithmsFiles[algorithmIndex];
    let algorithmFiles = chosenAlgorithmsFiles[a];
    let algorithmFilesIndexes = [];

    for (let f = 0; f < algorithmFiles.length; f++) {

      for (let iF = 0; iF < allAlgorithmFiles.length; iF++) {

        if (allAlgorithmFiles[iF] == algorithmFiles[f]) {

          algorithmFilesIndexes.push(iF);

        }

      }

    }

    let allAlgorithmPoints = currentAlgorithmsPoints[algorithmIndex];
    let algorithmPoints = [];

    for (let iAF = 0; iAF < algorithmFilesIndexes.length; iAF++) {

      let points = [];

      let fileIndex = algorithmFilesIndexes[iAF];
      let filePoints = allAlgorithmPoints[fileIndex];

      for (let iAV = 0; iAV < algorithmVariablesIndexes.length; iAV++) {

        let variableIndex = algorithmVariablesIndexes[iAV];
        let variablePoints = filePoints[variableIndex];

        points.push(variablePoints);

      }

      algorithmPoints.push(points);

    }

    chosenAlgorithmsPoints.push(algorithmPoints);

  }

}


function setGraphics() {

  setChosenAlgorithms();
  setChosenAlgorithmsVariablesAndFiles();
  setChosenAlgorithmsPoints();

  graphicsVariables = [];
  graphicsPoints = [];
  graphicsAlgorithms = [];
  graphicsColors = [];

  let variablesToGraphics = chosenAlgorithmsVariables.slice(0);
  let pointsToGraphics = chosenAlgorithmsPoints.slice(0);
  let algorithmsToGraphics = chosenAlgorithms.slice(0);
  let colorsToGraphics = chosenAlgorithmsColors.slice(0);

  while (variablesToGraphics.length > 0) {

    let graphicVariables = variablesToGraphics[0];
    let indexes = [];

    for (let v = 0; v < variablesToGraphics.length; v++) {

      if (variablesToGraphics[v].length == graphicVariables.length && variablesToGraphics[v].every((val, index) => val == graphicVariables[index])) {

        indexes.push(v);

      }

    }

    let graphicPoints = [];
    let graphicAlgorithms = [];
    let graphicColors = [];

    for (let i = 0; i < indexes.length; i++) {

      graphicPoints.push(pointsToGraphics[indexes[i]]);
      graphicAlgorithms.push(algorithmsToGraphics[indexes[i]]);
      graphicColors.push(colorsToGraphics[indexes[i]]);

    }

    while (indexes.length > 0) {

      let algorithmIndex = indexes.pop();
      variablesToGraphics.splice(algorithmIndex, 1);
      pointsToGraphics.splice(algorithmIndex, 1);
      algorithmsToGraphics.splice(algorithmIndex, 1);
      colorsToGraphics.splice(algorithmIndex, 1);

    }

    graphicsVariables.push(graphicVariables);
    graphicsPoints.push(graphicPoints);
    graphicsAlgorithms.push(graphicAlgorithms);
    graphicsColors.push(graphicColors);

  }

}


function drawGraphic(graphicVariables, graphicPoints, graphicAlgorithms, graphicColors) {

  let numberOfVariables = graphicVariables.length;

  let allPointsToGraphic = [];

  for (let a = 0; a < graphicAlgorithms.length; a++) {

    let algorithmPointsToGraphic = [];

    for (let n = 0; n < numberOfVariables; n++) {

      let variablePointsToGraphic = [];
      algorithmPointsToGraphic.push(variablePointsToGraphic);

    }

    let algorithm = graphicAlgorithms[a];
    let algorithmPoints = graphicPoints[a];

    for (let f = 0; f < algorithmPoints.length; f++) {

      let filePoints = algorithmPoints[f];

      for (let v = 0; v < filePoints.length; v++) {

        let variablePoints = filePoints[v];

        for (let p = 0; p < variablePoints.length; p++) {

          let point = variablePoints[p];

          algorithmPointsToGraphic[v].push(point);

        }

      }

    }

    allPointsToGraphic.push(algorithmPointsToGraphic);

  }

  let allDatas = [];
  let allLayouts = [];

  if (numberOfVariables == 1) {

    let data = [];
    let layout = {
      xaxis:{title: graphicVariables[0]},
      barmode: "overlay",
    };

    for (let i = 0; i < graphicAlgorithms.length; i++) {

      let pointsToGraphic = allPointsToGraphic[i];

      let trace = {

        x: pointsToGraphic[0],

        type: 'histogram',
        opacity: 0.5,
        marker: {
          color: graphicColors[i],
        },
        name: graphicAlgorithms[i],

      };

      data.push(trace);

    }

    allDatas.push(data);
    allLayouts.push(layout);

    data = [];
    layout = {
      xaxis:{title: graphicVariables[0]},
    };

    for (let i = 0; i < graphicAlgorithms.length; i++) {

      let pointsToGraphic = allPointsToGraphic[i];

      let trace = {

        x: pointsToGraphic[0],

        type: 'box',
        opacity: 0.5,
        marker: {
          color: graphicColors[i],
        },
        name: graphicAlgorithms[i],

      };

      data.push(trace);

    }

    allDatas.push(data);
    allLayouts.push(layout);

  } else if (numberOfVariables == 2) {

    let data = [];
    let layout = {
      xaxis:{title: graphicVariables[0]},
      yaxis:{title: graphicVariables[1]}
    };

    for (let i = 0; i < graphicAlgorithms.length; i++) {

      let pointsToGraphic = allPointsToGraphic[i];

      let trace = {

        x: pointsToGraphic[0],
        y: pointsToGraphic[1],

        mode: 'markers',
        type: 'scatter',
        opacity: 0.5,
        marker: {
          color: graphicColors[i],
        },
        name: graphicAlgorithms[i],

      };

      data.push(trace);

    }

    allDatas.push(data);
    allLayouts.push(layout);

  } else if (numberOfVariables == 3) {

    let data = [];
    let layout = {
      scene: {
        xaxis:{title: graphicVariables[0]},
        yaxis:{title: graphicVariables[1]},
        zaxis:{title: graphicVariables[2]},
      },
    };

    for (let i = 0; i < graphicAlgorithms.length; i++) {

      let pointsToGraphic = allPointsToGraphic[i];

      let trace = {

        x: pointsToGraphic[0],
        y: pointsToGraphic[1],
        z: pointsToGraphic[2],

        mode: 'markers',
        type: 'scatter3d',
        opacity: 0.5,
        marker: {
          color: graphicColors[i],
        },
        name: graphicAlgorithms[i],

      };

      data.push(trace);

    }

    allDatas.push(data);
    allLayouts.push(layout);

  } else if (numberOfVariables >= 4) {

    let data = [];
    let layout = {};

    let allDimensions = [];
    let allDimensionsPoints = [];

    let allDimensionsMin = 0;
    let allDimensionsMax = 0;

    let allDimensionsPointsAlgorithms = [];

    for (let d = 0; d < graphicVariables.length; d++) {

      let variableDimensionPoints = [];

      for (let i = 0; i < graphicAlgorithms.length; i++) {

        let pointsToGraphic = (allPointsToGraphic[i])[d];

        for (let point = 0; point < pointsToGraphic.length; point++) {

          variableDimensionPoints.push(pointsToGraphic[point]);

          if (d == 0) {

            allDimensionsPointsAlgorithms.push(i);

          }

        }

      }

      let min = Math.min(...variableDimensionPoints);
      let max = Math.max(...variableDimensionPoints);

      if (d == 0) {

        allDimensionsMin = min;
        allDimensionsMax = max;

      } else {

        if (min < allDimensionsMin) {

          allDimensionsMin = min;

        }

        if (max > allDimensionsMax) {

          allDimensionsMax = max;

        }

      }

      allDimensionsPoints.push(variableDimensionPoints);

    }

    for (let d = 0; d < allDimensionsPoints.length; d++) {

      let variableDimensionPoints = allDimensionsPoints[d];

      let variableDimension = {

        range: [allDimensionsMin, allDimensionsMax],
        label: graphicVariables[d],
        values: variableDimensionPoints,

      }

      allDimensions.push(variableDimension);

    }

    let allColors = [];

    if (graphicColors.length == 1) {

      let color = graphicColors[0];

      let colorscaleZero = [0, color];
      let colorscaleOne = [1, color];

      allColors.push(colorscaleZero);
      allColors.push(colorscaleOne);

    } else if (graphicColors.length >= 2) {

      for (let g = 0; g < graphicColors.length; g++) {

        let color = graphicColors[g];

        let colorscaleX = [g, color];
        allColors.push(colorscaleX);

      }

    }

    let trace = {

      type: 'parcoords',

      line: {

        color: allDimensionsPointsAlgorithms,
        colorscale: allColors,

      },

      dimensions: allDimensions,

    };

    data.push(trace);

    allDatas.push(data);
    allLayouts.push(layout);

    data = [];
    layout = {};

    for (let i = 0; i < graphicAlgorithms.length; i++) {

      let pointsToGraphic = allPointsToGraphic[i]; //x, y, z
      let allAlgorithmPoints = pointsToGraphic[0];

      for (let p = 0; p < allAlgorithmPoints.length; p++) {

        let point = [];
        let variables = [];

        for (let v = 0; v < pointsToGraphic.length; v++) {

          let variablePoints = pointsToGraphic[v];
          point.push(variablePoints[p]);
          variables.push(graphicVariables[v]);

        }

        point.push(allAlgorithmPoints[p])
        variables.push(graphicVariables[0]);

        let trace = {};

        if (p == 0) {

          trace = {

            r: point,
            theta: variables,

            type: 'scatterpolar',
            fill: 'toself',
            opacity: 0.5,
            line: {
              color: graphicColors[i],
            },
            name: graphicAlgorithms[i],
            legendgroup: graphicAlgorithms[i],
            showlegend: true,

          };

        } else {

          trace = {

            r: point,
            theta: variables,

            type: 'scatterpolar',
            fill: 'toself',
            opacity: 0.5,
            line: {
              color: graphicColors[i],
            },
            name: graphicAlgorithms[i],
            legendgroup: graphicAlgorithms[i],
            showlegend: false,

          };

        }

        data.push(trace);

      }

    }

    allDatas.push(data);
    allLayouts.push(layout);

  }

  let graphic = [graphicVariables, graphicAlgorithms, allDatas, allLayouts, graphicPoints];
  allGraphics.push(graphic);

}


function showCurrentGraphic() {

  let graphicToShow = allGraphics[currentGraphic];

  let variables = graphicToShow[0];
  let algorithms = graphicToShow[1];

  graphicVariablesInfo.innerHTML = "";

  for (let v = 0; v < variables.length; v++) {

    let variable = variables[v].toUpperCase();

    if (v == variables.length - 1) {

      graphicVariablesInfo.innerHTML += variable;

    } else {

      graphicVariablesInfo.innerHTML += variable + " x ";

    }

  }

  graphicAlgorithmsInfo.innerHTML = "";

  for (let a = 0; a < algorithms.length; a++) {

    let algorithm = algorithms[a].toUpperCase();

    if (a == algorithms.length - 1) {

      graphicAlgorithmsInfo.innerHTML += algorithm;

    } else {

      graphicAlgorithmsInfo.innerHTML += algorithm + " + ";

    }

  }

  let allDatas = graphicToShow[2];
  let allLayouts = graphicToShow[3];

  allGraphicRepresentations = [];
  currentGraphicRepresentation = 0;

  if (variables.length == 1 || variables.length >= 4) {

    graphicSoloRepresentation.style.display = "none";
    graphicFirstDoubleRepresentation.style.display = "block";
    graphicSecondDoubleRepresentation.style.display = "block";

    if (variables.length == 1) {

      graphicFirstDoubleRepresentation.innerHTML = "Histograma";
      graphicSecondDoubleRepresentation.innerHTML = "Diagrama de Caixas";

    } else {

      graphicFirstDoubleRepresentation.innerHTML = "Gráfico de Coordenadas Paralelas";
      graphicSecondDoubleRepresentation.innerHTML = "Gráfico de Radar";

    }

  } else if (variables.length == 2 || variables.length == 3) {

    graphicSoloRepresentation.style.display = "block";
    graphicFirstDoubleRepresentation.style.display = "none";
    graphicSecondDoubleRepresentation.style.display = "none";

    if (variables.length == 2) {

      graphicSoloRepresentation.innerHTML = "Gráfico de Dispersão (2D)";

    } else {

      graphicSoloRepresentation.innerHTML = "Gráfico de Dispersão (3D)";

    }

  }

  for (let r = 0; r < allDatas.length; r++) {

    let data = allDatas[r];
    let layout = allLayouts[r];

    let representation = [data, layout];
    allGraphicRepresentations.push(representation);

    if (r == 0) {

      Plotly.newPlot('currentGraphic', data, layout);

    }

  }

  let points = graphicToShow[4];

  statsInfo.innerHTML = "";
  setStats(algorithms, variables, points);

}


function plotGraphics() {

  allGraphics = [];
  currentGraphic = 0;

  setGraphics();

  let numberOfGraphics = graphicsVariables.length;

  for (let g = 0; g < numberOfGraphics; g++) {

    let graphicVariables = graphicsVariables[g];
    let graphicPoints = graphicsPoints[g];
    let graphicAlgorithms = graphicsAlgorithms[g];
    let graphicColors = graphicsColors[g];

    drawGraphic(graphicVariables, graphicPoints, graphicAlgorithms, graphicColors);

  }

  showCurrentGraphic();

}


function showPreviousGraphic() {

  if (currentGraphic == 0) {

    currentGraphic = allGraphics.length - 1;

  } else {

    currentGraphic--;

  }

  showCurrentGraphic();

}


function showNextGraphic() {

  if (currentGraphic == allGraphics.length - 1) {

    currentGraphic = 0;

  } else {

    currentGraphic++;

  }

  showCurrentGraphic();

}


function showSoloRepresentation() {

  currentGraphicRepresentation = 0;

  let representation = allGraphicRepresentations[currentGraphicRepresentation];

  let data = representation[0];
  let layout = representation[1];

  Plotly.newPlot('currentGraphic', data, layout);

}


function showFirstDoubleRepresentation() {

  currentGraphicRepresentation = 0;

  let representation = allGraphicRepresentations[currentGraphicRepresentation];

  let data = representation[0];
  let layout = representation[1];

  Plotly.newPlot('currentGraphic', data, layout);

}


function showSecondDoubleRepresentation() {

  currentGraphicRepresentation = 1;

  let representation = allGraphicRepresentations[currentGraphicRepresentation];

  let data = representation[0];
  let layout = representation[1];

  Plotly.newPlot('currentGraphic', data, layout);

}


plot.addEventListener('click', plotGraphics, false);

previousGraphic.addEventListener('click', showPreviousGraphic, false);
nextGraphic.addEventListener('click', showNextGraphic, false);

graphicSoloRepresentation.addEventListener('click', showSoloRepresentation, false);
graphicFirstDoubleRepresentation.addEventListener('click', showFirstDoubleRepresentation, false);
graphicSecondDoubleRepresentation.addEventListener('click', showSecondDoubleRepresentation, false);


function calculateAverage(points) {

  let total = points.length;
  let sum = 0;

  for (let p = 0; p < total; p++) {

    let point = points[p];
    sum += parseFloat(point);

  }

  let average = sum / total;

  return average;

}


function calculateMedian(points) {

  let numericPoints = [];

  for (let p = 0; p < points.length; p++) {

    let point = points[p];
    numericPoints.push(parseFloat(point));

  }

  let orderedPoints = [];

  while (numericPoints.length > 0) {

    let removedIndex = 0;

    for (let i = 0; i < numericPoints.length; i++) {

      if (numericPoints[i] < numericPoints[removedIndex]) {

        removedIndex = i;

      }

    }

    let removedPoint = numericPoints[removedIndex];
    orderedPoints.push(removedPoint);
    numericPoints.splice(removedIndex, 1);

  }

  let index = Math.ceil(orderedPoints.length/2) - 1;
  let median = orderedPoints[index];

  return median;

}


function calculateStandardDeviation(points) {

  let total = points.length;
  let average = calculateAverage(points);
  let sum = 0;

  for (let p = 0; p < total; p++) {

    let point = points[p];
    sum += Math.pow(parseFloat(point) - average, 2);

  }

  let standardDeviation = Math.sqrt(sum / total);

  return standardDeviation;

}


function calculateHypervolume(points) {

  let numberOfVariables = points.length;
  let numberOfPoints = points[0].length;

  let hypervolume = 0;

  for (let p = 0; p < numberOfPoints; p++) {

    let pointHypervolume = (points[0])[p];

    for (let v = 1; v < numberOfVariables; v++) {

      pointHypervolume *= (points[v])[p];

    }

    hypervolume += pointHypervolume;

  }

  return hypervolume;

}


function setStats(algorithms, variables, points) {

  statsAllGraphics = [];
  statsAllAlgorithms = [];

  statsAlgorithms = algorithms;
  statsVariables = variables;
  statsAlgorithmsPoints = [];
  statsAllPoints = [];

  graphicAverages = [];
  graphicMedians = [];
  graphicStandardDeviations = [];
  graphicHypervolumes = [];

  for (let n = 0; n < statsVariables.length; n++) {

    statsAllPoints.push([]);

  }


  let allAlgorithmsAverages = [];
  let allAlgorithmsMedians = [];
  let allAlgorithmsStandardDeviations = [];
  let allAlgorithmsHypervolumes = [];

  for (let a = 0; a < statsAlgorithms.length; a++) {

    let algorithm = statsAlgorithms[a];
    let algorithmFiles = points[a];
    let algorithmPoints = [];

    for (let n = 0; n < statsVariables.length; n++) {

      algorithmPoints.push([]);

    }

    for (let f = 0; f < algorithmFiles.length; f++) {

      let fileVariables = algorithmFiles[f];

      for (let v = 0; v < fileVariables.length; v++) {

        let variablePoints = fileVariables[v];

        for (let p = 0; p < variablePoints.length; p++) {

          let point = variablePoints[p];
          algorithmPoints[v].push(point);
          statsAllPoints[v].push(point);

        }

      }

    }

    statsAlgorithmsPoints.push(algorithmPoints);

    let algorithmAverages = [];
    let algorithmMedians = [];
    let algorithmStandardDeviations = [];

    for (let i = 0; i < algorithmPoints.length; i++) {

      let algorithmVariablePoints = algorithmPoints[i];

      let algorithmVariableAverage = calculateAverage(algorithmVariablePoints);
      let algorithmVariableMedian = calculateMedian(algorithmVariablePoints);
      let algorithmVariableStandardDeviation = calculateStandardDeviation(algorithmVariablePoints);

      algorithmAverages.push(algorithmVariableAverage);
      algorithmMedians.push(algorithmVariableMedian);
      algorithmStandardDeviations.push(algorithmVariableStandardDeviation);

    }

    allAlgorithmsAverages.push(algorithmAverages);
    allAlgorithmsMedians.push(algorithmMedians);
    allAlgorithmsStandardDeviations.push(algorithmStandardDeviations);

  }

  graphicAverages.push(allAlgorithmsAverages);
  graphicMedians.push(allAlgorithmsMedians);
  graphicStandardDeviations.push(allAlgorithmsStandardDeviations);

  let allPointsAverages = [];
  let allPointsMedians = [];
  let allPointsStandardDeviations = [];

  for (let i = 0; i < statsAllPoints.length; i++) {

    let allVariablePoints = statsAllPoints[i];

    let allVariableAverage = calculateAverage(allVariablePoints);
    let allVariableMedian = calculateMedian(allVariablePoints);
    let allVariableStandardDeviation = calculateStandardDeviation(allVariablePoints);

    allPointsAverages.push(allVariableAverage);
    allPointsMedians.push(allVariableMedian);
    allPointsStandardDeviations.push(allVariableStandardDeviation);

  }

  if (statsVariables.length > 1) {

    hypervolumeStats.disabled = false;

    for (let i = 0; i < statsAlgorithmsPoints.length; i++) {

      let algorithmHypervolume = calculateHypervolume(statsAlgorithmsPoints[i]);
      allAlgorithmsHypervolumes.push(algorithmHypervolume);

    }

    graphicHypervolumes.push(allAlgorithmsHypervolumes);

    let allAlgorithmsHypervolume = calculateHypervolume(statsAllPoints);
    graphicHypervolumes.push(allAlgorithmsHypervolume);

  } else {

    hypervolumeStats.disabled = true;

  }

  graphicAverages.push(allPointsAverages);
  graphicMedians.push(allPointsMedians);
  graphicStandardDeviations.push(allPointsStandardDeviations);

  for (let g = 0; g < statsAlgorithmsPoints.length; g++) {

    statsAllGraphics.push(statsAlgorithmsPoints[g]);
    statsAllAlgorithms.push(statsAlgorithms[g]);

  }

  statsAllGraphics.push(statsAllPoints);
  statsAllAlgorithms.push("TODOS");

  currentStatsGraphicVariable = 0;
  currentStatsGraphicAlgorithm = 0;
  showStatsGraphic();

}


function showAverageStats() {

  averageStats.style.border = "solid #000000";
  medianStats.style.border = "none";
  standardDeviationStats.style.border = "none";
  hypervolumeStats.style.border = "none";

  showStats(graphicAverages);

}

function showMedianStats() {

  averageStats.style.border = "none";
  medianStats.style.border = "solid #000000";
  standardDeviationStats.style.border = "none";
  hypervolumeStats.style.border = "none";

  showStats(graphicMedians);

}

function showStandardDeviationStats() {

  averageStats.style.border = "none";
  medianStats.style.border = "none";
  standardDeviationStats.style.border = "solid #000000";
  hypervolumeStats.style.border = "none";

  showStats(graphicStandardDeviations);

}


function showHypervolumeStats() {

  averageStats.style.border = "none";
  medianStats.style.border = "none";
  standardDeviationStats.style.border = "none";
  hypervolumeStats.style.border = "solid #000000";

  let stats = graphicHypervolumes;

  statsInfo.innerHTML = "";

  let algorithmsStats = stats[0];
  let allStats = stats[1];

  statsInfo.innerHTML += "ESTATÍSTICAS POR ALGORITMO".bold();
  statsInfo.appendChild(document.createElement("br"));


  for (let a = 0; a < statsAlgorithms.length; a++) {

    let algorithm = statsAlgorithms[a];
    let algorithmStats = algorithmsStats[a];

    statsInfo.appendChild(document.createElement("br"));
    statsInfo.innerHTML += algorithm.bold();
    statsInfo.appendChild(document.createElement("br"));
    statsInfo.innerHTML += algorithmStats;
    statsInfo.appendChild(document.createElement("br"));

  }

  statsInfo.appendChild(document.createElement("br"));
  statsInfo.appendChild(document.createElement("br"));
  statsInfo.innerHTML += "ESTATÍSTICAS GLOBAIS".bold();
  statsInfo.appendChild(document.createElement("br"));
  statsInfo.appendChild(document.createElement("br"));

  statsInfo.innerHTML += allStats;
  statsInfo.appendChild(document.createElement("br"));

}


function showStats(stats) {

  statsInfo.innerHTML = "";

  let algorithmsStats = stats[0];
  let allStats = stats[1];

  statsInfo.innerHTML += "ESTATÍSTICAS POR ALGORITMO".bold();
  statsInfo.appendChild(document.createElement("br"));


  for (let a = 0; a < statsAlgorithms.length; a++) {

    let algorithm = statsAlgorithms[a];
    let algorithmStats = algorithmsStats[a];

    statsInfo.appendChild(document.createElement("br"));
    statsInfo.innerHTML += algorithm.bold();
    statsInfo.appendChild(document.createElement("br"));

    for (let v = 0; v < statsVariables.length; v++) {

      let variable = statsVariables[v];
      let variableStats = algorithmStats[v];

      statsInfo.innerHTML += variable + ": " + variableStats;
      statsInfo.appendChild(document.createElement("br"));

    }

  }

  statsInfo.appendChild(document.createElement("br"));
  statsInfo.appendChild(document.createElement("br"));
  statsInfo.innerHTML += "ESTATÍSTICAS GLOBAIS".bold();
  statsInfo.appendChild(document.createElement("br"));
  statsInfo.appendChild(document.createElement("br"));

  for (let s = 0; s < allStats.length; s++) {

    let globalVariable = statsVariables[s];
    let globalStats = allStats[s];

    statsInfo.innerHTML += globalVariable + ": " + globalStats;
    statsInfo.appendChild(document.createElement("br"));

  }

}


function showStatsGraphic() {

  let points = statsAllGraphics[currentStatsGraphicAlgorithm];
  let variable = statsVariables[currentStatsGraphicVariable];
  let algorithm = statsAllAlgorithms[currentStatsGraphicAlgorithm];

  statsCurrentGraphicVariable.innerHTML = variable;
  statsCurrentGraphicAlgorithm.innerHTML = algorithm;

  data = [];
  layout = {
  };

  let trace = {

    x: points[currentStatsGraphicVariable],

    type: 'box',
    opacity: 0.5,
    marker: {
      color: '#000000',
    },
    name: " ",

  }

  data.push(trace);

  Plotly.newPlot('statsCurrentGraphic', data, layout);

}


function showPreviousStatsGraphicVariable() {

  if (currentStatsGraphicVariable == 0) {

    currentStatsGraphicVariable = statsVariables.length - 1;

  } else {

    currentStatsGraphicVariable--;

  }

  showStatsGraphic();

}


function showNextStatsGraphicVariable() {

  if (currentStatsGraphicVariable == statsVariables.length - 1) {

    currentStatsGraphicVariable = 0;

  } else {

    currentStatsGraphicVariable++;

  }

  showStatsGraphic();

}


function showPreviousStatsGraphicAlgorithm() {

  if (currentStatsGraphicAlgorithm == 0) {

    currentStatsGraphicAlgorithm = statsAllAlgorithms.length - 1;

  } else {

    currentStatsGraphicAlgorithm--;

  }

  showStatsGraphic();

}


function showNextStatsGraphicAlgorithm() {

  if (currentStatsGraphicAlgorithm == statsAllAlgorithms.length - 1) {

    currentStatsGraphicAlgorithm = 0;

  } else {

    currentStatsGraphicAlgorithm++;

  }

  showStatsGraphic();

}


averageStats.addEventListener('click', showAverageStats, false);
medianStats.addEventListener('click', showMedianStats, false);
standardDeviationStats.addEventListener('click', showStandardDeviationStats, false);
hypervolumeStats.addEventListener('click', showHypervolumeStats, false);

statsPreviousGraphicVariable.addEventListener('click', showPreviousStatsGraphicVariable, false);
statsNextGraphicVariable.addEventListener('click', showNextStatsGraphicVariable, false);
statsPreviousGraphicAlgorithm.addEventListener('click', showPreviousStatsGraphicAlgorithm, false);
statsNextGraphicAlgorithm.addEventListener('click', showNextStatsGraphicAlgorithm, false);
