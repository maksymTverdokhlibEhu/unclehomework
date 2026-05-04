import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";

export async function makeRequest(message, connection, channel, event) {
  const { queue: replyQueue } = await channel.assertQueue("", {
    exclusive: true,
  });
  const correlationId = uuidv4();

  return new Promise((resolve) => {
    channel.consume(
      replyQueue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
      
          resolve(msg.content.toString());
        }
      },
      { noAck: true },
    );

    console.log(" [x] Отправляем запрос:", message);

    channel.publish("user.events", event, Buffer.from(message), {
      correlationId: correlationId,
      replyTo: replyQueue,
    });
  });
}
