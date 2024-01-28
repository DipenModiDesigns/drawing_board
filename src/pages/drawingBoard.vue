<template>
    <div class="container">
        <canvas id="myCanvas" ref="myCanvas" width="600" height="400" style="border: 1px solid black"></canvas>

        <button @click="selectTool('rect')" class="btn">Add Rectangle</button>
        <button @click="selectTool('circle')" class="btn">Add Circle</button>
        <button @click="addLine" class="btn" :class="this.drawingMode == true ? 'bg-primary-700' : '' ">Add
            Line</button>
        <button @click="addEraser" class="btn" :class="this.eraserMode == true ? 'bg-primary-700' : '' ">Eraser</button>
        <button @click="addTriangle" class="btn">Add Triangle</button>
        <button @click="addText" class="btn">Add Text</button>
        <button @click="clearCanvas" class="btn">Clear</button>
        <button @click="undo" class="btn">Undo</button>
        <button @click="redo" class="btn">Redo</button>

        <input type="file" name="image" id="addImage" @change="addImage">

        <select id="fontFamilySelector" class="btn" @change="setFontFamily">
            <option value="Times New Roman">Select Font</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
        </select>

        <label for="strokeWidth">Stroke Width:</label>
        <input type="range" @change="strokeWidth" id="strokeWidth" min="1" max="20" value="5">
        <label for="fillColor">Fill Color:</label>
        <input type="color" @change="fillColor" id="fillColor" value="#FF0000">
        <label for="strokeColor">Stroke Color:</label>
        <input type="color" @change="strokeColor" id="strokeColor" value="#000000">

        <button @click="zoom(1.2)" id="zoomInButton">Zoom In</button>
        <button @click="zoom(0.8)" id="zoomOutButton">Zoom Out</button>
        <button @click="groupObjects()" id="groupObjects">Group Objects</button>
        <button @click="ungroupObjects()" id="ungroupObjects">Ungroup Objects</button>
        <button @click="bringToFront()" id="bringToFront">Bring To Front</button>
        <button @click="sendToBack()" id="sendToBack">Send To Back</button>

        <button @click="toggleBold()" id="boldText">Bold</button>
        <button @click="toggleItalic()" id="italicText">Italic</button>
        <button @click="toggleUnderline()" id="underlineText">Underline</button>
        <button @click="textAlign('left')" id="textAlignLeft">Left Align</button>
        <button @click="textAlign('center')" id="textAlignCenter">Center Align</button>
        <button @click="textAlign('right')" id="textAlignRight">Right Align</button>


        <div id="allFiltes">
            <label for="filterType">Select Filter:</label>
            <select id="filterType" @change="applyFilter" class="btn">
                <option value="Grayscale">Grayscale</option>
                <option value="Sepia">Sepia</option>
                <option value="Invert">Invert</option>
                <!-- Add more filter options as needed -->
            </select>
            <button id="applyFilter">Apply Filter</button>
        </div>

        <button @click="resizeImage" id="resizeImage">Resize Image</button>
        <button @click="rotateImage" id="rotateImage">Rotate Image</button>
        <button @click="flipImage" id="flipImage">Flip Image</button>
    </div>
</template>

