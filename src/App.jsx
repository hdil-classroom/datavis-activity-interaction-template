import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";

import './App.css';

function App() {
	// Define state variables.
	const [items, setItems] = useState([]);

	// Load and process the JSON data.
	useEffect(() => {
		fetch('boxoffice.json')
			.then((response) => response.json())
			.then((jsonData) => {
				// Print data into console for debugging.
				console.log(jsonData);

				// Save filtered data items to state.
				setItems(jsonData);
			})
			.catch((error) => {
				console.error('Error loading JSON file:', error);
			});
	}, []);

	// Define constant variables.
	const width = 600;
	const height = 500;
	const marginTop = 20;
	const marginBottom = 60;
	const marginLeft = 80;
	const marginRight = 20;

	// Set scales.
	const x = d3.scaleLinear()
		.domain([0, d3.max(items.map(item => item.screen_count))])
		.range([marginLeft, width - marginRight]);
	const y = d3.scaleLinear()
		.domain([0, d3.max(items.map(item => item.audience_count))])
		.range([height - marginBottom, marginTop]);

	// Set axes.
	const gx = useRef();
	const gy = useRef();
	useEffect(() => void d3.select(gx.current).call(
		d3.axisBottom(x)), [gx, x]);
	useEffect(() => void d3.select(gy.current).call(
		d3.axisLeft(y)), [gx, y]);


	// Render the chart.
	return (
		<>
			<div id="header">
				<h1>In-Class Activity on Interaction</h1>
			</div>

			<div id="main">
				<div id="visualization">
					<svg width={width} height={height}>
						<g ref={gx} className="axis"
							transform={`translate(0, ${height - marginBottom})`} />
						<g ref={gy} className="axis"
							transform={`translate(${marginLeft}, 0)`} />

						<g className="chart-data-area">
							{items.map((item) => {						
								return (
									<g key={item.rank}
										className="datapoint">
										<circle
											cx={x(item.screen_count)}
											cy={y(item.audience_count)}
											r="3"

										/>
									</g>
								);
							})}
						</g>
					</svg>
				</div>

				<div id="selected-item-information">
					<div className="panel-title">Selected Item:</div>
					<div>

					</div>
				</div>
			</div>
		</>
	);
}

export default App;
