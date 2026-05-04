import type { Channel, ConsumeMessage } from "amqplib";
import { vehicleService } from "../../servicrs/vehicleService";

export async function vehicleRpc(channel: Channel) {
  channel.consume(
    "vehicle.queue",
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;
      console.log("got message");

      const data = JSON.parse(msg.content.toString());
      const eventType = msg.fields.routingKey;

      switch (eventType) {
        case "vehicle.get":
          console.log("here in rpc", data);

          //   await vehicleService.createVehicle({
          //     user_id: data.id,
          //     model: "Unknown",
          //     year: null,
          //     make: "Unknown",
          //   });

          break;

        default:
          console.log("Unknown event:", eventType);
      }

      channel.ack(msg);
    },
    { noAck: false },
  );
}
