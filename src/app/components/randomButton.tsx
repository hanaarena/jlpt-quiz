import "./randomButton.css";

export default function RandomButton(props) {
  return (
    <button
      className={`px-6 py-2 rounded bg-black text-white text-sm ${
        props.className ?? ""
      }`}
      role="button"
      onClick={() => (props.onClick ? props.onClick() : void 0)}
    >
      {props.text}
    </button>
  );
}
