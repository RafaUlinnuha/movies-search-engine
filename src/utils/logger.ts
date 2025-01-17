import pino from "pino";
import PinoPretty from "pino-pretty";

const stream = PinoPretty({
  colorize: true,
});

const logger = pino(stream);

export default logger;
