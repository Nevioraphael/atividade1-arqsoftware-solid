
class Logger {
  info(message) {
    console.log(`[INFO] ${new Date().toLocaleString("pt-BR")} - ${message}`);
  }

  warn(message) {
    console.warn(`[AVISO] ${new Date().toLocaleString("pt-BR")} - ${message}`);
  }

  error(message) {
    console.error(`[ERRO] ${new Date().toLocaleString("pt-BR")} - ${message}`);
  }
}

module.exports = Logger;
