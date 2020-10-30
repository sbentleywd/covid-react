import React, { useEffect, useState } from "react";
import { addCommas } from "../../utils/utils";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

// component imports
import SummaryCard from "./SummaryCard";

const useStyles = makeStyles({
	root: {
		minWidth: 275,
	},

	title: {
		fontSize: 14,
	},
	cardRow: {
		display: "flex",
		justifyContent: "center",
	},
	detailsRow: {
		display: "flex",
		justifyContent: "space-between",
	},
});

const WorldData = (props) => {
	const [worldData, setWorldData] = useState(null);
	const classes = useStyles();

	useEffect(() => {
		console.log("use effect running");
		if (!worldData) {
			if (sessionStorage.getItem("worldData")) {
				const data = JSON.parse(sessionStorage.getItem("worldData"));

				setWorldData(data);
			} else {
				getData();
			}
		}

		async function getData() {
			console.log("getting data");
			const url = `https://api.covid19api.com/summary`;
			const requestOptions = {
				method: "GET",
				redirect: "follow",
			};
			try {
				const response = await fetch(url, requestOptions);
				if (response.ok) {
					const jsonResponse = await response.json();
					console.log(jsonResponse);
					setWorldData(jsonResponse);
					if (!sessionStorage.getItem("worldData")) {
						sessionStorage.setItem(
							"worldData",
							JSON.stringify(jsonResponse)
						);
					}

					return;
				}
			} catch (error) {
				console.log(error);
			}
		}
	});
	return worldData ? (
		<Grid container className={classes.cardRow}>
			<Grid item xs={8} m={6} className={classes.cardRow}>
				<SummaryCard data={worldData.Global} country={"Worldwide"} />

				<SummaryCard
					data={
						worldData.Countries.filter((item) => {
							return item.Country === props.country;
						})[0]
					}
					// data={worldData.Global}
					country={props.country}
				/>
			</Grid>
		</Grid>
	) : (
		<></>
	);
};

export default WorldData;