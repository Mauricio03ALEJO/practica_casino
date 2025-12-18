<template>
  <div class="slot-item">
    <div class="imagen-container">
      <img :src="imagen" :alt="texto" class="slot-imagen" />
    </div>
    <div class="texto-container">
      <p class="slot-texto">{{ mostrarTexto ? texto : 'XXXXX' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlotItem',
  props: {
    imagen: {
      type: String,
      required: true
    },
    texto: {
      type: String,
      required: true
    },
    mostrarTexto: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.slot-item {
  border: 1px solid #ccc;
  padding: 10px;
  background: white;
}

.imagen-container {
  padding: 10px;
  text-align: center;
}

.slot-imagen {
  width: 80px;
  height: 80px;
}

.texto-container {
  padding: 5px;
  text-align: center;
}

.slot-texto {
  margin: 0;
  font-weight: bold;
}
</style>