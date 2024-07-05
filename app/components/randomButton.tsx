import "./randomButton.css";

export default function RandomButton(props) {
  return (
    <button className="button-85" role="button">
      {props.text}
    </button>
  );
}
