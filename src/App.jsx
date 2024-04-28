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
	let v = Math.floor(y / 3);

	for (let i = v * 3; i < v * 3 + 3; i++) {
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
					className={`${styles.button} ${choose === i && styles.choosed}`}
					style={{
						borderBottom:
							(i >= 18 && i < 27) || (i >= 45 && i < 54) || (i >= 72 && i < 82)
								? "3px solid #00367F"
								: "1px solid #DBDBDB",
						borderTop:
							i >= 0 && i < 9 ? "3px solid #00367F" : "1px solid #DBDBDB",
						backgroundColor: !Number.isNaN(number[i])
							? "white"
							: (i >= Math.floor(choose / 9) * 9 &&
									i < Math.floor(choose / 9) * 9 + 9) ||
							  Array.from(
									{ length: 9 },
									(_, k) => k * 9 + (choose % 9)
							  ).includes(i) ||
							  Array.from(
									{ length: 9 },
									(_, k) =>
										(k % 3) +
										Math.floor(choose / 3) * 3 +
										Math.floor(k / 3) * 9 -
										9 * ~~((choose % 27) / 9)
							  ).includes(i)
							? "#E2EBF3"
							: "",
					}}
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
				AC
			</button>
		);
		return arr;
	}
	return (
		<div style={{ textAlign: "center" }}>
			<h1 style={{ color: "#00367F" }}>Sudoku solver</h1>

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
