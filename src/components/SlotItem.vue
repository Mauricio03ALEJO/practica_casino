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
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: 200px;
  transition: transform 0.3s;
}

.slot-item:hover {
  transform: scale(1.05);
}

.imagen-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slot-imagen {
  max-width: 120px;
  max-height: 120px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.texto-container {
  background: #2c3e50;
  padding: 15px;
  border-radius: 8px;
}

.slot-texto {
  color: white;
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}
</style>