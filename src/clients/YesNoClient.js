import axios from 'axios';

const consumirAPI = async() => {
    const respuesta = axios.get('https://yesno.wtf/api').then(res => res.data);
    console.log(respuesta);
    return respuesta;
}

export async function consumirAPIFacada() {
    return consumirAPI();
}