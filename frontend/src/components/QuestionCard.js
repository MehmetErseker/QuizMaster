import './QuestionCard.css';

function QuestionCard({ q, index, total, onAnswer }) {
  return (
    <div className="question-card">
      <h3>
        Question {index + 1} / {total}
      </h3>
      <p dangerouslySetInnerHTML={{ __html: q.question }} />
      <ul>
        {q.options.map((opt) => (
          <li key={opt}>
            <button onClick={() => onAnswer(opt)}>{opt}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionCard;
