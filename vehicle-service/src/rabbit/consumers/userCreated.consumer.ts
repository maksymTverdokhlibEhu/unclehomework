import type { Channel, ConsumeMessage } from "amqplib";
import { vehicleService } from "../../servicrs/vehicleService";

type UserCreatedEvent = {
  id: string;
  email: string;
};

export async function userConsumer(channel: Channel) {
  channel.consume(
    "vehicle.queue",
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString()) as UserCreatedEvent;
      const eventType = msg.fields.routingKey;

      switch (eventType) {
        case "user.created":
          console.log("here", data);

          await vehicleService.createVehicle({
            user_id: data.id,
            model: "Unknown",
            year: null,
            make: "Unknown",
          });

          channel.ack(msg);
          break;

        case "vehicle.get":
          try {
            console.log("here in rpc", data, msg.properties);
            const vehicles = await vehicleService.findManyByUserId(data.id);
            channel.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(JSON.stringify(vehicles)),
              {
                correlationId: msg.properties.correlationId,
              },
            );
            channel.ack(msg);
          } catch (error) {
            channel.nack(msg);
          }

          break;

        default:
          console.log("Unknown event:", eventType, data);
      }
    },
    { noAck: false },
  );
}
