import { multiply, min} from "mathjs";

function simplexSolver(objectiveCoefficients,constraintCoefficients,rhsValues) {
  const numberOfConstraints = constraintCoefficients.length;

  // Add zeros to the objectiveCoefficients array based on the number of constraints
  let modifiedObjectiveCoefficients = [
    ...objectiveCoefficients,
    ...Array(numberOfConstraints).fill(0),
  ];

  // Add 1 to each array in constraintCoefficients
  const modifiedConstraintCoefficients = constraintCoefficients.map(
    (coefficients) => [...coefficients, 1]
  );

  const xN = {};
  objectiveCoefficients.forEach((_, i) => {
    xN[`x${i + 1}`] = 0;
  });

  const xB = {};
  rhsValues.forEach((value, i) => {
    xB[`s${i + 1}`] = value;
  });


  const firstRow = ["", "z", ...Object.keys(xN), ...Object.keys(xB), ""];

  let cB = [...Array(numberOfConstraints).fill(0)];
  let cN = objectiveCoefficients;
  let b = rhsValues;
  let z_bar = multiply(cB, b);
  let zN_cN = [...objectiveCoefficients.map(coeff => -coeff)]


  let rows = [];
  for (let index = 0; index < numberOfConstraints; index++) {
    const identityRow = Array.from({ length: numberOfConstraints }, (_, i) =>
      i === index ? 1 : 0
    );
    rows[index] = [
      Object.keys(xB)[index],
      0,
      ...constraintCoefficients[index],
      ...identityRow,
      rhsValues[index],
    ];
  }

  const secondRow = ["z",1,...zN_cN,...Array(numberOfConstraints).fill(0),z_bar];
  
  let inBase = [...Object.keys(xB)]
  let inBaseValues = [...Object.values(xB)]

  let outBase = [...Object.keys(xN)]
  let outBaseValues = [...Object.values(xN)]

  let numberOfPivoting = 0
  let stoppingCondition = {isStopped : true , stoppingCause : ""} 

  renderTable("Tableau initial" , firstRow, secondRow, rows, "result-container");

  // fin partie 1
  greaterLoop:while (zN_cN.some(element => element < 0)) {
    
      outerLoop:for (let index = 0; index < zN_cN.length; index++) {
        if (zN_cN[index] < 0) {
          for (let second_index = 0; second_index < rows.length; second_index++) {
              if (rows[second_index][index + 2] > 0) {
                stoppingCondition.isStopped = false;
                stoppingCondition.stoppingCause = "";
                break outerLoop;
              }else{
                stoppingCondition.stoppingCause = "Il n'existe pas de solution optimale finie pour ce problème !!";
                
              }
          }
          if (stoppingCondition.isStopped) {
            break greaterLoop;
          }
        }
      }

      let minValueInOutBase = min(zN_cN)
      let indexOfMinValueInOutBase = zN_cN.indexOf(minValueInOutBase);

      let pivotColumn = outBase[indexOfMinValueInOutBase];
      let indexOfPivotColumn = firstRow.indexOf(pivotColumn) - 2;

      let bi_sur_aij = []
      for (let index = 0; index < rows.length; index++) {
        if (rows[index].slice(-1)[0] > 0 && rows[index][2+indexOfPivotColumn] > 0) {
            bi_sur_aij[index] = b[index]/ rows[index][2+indexOfPivotColumn]
        }else { 
            bi_sur_aij[index] = 1000000000000000
        }
      }
      
      let minRowValue = min(bi_sur_aij)
      let indexOfPivotRow = bi_sur_aij.indexOf(minRowValue)
      let pivotRow = inBase[indexOfPivotRow]

      let pivot = rows[indexOfPivotRow][2+indexOfPivotColumn]
      let originalRows = []
      for (let index = 0; index < rows.length; index++) {
        if (index !== indexOfPivotRow) {
            originalRows[index] = [...rows[index]]
        }
      }

      for (let index = 0; index < originalRows.length; index++) {
        if (index !== indexOfPivotRow) {
            for (let second_index = 1; second_index < originalRows[index].length; second_index++) {
                rows[index][second_index] = originalRows[index][second_index] - (originalRows[index][indexOfPivotColumn + 2] / pivot)*rows[indexOfPivotRow][second_index]
            }
          }
        }
      rows[indexOfPivotRow][0] = pivotColumn;
      let originalPivotRow =[...rows[indexOfPivotRow]]

      for (let index = 1; index < rows[indexOfPivotRow].length; index++) {
        rows[indexOfPivotRow][index]=rows[indexOfPivotRow][index]/(pivot)
      }

      let originalSecondRow = [...secondRow];

     for (let index = 2; index < originalSecondRow.length; index++) {
          secondRow[index] = originalSecondRow[index] - (originalSecondRow[indexOfPivotColumn + 2] / pivot)*originalPivotRow[index];
      }
              
      inBase.splice(indexOfPivotRow , 1 , pivotColumn)
      for (let index = 0; index < inBaseValues.length; index++) {
        inBaseValues[index] = rows[index].slice(-1)[0]
      }

      outBase.splice(indexOfPivotColumn , 1 , pivotRow)


      for (let index = 0; index < outBase.length; index++) {
        let indexofOutBase = firstRow.indexOf(outBase[index]);
        zN_cN[index] = secondRow[indexofOutBase]
        
      }
      for (let index = 0; index < b.length; index++) {
        b[index] = rows[index].slice(-1)[0]
        
      }
      numberOfPivoting++;
      renderTable(`tableau après ${numberOfPivoting} pivotage`,firstRow, secondRow, rows, "result-container");
  }


    const result = [...inBase.filter((element) => element.startsWith("x")) , ...outBase.filter((element) => element.startsWith("x"))];
    let finalValues = {}
    for (let index = 0; index < result.length; index++) {
      const currentElement = result[index];

      if (inBase.includes(currentElement)) {
        finalValues[currentElement] = inBaseValues[inBase.indexOf(currentElement)];
      } else if (outBase.includes(currentElement)) {
        finalValues[currentElement] =
          outBaseValues[outBase.indexOf(currentElement)];
      }
    }
    const sortedKeys = Object.keys(finalValues).sort();

    // Create a new object with sorted keys
    const sortedFinalValues = {};
    sortedKeys.forEach((key) => {
      sortedFinalValues[key] = finalValues[key];
    });

    renderResult("final-result", sortedFinalValues,zN_cN, stoppingCondition, secondRow);






}

