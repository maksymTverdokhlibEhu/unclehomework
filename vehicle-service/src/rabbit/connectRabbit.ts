import amqp from "amqplib";

export const connectRabbit = async () => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_HOST || "amqp://admin:admin@localhost:5672"
  );
  const channel = await connection.createChannel();

  return { connection, channel };
};
