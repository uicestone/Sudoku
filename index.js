const size = 9;
const blockSize = 3;
const values = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const hints = [[4, 0, 1], [5, 0, 4], [7, 0, 8], [0, 1, 7], [2, 1, 8], [5, 2, 8], [0, 3, 5], [2, 3, 2], [3, 4, 6], [6, 5, 1], [8, 5, 8], [6, 6, 9], [1, 7, 6], [3, 8, 9], [4, 8, 3]];

/* Cell:
{
	value: Number,
	possibleValues: [Number],
	sure: Boolean
}
*/

let rows = []; // [[Cell]]
let columns = []; // [[Cell]]
let blocks = []; // [[Cell]]

initializeGroups();
initializeHints();
printSudoku();
linkCellsToColumnsAndBlocks();

setGroupsPossibleValues();

rows.forEach((row, y) => {
	row.forEach((cell, x) => {
		console.log(y, x, cell);
	});
});


// functions

function initializeGroups() {
	// initialize size of rows, columns and blocks
	for (let y = 0; y < size; y++) {
		
		rows.push([]);
		columns.push([]);
		blocks.push([]);

		for (let x = 0; x < size; x++) {
			rows[y].push({});
		}
	}
}

function initializeHints() {
	hints.forEach(hint => {
		rows[hint[1]][hint[0]] = {value: hint[2], sure: true, possibleValues: new Set([hint[2]])};
	});
}

function linkCellsToColumnsAndBlocks () {
	rows.forEach((row, y) => {
		row.forEach((cell, x) => {
			// link cell to column
			columns[x][y] = cell;

			// link cell to block
			let blockNumber = Math.floor(x / blockSize) + Math.floor(y / blockSize) * blockSize;
			let cellNumberInBlock = x % blockSize + y % blockSize * blockSize;
			blocks[blockNumber][cellNumberInBlock] = cell;
		});
	});
}

function printSudoku() {
	process.stdout.write("\033c");
	process.stdout.write("\n\n" + '-'.repeat(4 * size + 1) + "\n");
	rows.forEach((row, y) => {
		row.forEach((cell, x) => {
			// print sudoku
			process.stdout.write((x ? '' : '|') + ' ');
			process.stdout.write((cell.value ? String(cell.value) : ' '));
			process.stdout.write(' |');
		});
		process.stdout.write("\n" + '-'.repeat(4 * size + 1) + "\n");
	});
}

function setCellsPossibleValues(group) {
	const groupSureValues = new Set(group.filter(cell => cell.sure).map(cell => cell.value));
	const possibleValues = new Set([...values].filter(value => !groupSureValues.has(value)));
	
	group.forEach(cell => {

		if (cell.sure) {
			return;
		}

		if (!cell.possibleValues) {
			cell.possibleValues = possibleValues;
		}
		else {
			cell.possibleValues = new Set([...cell.possibleValues].filter(value => possibleValues.has(value)));
		}

		if (cell.possibleValues.size === 0) {
			throw 'not possible';
		}
		else if (cell.possibleValues.size === 1) {
			cell.sure = true;
			cell.value = [...cell.possibleValues][0];
		}
	});
}

function setGroupsPossibleValues () {
	rows.forEach(row => setCellsPossibleValues(row));
	columns.forEach(column => setCellsPossibleValues(column));
	blocks.forEach(block => setCellsPossibleValues(block));
}
