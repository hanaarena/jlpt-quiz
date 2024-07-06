import "./randomButton.css";

export default function RandomButton(props) {
  return (
    <button
      className={`button-85 ${props.className ?? ""}`}
      role="button"
      onClick={() => (props.onClick ? props.onClick() : void 0)}
    >
      {props.text}
    </button>
  );
}
