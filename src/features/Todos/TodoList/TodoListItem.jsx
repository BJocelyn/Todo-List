import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import { isValidTodoTitle } from '../../../utils/TodoValidation';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTodoTitle, setWorkingTodoTitle] = useState(todo.title);

  function handleEdit() {
    setWorkingTodoTitle(todo.title);
    setIsEditing(true);
  }

  function handleCancel() {
    setWorkingTodoTitle(todo.title);
    setIsEditing(false);
  }

  function handleUpdate(event) {
    event.preventDefault();

    if (!isValidTodoTitle(workingTodoTitle)) {
      return;
    }

    onUpdateTodo({
      ...todo,
      title: workingTodoTitle.trim(),
    });

    setIsEditing(false);
  }

  return (
    <li>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <TextInputWithLabel
            elementId={`editTodo-${todo.id}`}
            labelText="Edit Todo:"
            value={workingTodoTitle}
            onChange={(event) =>
              setWorkingTodoTitle(event.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={!isValidTodoTitle(workingTodoTitle)}
          >
            Save
          </button>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
          />

          <span onClick={handleEdit} role="button">
            {todo.title}
          </span>

          <button type="button" onClick={handleEdit}>
            Edit
          </button>
        </>
      )}
    </li>
  );
}

export default TodoListItem;
