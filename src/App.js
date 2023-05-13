import React, { useEffect, useState } from "react";
import "./App.css";
import data_1 from "./data/data_1.json";
import data_2 from "./data/data_2.json";

const DATASETS = {
  1: data_1,
  2: data_2,
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const App = () => {
  const [datasetToUse, setDatasetToUse] = useState("");
  const [dataset, setDataset] = useState(null);
  const [expanded, setExpanded] = useState({});

  const randomizeDataset = (newDataset) => {
    const _dataset = {};
    for (const [key, value] of Object.entries(newDataset)) {
      _dataset[key] = shuffle(
        value.map(({ heading, items }) => ({ heading, items: shuffle(items) }))
      );
    }
    setExpanded({});
    return _dataset;
  };

  const changeDataset = (event) => {
    const newDataset = DATASETS[event.target.value];
    setDataset(randomizeDataset(newDataset));
    setDatasetToUse(event.target.value);
  };

  const refreshCategory = (cat) => {
    setDataset({
      ...dataset,
      [cat]: shuffle(
        dataset[cat].map(({ heading, items }) => ({
          heading,
          items: shuffle(items),
        }))
      ),
    });
    const _expanded = { ...expanded };
    delete _expanded[cat];
    setExpanded(_expanded);
  };

  useEffect(() => {
    const newDataset = DATASETS[1];
    setDataset(randomizeDataset(newDataset));
    setDatasetToUse(1);
    setExpanded({});
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-2">Food for Today</h1>
      <div className="d-flex align-items-end mb-4">
        <div className="mr-auto mr-lg-3">
          <label for="data">Dataset to use for items</label>
          <select
            name="data"
            id="data"
            className="form-control"
            onChange={changeDataset}
            value={datasetToUse}
          >
            <option value="" hidden selected>
              ---
            </option>
            <option value="1">Dataset 1</option>
            <option value="2">Dataset 2</option>
          </select>
        </div>
        <button
          className="btn btn-success"
          onClick={() => setDataset(randomizeDataset(dataset))}
        >
          refresh
        </button>
      </div>
      {dataset &&
        Object.entries(dataset).map(([key, val]) => (
          <div key={key} className="mb-4">
            <div className="d-flex align-items-center">
              <h3 className="mb-0 text-capitalize mr-auto mr-lg-2">{key}</h3>
              <button
                className="btn btn-sm btn-primary py-0"
                onClick={() => refreshCategory(key)}
              >
                refresh
              </button>
            </div>
            <h5 className="mb-0 text-capitalize">{val[0].heading}</h5>
            <ul
              className="pl-3 mb-0"
              style={
                !(key in expanded) ? { maxHeight: 72, overflow: "hidden" } : {}
              }
            >
              {val[0].items.map((item, i) => (
                <li
                  className={`text-capitalize ${
                    i > 2 ? "text-secondary" : ""
                  } ${i === 0 ? "font-weight-bold" : ""} `}
                  key={i}
                >
                  {item}
                </li>
              ))}
            </ul>
            {val[0].items.length > 3 && !expanded[key] && (
              <p className="mb-0">
                <span
                  className="text-info cursor-pointer"
                  onClick={() => {
                    setExpanded({
                      ...expanded,
                      [key]: true,
                    });
                  }}
                >
                  Read more...
                </span>
              </p>
            )}
          </div>
        ))}
    </div>
  );
};

export default App;
