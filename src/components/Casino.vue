<template>
  <div class="casino-container">
    <h1>🎰 Casino Game 🎰</h1>

    <!-- Mensajes de fin de juego -->
    <div v-if="juegoTerminado" class="mensaje-final">
      <div v-if="gano" class="mensaje-ganador">
        <p class="puntaje-final">Puntaje: {{ puntaje }}</p>
        <p class="felicitaciones">Felicitaciones has ganado un premio de $10.000,00</p>
      </div>
      <div v-else class="mensaje-perdedor">
        <p>Has utilizado tus 5 intentos</p>
        <p>El juego ha terminado, inténtalo nuevamente</p>
      </div>
      <button @click="nuevoJuego" class="btn-nuevo-juego">Nuevo Juego</button>
    </div>

    <!-- Juego activo -->
    <div v-else>
      <div class="info-juego">
        <p class="intentos">Intentos: {{ intentos }} / 5</p>
        <p class="puntaje">Puntaje: {{ puntaje }}</p>
      </div>

      <div class="slots-container">
        <SlotItem 
          v-for="(slot, index) in slots" 
          :key="index"
          :imagen="slot.imagen"
          :texto="slot.texto"
          :mostrarTexto="slot.mostrarTexto"
        />
      </div>

      <button 
        @click="jugar" 
        :disabled="isPlaying"
        class="btn-jugar"
      >
        {{ isPlaying ? 'Jugando...' : 'JUGAR' }}
      </button>

      <button @click="nuevoJuego" class="btn-nuevo-juego-secundario">
        Nuevo Juego
      </button>
    </div>
  </div>
</template>

<script>
import SlotItem from './SlotItem.vue';
import { consumirAPIFacada } from '../clients/YesNoClient.js';

export default {
  name: 'Casino',
  components: {
    SlotItem
  },
  data() {
    return {
      slots: [
        {
          imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
          texto: 'XXXXX',
          mostrarTexto: false
        },
        {
          imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg',
          texto: 'XXXXX',
          mostrarTexto: false
        },
        {
          imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/3.svg',
          texto: 'XXXXX',
          mostrarTexto: false
        }
      ],
      intentos: 0,
      puntaje: 0,
      isPlaying: false,
      juegoTerminado: false,
      gano: false
    }
  },
  methods: {
    async jugar() {
      if (this.intentos >= 5 || this.juegoTerminado) return;

      this.isPlaying = true;
      this.intentos++;

      try {
        // Consumir API 3 veces (una por cada slot)
        const promesas = [
          consumirAPIFacada(),
          consumirAPIFacada(),
          consumirAPIFacada()
        ];

        const resultados = await Promise.all(promesas);

        // Actualizar cada slot con su resultado
        resultados.forEach((resultado, index) => {
          this.slots[index].imagen = resultado.image;
          this.slots[index].texto = resultado.answer;
          this.slots[index].mostrarTexto = true;
        });

        // Calcular puntaje
        this.calcularPuntaje(resultados);

        // Verificar si terminó el juego
        if (this.puntaje >= 10) {
          this.juegoTerminado = true;
          this.gano = true;
        } else if (this.intentos >= 5) {
          this.juegoTerminado = true;
          this.gano = false;
        }

      } catch (error) {
        console.error('Error al consumir API:', error);
        alert('Error al contactar con el servidor');
      } finally {
        this.isPlaying = false;
      }
    },

    calcularPuntaje(resultados) {
      const yesCount = resultados.filter(r => r.answer === 'yes').length;

      switch(yesCount) {
        case 3:
          this.puntaje += 5;
          break;
        case 2:
          this.puntaje += 2;
          break;
        case 1:
          this.puntaje += 1;
          break;
        default:
          this.puntaje += 0;
      }
    },

    nuevoJuego() {
      this.slots = [
        {
          imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
          texto: 'XXXXX',
          mostrarTexto: false
        },
        {
          imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg',
          texto: 'XXXXX',
          mostrarTexto: false
        },
        {
          imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/3.svg',
          texto: 'XXXXX',
          mostrarTexto: false
        }
      ];
      this.intentos = 0;
      this.puntaje = 0;
      this.juegoTerminado = false;
      this.gano = false;
      this.isPlaying = false;
    }
  }
}
</script>

<style scoped>
.casino-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

h1 {
  color: #FFD700;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
  font-size: 3em;
  margin-bottom: 30px;
}

.info-juego {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.intentos, .puntaje {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.slots-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn-jugar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 20px 60px;
  font-size: 2em;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  margin: 10px;
}

.btn-jugar:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);
}

.btn-jugar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-nuevo-juego-secundario {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.3em;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  margin: 10px;
}

.btn-nuevo-juego-secundario:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
}

.mensaje-final {
  background: rgba(255, 255, 255, 0.95);
  padding: 50px;
  border-radius: 20px;
  margin-top: 50px;
}

.mensaje-ganador p {
  color: #0066cc;
  font-size: 2em;
  font-weight: bold;
  margin: 20px 0;
}

.mensaje-ganador .felicitaciones {
  font-size: 2.5em;
}

.mensaje-perdedor p {
  color: #cc0000;
  font-size: 2em;
  font-weight: bold;
  margin: 20px 0;
}

.btn-nuevo-juego {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 20px 50px;
  font-size: 1.8em;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  margin-top: 30px;
}

.btn-nuevo-juego:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .slots-container {
    flex-direction: column;
    align-items: center;
  }
  
  h1 {
    font-size: 2em;
  }
  
  .btn-jugar {
    padding: 15px 40px;
    font-size: 1.5em;
  }
}
</style>