class jsplot {

	constructor(divId){
		this.divId = divId;
	}

	plot() {	
	var plot = c3.generate({
		bindto: "#" + this.divId,
                data: {
                        x: 'x',
                        columns: [
                                ['x', 30, 50, 100, 230, 300, 310],
                                ['y', 30, 200, 100, 400, 150, 250]
                        ]
                        }
                });
	}

	setPlotSize(width, length) {
	}

	setAxisFont(family, style, size){
	}

	setScales(type){
	}

	setGridOn(){
	}


}

var myjsplot = new jsplot("myDiv");
