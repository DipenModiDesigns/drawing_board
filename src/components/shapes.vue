<template>
    <div>
        <h1>Shapes</h1>
        <button @click="this.$parent.selectTool('rect')" class="btn">Rectangle</button>
        <button @click="this.$parent.selectTool('circle')" class="btn">Circle</button>
        <button @click="this.$parent.selectTool('triangle')" class="btn">Triangle</button>
        <button @click="this.$parent.selectTool('line')" class="btn">Line</button>
        <button @click="this.$parent.selectTool('ellipse')" class="btn">Ellipse</button>
        <button @click="this.$parent.selectTool('polygon')" class="btn">Polygon</button>
        <button @click="this.$parent.selectTool('polyline')" class="btn">Polyline</button>

        
        <label for="strokeWidth">Stroke Width:</label>
        <input type="range" @change="this.$parent.changeStrokeWidth" v-model="this.$parent.currentStrokeWidth" id="strokeWidth" min="1" max="20" value="5">
        <label for="fillColor">Fill Color:</label>
        <input type="color" @change="this.$parent.changeFillColor" v-model="this.$parent.currentFillColor" id="fillColor" value="#FF0000">
        <label for="strokeColor">Stroke Color:</label>
        <input type="color" @change="this.$parent.changeStrokeColor" v-model="this.$parent.currentStrokeColor" id="strokeColor" value="#000000">
    </div>
</template>

<script>
export default {
    name: "shapes",
}
</script>