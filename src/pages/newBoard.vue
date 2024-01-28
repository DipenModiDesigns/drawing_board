<template>
    <div>
        <h1>This is a new board</h1>
        <drawingCanva />
    </div>
</template>

<script>
import drawingCanva from '../components/drawingCanvas.vue';

export default {
    name: "newBoard",
    components: {
        drawingCanva
    }
}
</script>