<script>
    // import fabric from '../fabric/fabric.js';
    import { fabric } from "fabric-with-erasing";
    // import EraserBrush from "node_modules/fabric/src/mixins/eraser_brush.mixin.js";

    export default {
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
            };
        },
        components: {
            fabric,
            // EraserBrush
        },
        mounted() {
            this.initCanvas();
        },
        methods: {
            initCanvas() {
                this.canvas = new fabric.Canvas(this.$refs.myCanvas);
                this.canvas.setBackgroundColor('white', this.canvas.renderAll.bind(this.canvas));
                this.canvas.selection = true;

                this.canvasData = localStorage.getItem('canvasData');

                if (this.canvasData) {
                    this.canvas.loadFromJSON(this.canvasData, this.canvas.renderAll.bind(this.canvas));
                }
            },

            selectTool(tool) {
                this.canvas.isDrawingMode = false;
                this.drawingMode = false;
                this.eraserMode = false;
                console.log("tool", tool);
                switch (tool) {
                    case 'rect':
                        this.addRect();
                        break;
                    case 'circle':
                        this.addCircle();
                        break;
                    default:
                        break;
                }
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
                });
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
                });
                this.canvas.add(circle);
                this.saveCanvasState();
            },

            addTriangle() {
                let triangle = new fabric.Triangle({
                    left: 100,
                    top: 100,
                    width: 100,
                    height: 100,
                    fill: this.currentFillColor,
                    strokeWidth: this.currentStrokeWidth,
                    stroke: this.currentStrokeColor,
                })
                this.canvas.add(triangle);
                this.saveCanvasState();
            },

            addLine() {
                this.drawingMode = !this.drawingMode;
                this.eraserMode = false;
                if (this.drawingMode == true) {
                    this.canvas.isDrawingMode = true;
                    this.canvas.freeDrawingBrush.width = this.currentStrokeWidth;
                    this.canvas.freeDrawingBrush.color = this.currentStrokeColor;
                } else {
                    this.canvas.isDrawingMode = false;
                }
                this.saveCanvasState();
            },

            addEraser() {
                this.eraserMode = !this.eraserMode;
                this.drawingMode = false;
                if (this.eraserMode == true) {
                    this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
                    this.canvas.isDrawingMode = true;
                    this.canvas.freeDrawingBrush.width = this.currentStrokeWidth; // Apply current stroke width
                } else {
                    this.canvas.isDrawingMode = false;
                }
                this.saveCanvasState();
            },

            addText() {
                let text = new fabric.Textbox("New Text", {
                    left: 100,
                    top: 100,
                    fontSize: 20,
                    fill: this.currentFillColor,
                });
                this.canvas.add(text);
                this.saveCanvasState();
            },

            setFontFamily(event) {
                const fontFamily = event.target.value;
                let activeObject = this.canvas.getActiveObject();

				if (activeObject && activeObject.type === 'textbox') {
					activeObject.set('fontFamily', fontFamily);
					this.canvas.renderAll(); // Re-render the canvas to reflect changes
					this.saveCanvasState();
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

            addImage(event) {
                const file = event.target.files[0];

                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        // Create a fabric.Image object with appropriate options
                        const image = new fabric.Image(img, {
                            width: img.width,
                            height: img.height,
                            left: this.canvas.getWidth() / 2 - img.width / 2,
                            top: this.canvas.getHeight() / 2 - img.height / 2,
                            // Consider adding other options for positioning, scaling, etc.
                        });

                        // Add the image to the canvas and trigger a re-render
                        this.canvas.add(image);
                        this.canvas.renderAll();

                        // Save the canvas state
                        this.saveCanvasState();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            },

            strokeWidth(e) {
                this.currentStrokeWidth = e.target.value;
                this.canvas.freeDrawingBrush.width = this.currentStrokeWidth;
                this.saveCanvasState();
            },

            fillColor(e) {
                this.currentFillColor = e.target.value;
                this.saveCanvasState();
            },

            strokeColor(e) {
                this.currentStrokeColor = e.target.value;
                this.saveCanvasState();
            },

            clearCanvas() {
                this.canvas.clear();
                this.saveCanvasState();
            },

            undo() {
                try {
                    if (this.history.length > 0) {
                        const currentState = JSON.stringify(this.canvas.toJSON());
                        this.redoHistory.push(currentState);

                        const previousState = this.history.pop();
                        this.canvas.loadFromJSON(previousState, this.canvas.renderAll.bind(this.canvas));

                        // Show feedback
                        this.showFeedback("Undo successful.");
                    } else {
                        // Show feedback
                        this.showFeedback("Nothing to undo.");
                    }
                } catch (error) {
                    console.error("Error while undoing:", error);
                    alert("An error occurred while undoing the previous action.");
                }
            },

            redo() {
                try {
                    if (this.redoHistory.length > 0) {
                        const currentState = JSON.stringify(this.canvas.toJSON());
                        this.history.push(currentState);

                        const nextState = this.redoHistory.pop();
                        this.canvas.loadFromJSON(nextState, this.canvas.renderAll.bind(this.canvas));

                        // Show feedback
                        this.showFeedback("Redo successful.");
                    } else {
                        // Show feedback
                        this.showFeedback("Nothing to redo.");
                    }
                } catch (error) {
                    console.error("Error while redoing:", error);
                    alert("An error occurred while redoing the previous action.");
                }
            },

            zoom(factor) {
                // Get the current zoom level
                let currentZoom = this.canvas.getZoom();
                this.canvas.zoomToPoint(new fabric.Point(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2), currentZoom * factor);
            },

            groupObjects() {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject) {
                    if (activeObject.type === 'activeSelection') {
                        const objects = activeObject.getObjects();
                        const group = new fabric.ActiveSelection(objects, {
                            left: activeObject.left,
                            top: activeObject.top,
                        })
                        this.canvas.discardActiveObject();
                        this.canvas.add(group);
                        this.saveCanvasState(); // Save group state for undo/redo
                    } else {
                        // Show feedback
                        this.showFeedback("Select an object to group.");
                    }
                } else {
                    // Show feedback
                    this.showFeedback("Select an object to group.");
                }
            },

            ungroupObjects() {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject && activeObject.type === 'group') {
                    const objectsInGroup = activeObject.getObjects();
                    this.canvas.discardActiveObject();
                    objectsInGroup.forEach(obj => {
                        this.canvas.add(obj);
                    })
                    this.canvas.remove(activeObject);
                    this.saveCanvasState(); // Save the state after ungrouping
                } else {
                    // Show feedback
                    this.showFeedback("Select a group to ungroup.");
                }
            },

            bringToFront() {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject) {
                    this.canvas.bringToFront(activeObject);
                    this.saveCanvasState(); // Save the state after bringing to front
                } else {
                    // Show feedback
                    this.showFeedback("Select an object to bring to front.");
                }
            },

            sendToBack() {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject) {
                    this.canvas.sendToBack(activeObject);
                    this.saveCanvasState(); // Save the state after sending to back
                } else {
                    // Show feedback
                    this.showFeedback("Select an object to send to back.");
                }
            },

            flipImage() {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject && activeObject.type === 'image') {
                    activeObject.flipX = !activeObject.flipX;
                    activeObject.flipY = !activeObject.flipY;
                    this.canvas.renderAll();
                    this.saveCanvasState(); // Save the state after flipping image
                } else {
                    // Show feedback
                    this.showFeedback("Select an image to flip.");
                }
            },

            applyFilter(filterName) {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject && activeObject.type === 'image') {
                    console.log("filterName", filterName.target.value);
                    activeObject.filters.push(new fabric.Image.filters[filterName.target.value]());
                    activeObject.applyFilters();
                    this.canvas.renderAll();
                    this.saveCanvasState(); // Save the state after applying filter
                } else {
                    // Show feedback
                    this.showFeedback("Select an object to apply a filter.");
                }
            },

            rotateImage() {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject && activeObject.type === 'image') {
                    activeObject.angle += 90;
                    this.canvas.renderAll();
                    this.saveCanvasState(); // Save the state after rotating image
                } else {
                    // Show feedback
                    this.showFeedback("Select an image to rotate.");
                }
            },

            copy() {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject) {
                    this.copiedObjects = [fabric.util.object.clone(activeObject)];
                    // Show feedback
                    this.showFeedback("Object copied.");
                } else {
                    // Show feedback
                    this.showFeedback("Select an object to copy.");
                }
            },

            paste() {
                if (this.copiedObjects.length > 0) {
                    let clonedObjects = this.copiedObjects.map(obj => fabric.util.object.clone(obj));
                    clonedObjects.forEach(obj => {
                        this.canvas.add(obj);
                    })
                    this.canvas.discardActiveObject();
                    this.saveCanvasState(); // Save the state after deleting
                } else {
                    // Show feedback
                    this.showFeedback("Nothing to paste.");
                }
            },

            deleteObject() {
                const activeObject = this.canvas.getActiveObject();
                if (activeObject) {
                    this.canvas.remove(activeObject);
                    this.saveCanvasState(); // Save the state after deleting
                } else {
                    // Show feedback
                    this.showFeedback("Select an object to delete.");
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
    };
</script>