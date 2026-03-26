import React, { createContext, useContext, useEffect, useState } from "react";
import mqtt from "mqtt";
import { IClientOptions } from "mqtt";
import { Buffer } from "buffer";

export interface MQTTStoreContextProps {
    data: any;
    publish: (message: any) => void;
}

const defaultValue: Partial<MQTTStoreContextProps> = {
    data: undefined,
    publish: () => { }
};

const MQTTStoreContext = createContext<MQTTStoreContextProps>(defaultValue as MQTTStoreContextProps);

export interface MQTTStoreProviderProps {
    children: React.ReactNode;
}

const MQTT_SERVER = {
    name: "Kombo MQTT",
    host: "10.79.3.200",
    mqttPort: 1883,
    wsPort: 8883,
    username: "admin",
    password: "Kontakt1234!",
    protocol: "wss://",
};

const MQTT_TOPIC = "Maintenance";

export function MQTTProvider(props: MQTTStoreProviderProps) {
    const { children } = props;
    const [localMessage, setLocalMessage] = useState<{ topic: string, message: any }>();
    const [client, setClient] = useState<mqtt.MqttClient>();
    const [data, setData] = useState<{ Topic: string, Value: any }>();
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        function clearTopic(): void {
            if (MQTT_TOPIC) {
                publish("{}");
            }
        }

        if (localMessage) {
            if (localMessage.topic === "Maintenance") {
                const decoder = new TextDecoder("utf-8");
                const jsonString = decoder.decode(localMessage.message);
                if (jsonString === "{}") {
                    setData(undefined);
                } else {
                    setData(JSON.parse(jsonString));
                    clearTopic();
                }
            }
        }
    }, [localMessage]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const options: IClientOptions = {
            hostname: MQTT_SERVER.host,
            port: MQTT_SERVER.wsPort,
            clientId: `mqtt_${Math.random().toString(16).substr(2, 8)}`,
            username: MQTT_SERVER.username,
            password: MQTT_SERVER.password,
            protocol: "wss",
            reconnectPeriod: 1000,
            keepalive: 60,
            clean: true,
            properties: {
                maximumPacketSize: 104857600,
            },
            path: "/mqtt",
            rejectUnauthorized: false
        };

        const mqttClient = mqtt.connect(options);

        mqttClient.on("connect", () => {
            mqttClient.subscribe(MQTT_TOPIC, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Subscribed to ${MQTT_TOPIC}`);
                }
            });
            setConnected(true);
        })

        mqttClient.on("close", () => {
            setConnected(false);
        });

        mqttClient.on("disconnect", () => {
            setConnected(false);
        });

        mqttClient.on("error", (error) => {
            console.log(error);
            setConnected(false);
        });

        mqttClient.on("message", (topic: string, message: any) => {
            setLocalMessage({ topic, message });
        });

        setClient(mqttClient);

    }, []);

    function publish(message: any): void {
        if (client && connected) {
            const buffer = Buffer.from(JSON.stringify(message));
            if (message === "{}") {
                client.publish(MQTT_TOPIC, "{}", { retain: true });
            } else {
                client.publish(MQTT_TOPIC, buffer);
            }
        }
    }

    return (
        <MQTTStoreContext.Provider
            value={{
                data,
                publish
            }}
        >
            {children}
        </MQTTStoreContext.Provider>
    );
}

export default function useMQTTStore() {
    return useContext(MQTTStoreContext);
}