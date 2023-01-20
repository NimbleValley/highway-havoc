class NoiseGrid {
    points;
    offset = 0;

    constructor(rows, cols) {
        noise.seed(Math.random());
        this.points = new Array(rows);
        for(var row = 0; row < rows; row ++) {
            this.points[row] = new Array(cols);
            for(var col = 0; col < cols; col ++) {
                this.points[row][col] = noise.perlin2(row / 2, col / 2) * 2.5;
            }
        }
    }

    getPoint(row, col) {
        return this.points[row][col];
    }

    updatePoints() {
        this.offset += 0.025;
        for(var row = 0; row < this.points.length; row ++) {
            for(var col = 0; col < this.points[row].length; col ++) {
                this.points[row][col] = noise.perlin2(row / 3, col / 3 + this.offset) * 3.5;
            }
        }
    }
}