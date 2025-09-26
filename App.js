import ColorChangerApp from "./ColorChangerApp";
import CounterApp from "./CounterApp";

export default function RootLayout() {
  return (
    <div>
      <CounterApp />
      <ColorChangerApp />
    </div>
  );
}
