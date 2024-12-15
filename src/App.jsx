import React, { useState } from "react";
import "./App.css"; 
import {simplexSolver } from "./simplexe";

const App = () => {
  const defaultNumVariables = 2;
  const [numVariables, setNumVariables] = useState(defaultNumVariables);
  const [constraints, setConstraints] = useState([]);
  const [formGenerated, setFormGenerated] = useState(false);
  const [constraintOperators, setConstraintOperators] = useState([]);
  

  const generateCoefficients = (index, type) => {
    const fields = Array.from({ length: numVariables }, (_, i) => (
      <div key={`${type}${index}-${i + 1}`} className="coefficient-field">
        <label htmlFor={`${type}${index}-${i + 1}`}>{`x${i + 1}:`}</label>
        <div>
          <input
            type="number"
            id={`${type}${index}-${i + 1}`}
            required
            className="coefficient-input"
            onChange={(e) => handleCoefficientChange(index, i, e.target.value)}
          />
          {/* Add a plus sign except for the last input */}
          {i < numVariables - 1 && <span className="plus-sign"> + </span>}
        </div>
      </div>
    ));

    return (
      <div className="left-side-values">
        <h3 className="coefficient-heading">
          {`${type.charAt(0).toUpperCase() + type.slice(1)} ${
            index + 1
          } Coefficients:`}
        </h3>
        <div className="content">
          {fields}
        </div>
      </div>
    );
  };

  const addObjectiveCoefficients = () => {
    setConstraints((prevConstraints) => [
      ...prevConstraints,
      { coefficients: Array(numVariables).fill(0) },
    ]);

    setFormGenerated(true);
  };

  const addConstraint = () => {
    setConstraints((prevConstraints) => [
      ...prevConstraints,
      { coefficients: Array(numVariables).fill(0) },
    ]);
  };

  const handleCoefficientChange = (constraintIndex, variableIndex, value) => {
    setConstraints((prevConstraints) => {
      const newConstraints = [...prevConstraints];
      newConstraints[constraintIndex].coefficients[variableIndex] =
        parseFloat(value);
      return newConstraints;
    });
  };

  const solveSimplex = () => {
    // Extract objective coefficients
    const objectiveCoefficients =
      constraints[constraints.length - 1].coefficients;

    // Extract constraint coefficients (excluding the last element)
    const constraintCoefficients = constraints
      .slice(0, -1)
      .map((constraint) => constraint.coefficients);

    // Extract right-hand side values
    const rhsValues = constraints
      .slice(0, -1)
      .map((_, i) =>
        parseFloat(document.getElementById(`constraintsRHS${i}`).value)
      );

    // Solve the Simplex algorithm
  
      simplexSolver(objectiveCoefficients, constraintCoefficients, rhsValues)
    

  };

  // Your Simplex algorithm implementation goes here (use the simplexSolver function provided in the previous message)

  const resetForm = () => {
    setNumVariables(defaultNumVariables);
    setConstraints([]);
    setFormGenerated(false);
    const result_container = document.getElementById("result-container");
    result_container.innerHTML = "";
    const final_result = document.getElementById("final-result");
    final_result.innerHTML = "";
  };

  return (
    <>
      <h1 className="app-title">L'Algorithme du Simplex</h1>
      <div className="app-container">
        <form className="input-form">
          <label htmlFor="numVariables" className="form-label">
            Nombre des Variables:
          </label>
          <input
            type="number"
            id="numVariables"
            min="1"
            value={numVariables}
            onChange={(e) => setNumVariables(e.target.value)}
            className="form-input"
          />
          {!formGenerated && (
            <button
              type="button"
              onClick={addObjectiveCoefficients}
              className="form-button"
            >
              Générer la forme
            </button>
          )}

          <div id="formContainer" className="form-container">
            {formGenerated && (
              <>
                <button
                  type="button"
                  onClick={addConstraint}
                  className="form-button"
                >
                  Ajouter une contrainte
                </button>
                {generateCoefficients(constraints.length - 1, "objective")}
                <div className="constraint-group">
                  {constraints.slice(0, -1).map((_, i) => (
                    <div key={`constraint${i}`} className="constraint-container">
                      {generateCoefficients(i, "constraint")}
                      <div key={`constraintsRHS${i}`} className="rhs-container">
                        <input type="button" value="<=" className="smaller-or-equal-sign"/>
                        <input
                          type="number"
                          id={`constraintsRHS${i}`}
                          required
                          className="rhs-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button type="button" onClick={solveSimplex} className="form-button">
            Résoudre avec Simplexe
          </button>

          <button type="button" onClick={resetForm} className="reset-button">
            Réinitialiser
          </button>
        </form>
        <div className="result">
          <div id="result-container">
            <h3>Les étapes de l'algorithme:</h3>
          </div>
          <div id="final-result">
            
          </div>
          
        </div>
      </div>
    </>
  );
};

export default App;
