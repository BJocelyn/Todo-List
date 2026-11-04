import { useState } from 'react'
import './App.css'
import TodoList from './TodoList'

const todos = [
  { id: 1, title: 'Read Lesson Materials' },
  { id: 2, title: "Attend Mentor's Group Session" },
  { id: 3, title: 'Complete Assignment' }
]

function App() {
  const [todoList, setTodoList] = useState(todos)

  return (
    <div>
      <h1>Todo List</h1>
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App
