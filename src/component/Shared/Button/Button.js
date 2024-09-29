export default function Button( props ) {
  return (
    <div
      className={`${props.padding} ${props.textColor} bg-primary font-rubik ${props.text} rounded-full font-bold cursor-pointer hover:scale-110 hover:bg-white hover:text-primary transition-scale ease-in-out duration-200`}
    >
     {props.name}
    </div>
  );
}
