import { Message } from "ai";

const Bubble = ({ message }: { message: Message }) => {
  const { role, content } = message;
  return (
    <div className={`bubble ${role}`}>{content}</div>
  )
};

export default Bubble;
