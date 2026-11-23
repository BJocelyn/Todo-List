import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  // Fetch Todos from the API
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsTodoListLoading(true);
        setError('');

        const response = await fetch('/api/tasks?page=0&limit=99', {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos.');
        }

        const data = await response.json();
        setTodoList(data.tasks);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsTodoListLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token]);

  // Add Todo
  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    // Optimistic update
    setTodoList((previousTodoList) => [
      newTodo,
      ...previousTodoList,
    ]);

    try {
      setError('');

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo.');
      }

      const data = await response.json();

      // Support the task object returned by the API
      const savedTodo = data.task ?? data.todo ?? data;

      if (savedTodo.id === undefined) {
        throw new Error('The server did not return a valid todo.');
      }

      // Replace temporary Todo with the saved Todo
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === newTodo.id ? savedTodo : todo
        )
      );
    } catch (error) {
      // Rollback optimistic update
      setTodoList((previousTodoList) =>
        previousTodoList.filter((todo) => todo.id !== newTodo.id)
      );

      setError(error.message);
    }
  }

  // Complete Todo
  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      return;
    }

    // Optimistic update
    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: true }
          : todo
      )
    );

    try {
      setError('');

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo.');
      }
    } catch (error) {
      // Rollback to original Todo
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === id ? originalTodo : todo
        )
      );

      setError(error.message);
    }
  }

  // Update Todo
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    if (!originalTodo) {
      return;
    }

    // Optimistic update
    setTodoList((previousTodoList) =>
      previousTodoList.map((todo) =>
        todo.id === editedTodo.id ? editedTodo : todo
      )
    );

    try {
      setError('');

      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo.');
      }
    } catch (error) {
      // Rollback to original Todo
      setTodoList((previousTodoList) =>
        previousTodoList.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );

      setError(error.message);
    }
  }

  return (
    <main>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setError('')}>
            Clear Error
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </main>
  );
}

export default TodosPage;
