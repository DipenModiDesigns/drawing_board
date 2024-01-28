<template>
    <div>
        <h1>Fonts</h1>

        <input type="text" name="text" id="text" placeholder="text" v-model="this.$parent.text" class="text-black">
        <button @click="this.$parent.addText" class="btn">Add Text</button>

        <label for="fontSizeSelector">
            Font Size:
            <input type="range" @change="this.$parent.changeFontSize" v-model="this.$parent.fontSize" id="fontSizeSelector" min="1" max="100" value="20">
        </label>

        <select id="fontFamilySelector" class="btn" @change="this.$parent.setFontFamily">
            <option value="Times New Roman">Select Font</option>
            <option value="Arial" style="font-family: Arial;">Arial</option>
            <option value="Times New Roman" style="font-family: Times New Roman;">Times New Roman</option>
            <option value="Verdana" style="font-family: Verdana;">Verdana</option>
            <option value="Courier New" style="font-family: Courier New;">Courier New</option>
            <option value="Comic Sans MS" style="font-family: Comic Sans MS;">Comic Sans MS</option>
            <option value="Impact" style="font-family: Impact;">Impact</option>
            <option value="Georgia" style="font-family: Georgia;">Georgia</option>
            <option value="Palatino Linotype" style="font-family: Palatino Linotype;">Palatino Linotype</option>
            <option value="Trebuchet MS" style="font-family: Trebuchet MS;">Trebuchet MS</option>
            <option value="Garamond" style="font-family: Garamond;">Garamond</option>
            <option value="Bookman" style="font-family: Bookman;">Bookman</option>
            <option value="Brush Script MT" style="font-family: Brush Script MT;">Brush Script MT</option>
            <option value="Lucida Console" style="font-family: Lucida Console;">Lucida Console</option>
            <option value="Cursive" style="font-family: Cursive;">Cursive</option>
        </select>

        <div>
            <button @click="this.$parent.toggleBold()" id="boldText" class="btn">Bold</button>
            <button @click="this.$parent.toggleItalic()" id="italicText" class="btn">Italic</button>
            <button @click="this.$parent.toggleUnderline()" id="underlineText" class="btn">Underline</button>
            <button @click="this.$parent.toggleStrikeThrough()" id="strikeThroughText" class="btn">Strike Through</button>
            <button @click="this.$parent.toggleOverline()" id="overlineText" class="btn">Overline</button>
        </div>
        <div>
            <button @click="this.$parent.textAlign('left')" id="textAlignLeft" class="btn">Left Align</button>
            <button @click="this.$parent.textAlign('center')" id="textAlignCenter" class="btn">Center Align</button>
            <button @click="this.$parent.textAlign('right')" id="textAlignRight" class="btn">Right Align</button>
            <button @click="this.$parent.textAlign('justify')" id="textAlignJustify" class="btn">Justify</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "fontsSelector",
}
</script>