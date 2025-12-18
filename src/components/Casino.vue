<template>
  <div class="casino-container">
    <h1>Casino Game</h1>

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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

.info-juego {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
}

.intentos, .puntaje {
  display: inline-block;
  margin: 0 20px;
}

.slots-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn-jugar {
  padding: 10px 30px;
  font-size: 1.2em;
  cursor: pointer;
  margin: 5px;
}

.btn-jugar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mensaje-final {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
}

.mensaje-ganador p {
  color: #0066cc;
  margin: 10px 0;
}

.mensaje-perdedor p {
  color: #cc0000;
  margin: 10px 0;
}

.btn-nuevo-juego {
  padding: 10px 30px;
  font-size: 1.2em;
  cursor: pointer;
  margin-top: 15px;
}
</style>