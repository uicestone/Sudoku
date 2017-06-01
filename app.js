const crypto = require('crypto');
const start = new Date();
const size = 9;
const blockSize = 3;
const values = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const stdin = process.openStdin();

let hints = [];
let lines = 0;

stdin.addListener("data", function(d) {
	lines ++;
	d.toString().trim().split(/\s+/).forEach((digit, index) => {
		digit = Number(digit);
		if (digit === 0) {
			return;
		}
		hints.push([lines - 1, index, digit]);
	});

	if(lines === 9) {

		hints = new Set(hints);

		try {
			let seen = new Set();
			solve(hints, seen);
		}
		catch (e) {
			if (e === 'solved')
				console.log('Solved.');
			else {
				console.error(e);
			}
		}

		console.log('Time:', new Date() - start);
	}
});

/* Cell:
{
	possibleValues: [Number],
	row: Number,
	column: Number,
	block: Number,
	value: Number,
}
*/

/* Sudoku: 
{
	cells: [Cell],
	rows: [[Cell]],
	columns: [[Cell]],
	blocks: [[Cell]]
}
*/

// functions

function solve (filledValues, seen) {

	const situationHash = hashSituation(filledValues);
	if (seen.has(situationHash)) {
		return;
	}

	seen.add(situationHash);

	let sudoku = initializeSudoku(filledValues);

	if (new Date().getTime() % 100 === 0 || filledValues.size === 81) {
		printSudoku(sudoku, [...filledValues][filledValues.size - 1]);
		console.log('Filled:', filledValues.size, 'Seen:', seen.size);
		console.log('Situation:', situationHash);
		if (filledValues.size === 81) {
			throw 'solved';
		}
	}

	sudoku.cells.filter(cell => !cell.value).sort((a, b) => a.possibleValues.size - b.possibleValues.size).forEach(cell => {
		
		cell.possibleValues.forEach(value => {
			
			let newFilledValues = new Set(filledValues.values());
			newFilledValues.add([cell.row, cell.column, value]);

			try {
				solve(newFilledValues, seen);
			}

			catch (e) {
				if (e === 'solved') {
					throw e;
				}
				else if (e === 'no possible value') {

				}
				else {
					console.error(e);
				}
			}
		});
	});
}

// rows.forEach((row, y) => {
// 	row.forEach((cell, x) => {
// 		console.log(y, x, cell);
// 	});
// });


// functions

function initializeSudoku(filledValues) {

	let sudoku = {rows: [], columns: [], blocks: [], cells: []};
	// initialize size of rows, columns and blocks
	for (let y = 0; y < size; y++) {
		
		sudoku.rows.push([]);
		sudoku.columns.push([]);
		sudoku.blocks.push([]);

		for (let x = 0; x < size; x++) {
			let cell = {possibleValues: values, row: y, column: x};
			sudoku.rows[y].push(cell);
			sudoku.cells.push(cell);
		}
	}

	initializeFilledValues(sudoku, filledValues);
	linkCellsToColumnsAndBlocks(sudoku);
	setGroupsPossibleValues(sudoku);

	return sudoku;
}

function initializeFilledValues(sudoku, filledValues) {
	filledValues.forEach(value => {
		let cell = sudoku.rows[value[0]][value[1]];
		cell.value = value[2];
		cell.possibleValues = new Set([value[2]]);
	});
}

function linkCellsToColumnsAndBlocks (sudoku) {
	sudoku.cells.forEach(cell => {
		// link cell to column
		sudoku.columns[cell.column][cell.row] = cell;

		// link cell to block
		let blockNumber = Math.floor(cell.column / blockSize) + Math.floor(cell.row / blockSize) * blockSize;
		let cellNumberInBlock = cell.column % blockSize + cell.row % blockSize * blockSize;
		sudoku.blocks[blockNumber][cellNumberInBlock] = cell;
		cell.block = blockNumber;
	});
}

function setGroupsPossibleValues (sudoku) {
	sudoku.rows.forEach(row => setCellsPossibleValues(row));
	sudoku.columns.forEach(column => setCellsPossibleValues(column));
	sudoku.blocks.forEach(block => setCellsPossibleValues(block));
}

function setCellsPossibleValues(group) {

	const groupFilledValues = new Set(group.filter(cell => cell.value).map(cell => cell.value));
	const possibleValues = new Set([...values].filter(value => !groupFilledValues.has(value)));

	group.forEach(cell => {

		if (cell.value) {
			return;
		}

		cell.possibleValues = new Set([...cell.possibleValues].filter(value => possibleValues.has(value)));

		if (cell.possibleValues.size === 0) {
			throw 'no possible value';
		}
	});
}

function printSudoku(sudoku, testing) {
	// process.stdout.write("\033c");
	process.stdout.write("\n\n" + '-'.repeat(4 * size + 1) + "\n");
	sudoku.rows.forEach((row, y) => {
		row.forEach((cell, x) => {
			// print sudoku
			process.stdout.write((x ? '' : '|') + ' ');
			if (cell.row === testing[0] && cell.column === testing[1]) {
				process.stdout.write(`\x1b[36m${cell.value}\x1b[0m`);
			}
			else if (cell.value) {
				process.stdout.write(String(cell.value));
			}
			else {
				process.stdout.write(' ');
			}
			process.stdout.write(' |');
		});
		process.stdout.write("\n" + '-'.repeat(4 * size + 1) + "\n");
	});
}

function hashSituation(filledValues) {
	const situationString = [...filledValues].map(value => value.join('')).sort((a, b) => a > b ? 1 : -1).join();
	const situationHash = crypto.createHash('md5').update(situationString).digest("hex");
	return situationHash;
}

