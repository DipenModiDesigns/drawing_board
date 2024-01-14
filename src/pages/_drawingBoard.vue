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
    import Actions from "../store/actions.js";

    export default {
        // name: "TodoItems",
        data() {
            return {
                notFoundError: null,
                history: [],
                future: [],
            };
        },
        components: {
            toast,
        },
        created() {
            document.title = "Drawing Board";
        },
        mounted() { },
        watch: {},
        methods: {
            selectTool(tool) {
                // Ensure canvas is available
                if (this.$refs.canvas) {
                    this.$refs.canvas.tool = tool;
                    console.log(tool); // Optional for debugging
                } else {
                    console.error("Canvas not found."); // Handle the error
                }
            },
            mouseDown(event) {
                if (this.$refs.canvas.tool === "draw") {
                    // Get canvas context
                    const ctx = this.$refs.canvas.getContext("2d");
                    // console.log(ctx);

                    // Get mouse coordinates relative to canvas
                    const rect = this.$refs.canvas.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    // Start a new path
                    ctx.beginPath();

                    // Set initial point
                    ctx.moveTo(x, y);

                    // Track mouse position for continuous drawing
                    this.isDrawing = true;
                }
            },
            mouseMove(event) {
                if (this.isDrawing) {
                    // Get canvas context
                    const ctx = this.$refs.canvas.getContext("2d");

                    // Get mouse coordinates relative to canvas
                    const rect = this.$refs.canvas.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    // Continue the path to the current mouse position
                    ctx.lineTo(x, y);

                    // Stroke the path to visualize the drawing
                    ctx.stroke();
                    const action = this.createAction("draw", { x1: x, y1: y, x2: x, y2: y });
                    this.history.push(action);
                    this.future = [];
                    // action.replay(ctx);
                }
            },
            mouseUp() {
                if (this.isDrawing) {
                    // Stop drawing
                    this.isDrawing = false;
                }
            },
            mouseLeave() {
                if (this.isDrawing) {
                    // Stop drawing
                    this.isDrawing = false;
                }
            },

            clearCanvas() {
                // Get canvas context
                const ctx = this.$refs.canvas.getContext("2d");
                ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
            },
            undo() {
                console.log("undo");
            },

            redo() {
                console.log("redo");
            },



        },
    };
</script>