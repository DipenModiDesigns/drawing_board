<template>
    <toast v-bind:notFoundError="notFoundError" v-if="notFoundError != null" />
    <section class="">
        <div class="container xl:max-w-screen-2xl">
            <h1 class="text-[30px] mb-5">Here you can create and manage To-Do</h1>
            <div class="componentCover flex items-start gap-5">
                <div class="toolBox grid grid-cols-2 gap-1">
                    <button class="btn tool" @click="selectTool('draw')">draw</button>
                    <button class="btn tool" @click="selectTool('text')">text</button>
                    <button class="btn tool" @click="selectTool('image')">image</button>
                    <button class="btn tool" @click="selectTool('rectangle')">rectangle</button>
                    <button class="btn tool" @click="selectTool('circle')">circle</button>
                    <button class="btn tool" @click="selectTool('triangle')">triangle</button>
                    <button class="btn tool" @click="selectTool('line')">line</button>
                    <button class="btn tool" @click="undo()">undo</button>
                    <button class="btn tool" @click="redo()">redo</button>
                    <button class="btn tool" @click="clearCanvas()">clear</button>
                    <button class="btn tool" @click="saveCanvas()">save</button>
                    <button class="btn tool" @click="loadCanvas()">load</button>
                    <button class="btn tool" @click="downloadCanvas()">download</button>
                </div>
                <div class="canvasCover">
                    <canvas ref="canvas" id="canvas" class="canvas" @mousedown="mouseDown" @mousemove="mouseMove"
                        @mouseup="mouseUp" @mouseleave="mouseLeave" @touchstart="touchStart" @touchmove="touchMove"
                        @touchend="touchEnd" @touchcancel="touchCancel" @contextmenu="contextMenu" @wheel="wheel"
                        width="600" height="600" style="border: 1px solid black; background-color: white;"></canvas>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    import toast from "../components/toast.vue";
    import { fabric } from 'fabric';

    export default {
        components: {
            toast,
        },
        data() {
            return {
                notFoundError: null,
                fabricCanvas: null,
                currentTool: '',
                isDrawing: false,
                currentLine: null,
                history: [],
                future: [],
            };
        },
        created() {
            document.title = "Drawing Board";
        },
        mounted() {
            this.$nextTick(() => {
                // Access the canvas element using the ref
                const canvas = this.$refs.canvas;
                this.fabricCanvas = new fabric.Canvas(canvas);
            });
        },
        methods: {
            selectTool(tool) {
                this.currentTool = tool;
                console.log(tool); // Optional for debugging
            },
            mouseDown(event) {
                if (this.currentTool === "draw") {
                    this.isDrawing = true;
                    const pointer = this.fabricCanvas.getPointer(event);
                    this.currentLine = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                        stroke: 'black',
                        strokeWidth: 5,
                    });
                    this.fabricCanvas.add(this.currentLine);
                }
            },
            mouseMove(event) {
                if (this.isDrawing && this.currentLine) {
                    const pointer = this.fabricCanvas.getPointer(event);
                    this.currentLine.set({ x2: pointer.x, y2: pointer.y });
                    this.fabricCanvas.renderAll();
                }
            },
            mouseUp() {
                this.isDrawing = false;
                this.currentLine = null;
            },
            mouseLeave() {
                this.isDrawing = false;
            },
            clearCanvas() {
                this.fabricCanvas.clear();
            },
            undo() {
                console.log("undo");
                // Implement undo functionality
            },
            redo() {
                console.log("redo");
                // Implement redo functionality
            },
        },
    };
</script>