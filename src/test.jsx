import React, { useState } from "react";

const App = () => {
  const defaultNumVariables = 2;
  const [numVariables, setNumVariables] = useState(defaultNumVariables);
  const [formElements, setFormElements] = useState(null);
  const [constraints, setConstraints] = useState([]);
  const [formGenerated, setFormGenerated] = useState(false);

  const addConstraint = () => {
    setConstraints([...constraints, {}]);

    const newConstraintIndex = constraints.length;
    const constraintFields = [];

    for (let j = 1; j <= numVariables; j++) {
      constraintFields.push(
        <div key={`constraintCoeff${newConstraintIndex}-${j}`}>
          <label htmlFor={`constraintCoeff${newConstraintIndex}-${j}`}>
            Coefficient for x{j}:
          </label>
          <input
            type="number"
            id={`constraintCoeff${newConstraintIndex}-${j}`}
            required
          />
        </div>
      );
    }

    setFormElements((prevFormElements) => (
      <>
        {prevFormElements}
        <div key={`constraint${newConstraintIndex}`}>
          <h3>Constraint {newConstraintIndex + 1} Coefficients:</h3>
          {constraintFields}
          <div key={`constraintsRHS${newConstraintIndex}`}>
            <label htmlFor={`constraintsRHS${newConstraintIndex}`}>
              Right-hand side of constraint:
            </label>
            <input
              type="number"
              id={`constraintsRHS${newConstraintIndex}`}
              required
            />
          </div>
          <div key={`constraintsType${newConstraintIndex}`}>
            <label htmlFor={`constraintsType${newConstraintIndex}`}>
              Type of constraints:
            </label>
            <select id={`constraintsType${newConstraintIndex}`} required>
              <option value="<=">{"<="}</option>
              <option value="=">{"="}</option>
            </select>
          </div>
        </div>
      </>
    ));

    setFormGenerated(true);
  };

  const resetForm = () => {
    setNumVariables(defaultNumVariables);
    setFormElements(null);
    setConstraints([]);
    setFormGenerated(false);
  };

  const solveSimplex = () => {
    // Your logic for solving the simplex algorithm goes here
  };

  return (
    <div>
      <h1>Simplex Algorithm Input</h1>
      <form>
        <label htmlFor="numVariables">Number of Variables:</label>
        <input
          type="number"
          id="numVariables"
          min="1"
          value={numVariables}
          onChange={(e) => setNumVariables(e.target.value)}
        />
        {!formGenerated && (
          <button type="button" onClick={addConstraint}>
            Generate Form
          </button>
        )}

        <div id="formContainer">
          {/* Render the generated form elements */}
          {formGenerated && (
            <button type="button" onClick={addConstraint}>
              Add Constraint
            </button>
          )}
          {formElements}
        </div>

        <button type="button" onClick={solveSimplex}>
          Solve Simplex
        </button>

        <button type="button" onClick={resetForm}>
          Reset
        </button>
      </form>
    </div>
  );
};

export default App;
