<template>
    <div id="drawingCanvas">
        <canvas id="canvas" class="canvas" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @mouseleave="mouseLeave" width="600" height="600"></canvas>
    </div>
    <button @click="clearCanvas" class="btn">Clear</button>
    <shapes />
    <fontsSelector />
</template>

<script>
import { fabric } from "fabric-with-erasing";
import shapes from "./shapes.vue";
import fontsSelector from "./fontsSelector.vue";

export default {
    name: "drawingCanvas",
    components: {
        shapes,
        fontsSelector
    },
    data() {
        return {
            canvas: null,
            history: [],
            redoHistory: [],
            layers: [],
            currentStrokeWidth: 5,
            currentFillColor: '#FF0000',
            currentStrokeColor: '#000000',
            isPanning: false,
            lastPosX: 0,
            lastPosY: 0,
            canvasData: null,
            drawingMode: false,
            eraserMode: false,
            text: null,
            fontSize: 20
        }
    },
    mounted() {
        this.initCanvas();
        this.canvas.on('object:moving', this.saveCanvasState);
    },
    methods: {
        initCanvas() {
            this.canvas = new fabric.Canvas('canvas');
            this.canvas.setBackgroundColor('white', this.canvas.renderAll.bind(this.canvas));

            this.canvas.selection = true;

            this.canvasData = localStorage.getItem('canvasData');

            if (this.canvasData) {
                this.canvas.loadFromJSON(this.canvasData, this.canvas.renderAll.bind(this.canvas));
            }
        },
        mouseDown(e) {
            console.log('mousedown');
        },
        mouseMove(e) {
            // Save canvas state when objects are moved
            // if (this.canvas.getActiveObjects().length > 0) {
            //     this.saveCanvasState();
            // }
            console.log('mousemove');
        },
        mouseUp(e) {
            console.log('mouseup');
        },
        mouseLeave(e) {
            console.log('mouseleave');
        },
        wheel(e) {
            console.log('wheel');
        },
        contextMenu(e) {
            console.log('contextMenu');
        },
        touchStart(e) {
            console.log('touchStart');
        },
        touchMove(e) {
            // Save canvas state when objects are moved
            // if (this.canvas.getActiveObjects().length > 0) {
            //     this.saveCanvasState();
            // }
            console.log('touchMove');
        },
        touchEnd(e) {
            console.log('touchEnd');
        },
        touchCancel(e) {
            console.log('touchCancel');
        },
        selectTool(tool) {
            this.canvas.isDrawingMode = false;
            this.drawingMode = false;
            this.eraserMode = false;

            console.log("Selected Tool :", tool);

            switch (tool) {
                case 'rect':
                    this.addRect();
                    break;
                case 'circle':
                    this.addCircle();
                    break;
                case 'triangle':
                    this.addTriangle();
                    break;
                case 'line':
                    this.addLine();
                    break;
                case 'ellipse':
                    this.addEllipse();
                    break;
                case 'polygon':
                    this.addPolygon();
                    break;
                case 'polyline':
                    this.addPolyline();
                    break;
                default:
                    break;
            }
        },

        clearCanvas() {
            this.canvas.clear();
            this.canvas.setBackgroundColor('white', this.canvas.renderAll.bind(this.canvas));
            this.saveCanvasState();
        },

        addRect() {
            let rect = new fabric.Rect({
                left: 100,
                top: 100,
                width: 50,
                height: 50,
                fill: this.currentFillColor,
                strokeWidth: this.currentStrokeWidth,
                stroke: this.currentStrokeColor,
            })
            this.canvas.add(rect);
            this.saveCanvasState();
        },

        addCircle() {
            let circle = new fabric.Circle({
                left: 100,
                top: 100,
                radius: 25,
                fill: this.currentFillColor,
                strokeWidth: this.currentStrokeWidth,
                stroke: this.currentStrokeColor,
            })
            this.canvas.add(circle);
            this.saveCanvasState();
        },

        addTriangle() {
            let triangle = new fabric.Triangle({
                left: 100,
                top: 100,
                width: 50,
                height: 50,
                fill: this.currentFillColor,
                strokeWidth: this.currentStrokeWidth,
                stroke: this.currentStrokeColor,
            })
            this.canvas.add(triangle);
            this.saveCanvasState();
        },

        addLine() {
            this.showFeedback("Line added successfully!");
        },

        addEllipse() {
            let ellipse = new fabric.Ellipse({
                left: 100,
                top: 100,
                rx: 50,
                ry: 25,
                fill: this.currentFillColor,
                strokeWidth: this.currentStrokeWidth,
                stroke: this.currentStrokeColor,
            })
            this.canvas.add(ellipse);
            this.saveCanvasState();
        },

        addPolygon() {
            let polygon = new fabric.Polygon([
                { x: 100, y: 100 },
                { x: 200, y: 100 },
                { x: 200, y: 200 },
                { x: 100, y: 200 },
            ], {
                fill: this.currentFillColor,
                strokeWidth: this.currentStrokeWidth,
                stroke: this.currentStrokeColor,
            }
            )
            this.canvas.add(polygon);
            this.saveCanvasState();
        },

        addPolyline() {
            let polyline = new fabric.Polyline([
                { x: 100, y: 100 },
                { x: 200, y: 100 },
                { x: 200, y: 200 },
                { x: 100, y: 200 },
            ], {
                fill: this.currentFillColor,
                strokeWidth: this.currentStrokeWidth,
                stroke: this.currentStrokeColor,
            }
            )
            this.canvas.add(polyline);
            this.saveCanvasState();
        },

        changeStrokeWidth(event) {
            const strokeWidth = parseInt(event.target.value);
            console.log("Stroke Width : ", strokeWidth);
            this.currentStrokeWidth = strokeWidth;
            let activeObject = this.canvas.getActiveObject();

            if (activeObject) {
                activeObject.set('strokeWidth', strokeWidth);
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a object to apply styling.");
            }
        },

        changeFillColor(event) {
            const newColor = event.target.value;
            this.currentFillColor = newColor;
            let activeObject = this.canvas.getActiveObject();

            if (activeObject) {
                activeObject.set('fill', newColor);
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a object to apply styling.");
            }
        },

        changeStrokeColor(event) {
            const newColor = event.target.value;
            this.currentStrokeColor = newColor;
            console.log("Stroke Color : ", newColor);
            let activeObject = this.canvas.getActiveObject();

            if (activeObject) {
                activeObject.set('stroke', newColor);
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a object to apply styling.");
            }
        },

        addText() {
            if (this.text != null) {
                let newText = new fabric.Textbox(this.text, {
                    left: 100,
                    top: 100,
                    fontSize: this.fontSize,
                    fill: this.currentFillColor,
                    strokeWidth: this.currentStrokeWidth,
                    stroke: this.currentStrokeColor,
                })
                this.canvas.add(newText);
                this.saveCanvasState();   
                this.showFeedback("Text added successfully!");
            } else {
                this.showFeedback("Please enter text to add.");
            }
        },

        changeFontSize(event) {
            const newFontSize = event.target.value;
            this.fontSize = newFontSize;
            let activeObject = this.canvas.getActiveObject();

            if (activeObject && activeObject.type === 'textbox') {
                activeObject.set('fontSize', newFontSize);
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a text object to apply styling.");
            }
        },

        setFontFamily(event) {
            const fontFamily = event.target.value;
            let activeObject = this.canvas.getActiveObject();

            if (activeObject && activeObject.type === 'textbox') {
                activeObject.set('fontFamily', fontFamily);
                this.canvas.renderAll(); // Re-render the canvas to reflect changes
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a text object to apply styling.");
            }
        },

        toggleBold() {
            let activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.type === 'textbox') {
                activeObject.set('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold');
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a text object to apply styling.");
            }
        },

        toggleItalic() {
            let activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.type === 'textbox') {
                activeObject.set('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic');
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a text object to apply styling.");
            }
        },

        toggleUnderline() {
            let activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.type === 'textbox') {
                activeObject.set('underline', !activeObject.underline);
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a text object to apply styling.");
            }
        },

        toggleStrikeThrough() {
            let activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.type === 'textbox') {
                activeObject.set('linethrough', !activeObject.linethrough);
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a text object to apply styling.");
            }
        },

        toggleOverline() {
            let activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.type === 'textbox') {
                activeObject.set('overline', !activeObject.overline);
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a text object to apply styling.");
            }
        },

        textAlign(align) {
            let activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.type === 'textbox') {
                activeObject.set('textAlign', align);
                this.canvas.renderAll();
                this.saveCanvasState();
            } else {
                this.showFeedback("Select a text object to apply styling.");
            }
        },

        saveCanvasState() {
            try {
                const currentState = JSON.stringify(this.canvas.toJSON());
                this.history.push(currentState);
                console.log("history", this.history);
                this.history.splice(0, this.history.length - 10); // Limit history to 10 states
                
                // Show feedback
                this.showFeedback("Canvas state saved successfully!");

                // Store the JSON in local storage
                localStorage.setItem('canvasData', currentState);
            } catch (error) {
                console.error("Error while saving canvas state:", error);
                alert("An error occurred while saving the canvas state.");
            }
        },

        showFeedback(message) {
            console.log(message);
        },
    }
}
</script>