class jsplot {

	constructor(CanvasId){ //Stores the canvas and drawing context:
		this.CanvasId = CanvasId;
		this.canvas = document.getElementById(this.CanvasId);
		this.ctx = this.canvas.getContext("2d");
	}

	setXData(XData){
		this.xData = xData;
	}

	setYData(YData){
		this.yData = yData;
	}

	plot(){ 	
		//Draw the axis lines (use 10% of the width and height for the axes and labels):
		this.ctx.moveTo(0.1*this.width, 0.9*this.height);
		this.ctx.lineTo(this.width, 0.9*this.height);
		this.ctx.stroke();
	
		this.ctx.moveTo(0.1*this.width, 0);
                this.ctx.lineTo(0.1*this.width, 0.9*this.height);
                this.ctx.stroke();

		var xSpacing = 2.0*this.findTicks(this.xData, 1.0, this.width); //How many pixels to space the x axis ticks by
		var xLength = this.getLength(this.xData);
		//Draw the ticks on x axis:
		var w = 0.1*this.width;
		while(w <= this.width ) {
			this.ctx.moveTo(w, 0.9*this.height);
			this.ctx.lineTo(w, 0.95*this.height); //Ticks are 5% of the height of the canvas in length
			this.ctx.stroke();
			this.ctx.fillText((w - 0.1*this.width)*xLength/(this.width*0.9), w, this.height);
			w = w + xSpacing;
		}

		//Same for y axis:
		var ySpacing = 2.0*this.findTicks(this.yData, 1.0, this.height);
		var yLength = this.getLength(this.yData);
		var h = 0.1*this.height;
                while(h <= this.height) {
                        this.ctx.moveTo(0.05*this.width, this.height - h);
                        this.ctx.lineTo(0.1*this.width, this.height - h); //Similarly, ticks are 5% of the canvas width in length
                        this.ctx.stroke();
			this.ctx.fillText((h - 0.1*this.height)*yLength/(this.height*0.9), 0, this.height - h);
                        h = h + ySpacing;
                }

		//Plot data points:
		var lastX = 0.1*this.width + (this.xData[0]/xLength)*0.9*this.width; //Last x coordinate (set to 1st data point coordinate initially)
		var lastY = 0.9*this.height - (this.yData[0]/yLength)*0.9*this.height;
		for (var i = 0; i < this.xData.length; i++){
			//Draw the point:
			var x = 0.1*this.width + (this.xData[i]/xLength)*0.9*this.width;
			var y = 0.9*this.height - (this.yData[i]/yLength)*0.9*this.height;
			this.drawPoint(x, y);

			this.ctx.fillText(xData[i].toString() + "," + yData[i].toString(), x, y);
			//Draw straight lines between this and last point:
			this.ctx.moveTo(lastX, lastY);
			this.ctx.lineTo(x, y);
			this.ctx.stroke();
			lastX = x;
			lastY = y;
		}
	
	}

	order(value){ //Utility to find the order of magnitude of value
		var log = Math.log10(Math.abs(value));
		if (log >= 0.0) {
			log = Math.sign(value)*Math.floor(log);
		} else {
			Math.sign(value)*Math.floor(log - 1.0);
		}
		return Math.pow(10.0, log);
	}

	getLength(data){ //Utility to find the length of an array (biggest value - smallest value)
		var max = data.reduce(function(a, b) {
                        return Math.max(a, b);
                });

                var min = data.reduce(function(a, b) {
                        return Math.min(a, b);
                });

                var length = max - min;
		return length;
	}

	findTicks(data, charMeasure, size){ //Calculate the tick spacing for an axis of size pixels given data and character size (charMeasure) (Needs to be reviewed and corrected)

		var length = this.getLength(data);

                var dw = this.order(size*0.9)/2.0;
                while(Math.abs(size*0.9/dw) < 6.0) {
                        dw = dw/10.0;
                }

                var i = 0;
                while(Math.abs(length*2.0*dw/(0.9*size)) < charMeasure) {
                        if (i == 1) {
                                dw = dw*2.5;
                        } else {
                                dw = dw*2.0;
                        }
                        i = i + 1;
                        if (i > 2) {
                                i = 0;
                        }
                }

		return dw; 

	}

	drawPoint(x, y){ //Draw a circular point of radius 3 at (x,y) 
		this.ctx.beginPath();
		this.ctx.arc(x, y, 3, 0, 2*Math.PI);
		this.ctx.fill();
	}

	setPlotSize(width, height) { //Set size of plotting region in pixels (including axes)
		this.width = width;
		this.height = height;
	}

	setXLabel(xLabel){
		this.ctx.fillText(xLabel, 0.55*this.width, this.height); //Position label half way along plotting area
	}

	setYLabel(yLabel){ //Rotating text is surprisingly non-trivial so this does not work yet:
		this.ctx.save();
		this.ctx.translate(this.canvas.width - 1, 0);
		this.ctx.rotate(3* Math.PI/2);
		this.ctx.fillText(yLabel, 0, 0);
		this.ctx.restore();
	}

}

//Simple JavaScript to test the class:
var myjsplot = new jsplot("myCanvas");
myjsplot.setPlotSize(500, 500);
var xData = [1,2,3,4];
var yData = [1,2,3,4];
myjsplot.setXData(xData);
myjsplot.setYData(yData);
myjsplot.plot();
myjsplot.setXLabel("X Axis");
myjsplot.setYLabel("Y Axis");
