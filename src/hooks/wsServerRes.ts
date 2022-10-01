export default function () {  
  const handleAdd = (roomId: string) => {
    const ws = new WebSocket(`ws://localhost:8080/ws/${roomId}`);
    ws.onopen = () => {
      console.log("connected");
    }
    ws.onmessage = (m) => {
      console.log("Got message from server: ", m.data);
    };
    ws.onclose = () => console.log("Disconnected from server");
  }

  return [handleAdd]
}