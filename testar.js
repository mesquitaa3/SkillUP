import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 300,            // número de utilizadores simultâneos
  duration: '30s',    // duração total do teste
};

export default function () {
  http.get('http://localhost:3000');  // substitui aqui pela URL real
  sleep(1);  // espera entre cada iteração
}
