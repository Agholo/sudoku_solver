import styles from "./App.module.css";
import { useState } from "react";

function isValid(board, n, y, x) {
	// row check
	for (let i = 0; i < 9; i++) {
		if (i === x) continue;
		if (board[y][i] === n) return false;
	}
	// column check
	for (let j = 0; j < 9; j++) {
		if (j === y) continue;
		if (board[j][x] === n) return false;
	}
	// grid check
	let h = Math.floor(x / 3);
	let u = Math.floor(y / 3);

	for (let i = u * 3; i < u * 3 + 3; i++) {
		for (let j = h * 3; j < h * 3 + 3; j++) {
			if (i === y && x === j) continue;
			if (board[i][j] === n) return false;
		}
	}

	return true;
}

function App() {
	const [choose, setChoose] = useState(NaN);
	const [number, setNumber] = useState(Array.from({ length: 81 }, () => NaN));

	// works soo slow i don't know why

	// window.addEventListener("keydown", (e) => {
	// 	if (e.key >= "1" && e.key <= "9" && !Number.isNaN(choose)) {
	// 		let tmp = [...number];
	// 		tmp[choose] = Number(e.key);

	// 		setNumber(tmp);
	// 	}
	// 	if (
	// 		(e.key === "Delete" || e.key === "Backspace") &&
	// 		!Number.isNaN(choose)
	// 	) {
	// 		let tmp = [...number];
	// 		tmp[choose] = NaN;

	// 		setNumber(tmp);
	// 	}
	// 	if (e.key === "Enter") {
	// 		solveSudoku(
	// 			Array.from({ length: 9 }, (_, i) => number.slice(i * 9, i * 9 + 9))
	// 		);
	// 	}
	// });

	function solveSudoku(board) {
		function solver(board) {
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {
					if (!Number.isNaN(board[i][j])) continue;
					for (let k = 1; k <= 9; k++) {
						let val = k;
						if (isValid(board, val, i, j)) {
							board[i][j] = val;
							if (solver(board)) return true;
						}
					}

					board[i][j] = NaN;
					return false;
				}
			}
			return true;
		}
		setChoose(NaN);
		solver(board);
		setNumber([].concat(...board));
	}

	function generateBoard() {
		let arr = [];
		for (let i = 0; i < 9 * 9; i++) {
			arr.push(
				<button
					key={i}
					className={`${styles.button} ${
						choose === i
							? styles.choosed
							: Number.isNaN(choose)
							? ""
							: styles.nan
					}`}
					onClick={() => (choose === i ? setChoose(NaN) : setChoose(i))}
				>
					{Number.isNaN(number[i]) ? "" : number[i]}
				</button>
			);
		}
		return arr;
	}
	function generateNumbers() {
		let arr = [];
		for (let i = 1; i <= 9; i++) {
			arr.push(
				<button
					className={styles.button}
					key={i}
					style={{ backgroundColor: "white" }}
					disabled={Number.isNaN(choose)}
					onClick={() => {
						let tmp = [...number];
						tmp[choose] = i;

						setNumber(tmp);
					}}
					title={i}
				>
					{i}
				</button>
			);
		}
		arr.push(
			<button
				className={styles.button}
				key={10}
				style={{ backgroundColor: "white" }}
				disabled={Number.isNaN(choose)}
				onClick={() => {
					let tmp = [...number];
					tmp[choose] = NaN;

					setNumber(tmp);
				}}
				title="Delete"
			>
				C
			</button>
		);
		arr.push(
			<button
				className={styles.button}
				key={11}
				style={{ backgroundColor: "white" }}
				onClick={() => setNumber(Array.from({ length: 81 }, () => NaN))}
				title="Delete all"
			>
				CC
			</button>
		);
		return arr;
	}
	return (
		<div>
			<h1>Sudoku solver</h1>

			<div className={styles.board}>{generateBoard()}</div>
			<div className={styles.numCont}>
				{generateNumbers()}
				<button
					className={styles.solve}
					onClick={() =>
						solveSudoku(
							Array.from({ length: 9 }, (_, i) =>
								number.slice(i * 9, i * 9 + 9)
							)
						)
					}
					title="Solve"
				>
					Solve!
				</button>
			</div>
		</div>
	);
}

export default App;