function renderTable(tableDescription, firstRow, secondRow, rows, containerId) {
  // Create a div element
  const containerDiv = document.createElement("div");
  const descriptionHeader = document.createElement("h3");
  descriptionHeader.textContent = tableDescription;

  containerDiv.appendChild(descriptionHeader);

  const table = document.createElement("table");

  // Add a border to the table
  table.style.border = "1px solid black";
  table.style.width = "100%";

  const thead = table.createTHead();

  // Add the first row to the thead
  const headerRow = thead.insertRow();
  for (const cellValue of firstRow) {
    const cell = headerRow.insertCell();
    cell.textContent = cellValue;
    // Add a border to the header cells
    cell.style.border = "1px solid black";
  }

  // Add the second row to the thead
  const secondHeaderRow = thead.insertRow();
  for (const cellValue of secondRow) {
    const cell = secondHeaderRow.insertCell();
    cell.textContent = cellValue;
    cell.style.border = "1px solid black";
  }

  const tbody = table.createTBody();

  // Add rows to the tbody
  for (const rowData of rows) {
    const row = tbody.insertRow();
    for (const cellValue of rowData) {
      const cell = row.insertCell();
      cell.textContent = cellValue;
      cell.style.border = "1px solid black";
    }
  }

  containerDiv.appendChild(table);

  const resultContainer = document.getElementById(containerId);

  resultContainer.appendChild(containerDiv);
}

const renderResult = (resultId ,  sortedFinalValues, zN_cN, stoppingCondition, secondRow)=>{
  const resultContainer = document.getElementById(resultId);

  resultContainer.innerHTML = "";
  const containerElement = document.createElement("h4");
  if (stoppingCondition.isStopped) {
    containerElement.innerText = stoppingCondition.stoppingCause;
    
  }else{
    if (zN_cN.every(element => element > 0)) {
      containerElement.innerText = `La solution optimale est : ${secondRow.splice(-1)[0]} \nLes valeurs de la solution sont :(${Object.keys(sortedFinalValues)}):(${ Object.values(sortedFinalValues)}) et elle est unique`;
    }else{
      containerElement.innerText = `Il existe un nombre infini de solutions optimales !! L'une d'elles est :${secondRow.splice(-1)[0]} \nLes valeurs de la solution sont :(${Object.keys(sortedFinalValues)}):(${ Object.values(sortedFinalValues)}) et elle est unique `;

    }
  }

  resultContainer.appendChild(containerElement);


}
export { renderTable, simplexSolver };
