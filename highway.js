class HighwayMesh {
    points = [];
    segmentLength = 1;
    segmentWidth = 3;
    offset = 2;
    onSegment = 0;
    height = -3;

    constructor() {
        var sectionPoints = [];

        sectionPoints.push(new MeshPoint(-this.segmentWidth, this.height, -this.segmentLength + this.offset));
        sectionPoints.push(new MeshPoint(this.segmentWidth, this.height, -this.segmentLength + this.offset));
        sectionPoints.push(new MeshPoint(this.segmentWidth, this.height, this.segmentLength + this.offset));
        sectionPoints.push(new MeshPoint(-this.segmentWidth, this.height, this.segmentLength + this.offset));

        this.points.push(sectionPoints);

        this.onSegment += this.segmentLength * 2;
    }

    addSection() {
        var sectionPoints = [];
        var previous = this.points[this.points.length - 1];

        sectionPoints.push(new MeshPoint(noise.perlin2(this.onSegment / 20, 5) * 4 - this.segmentWidth, this.height, previous[0].getPoint(2) - this.segmentLength * 2));
        sectionPoints.push(new MeshPoint(noise.perlin2(this.onSegment / 20, 5) * 4 + this.segmentWidth, this.height, previous[1].getPoint(2) - this.segmentLength * 2));
        sectionPoints.push(new MeshPoint(previous[1].getPoint(0), this.height, previous[2].getPoint(2) - this.segmentLength * 2));
        sectionPoints.push(new MeshPoint(previous[0].getPoint(0), this.height, previous[3].getPoint(2) - this.segmentLength * 2));
        sectionPoints.push(this.onSegment);

        this.points.push(sectionPoints);

        this.onSegment += this.segmentLength * 2;
    }

    checkDeletions(distance) {
        for (var i = this.points.length - 1; i >= 0; i--) {
            if (this.points[i][4] - distance < -2) {
                this.points.splice(i, 1);
                this.addSection();
            }
        }
    }

    update() {

    }

    getSection(value) {
        return this.points[value];
    }

    getSectionAmount() {
        return this.points.length;
    }
}

class MeshPoint {
    points = [];

    constructor(x, y, z) {
        this.points.push(x);
        this.points.push(y);
        this.points.push(z);
    }

    getPoint() {
        return this.points;
    }

    getPoint(value) {
        return this.points[value];
    }
}