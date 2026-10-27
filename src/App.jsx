import './App.css'

function App() {
  const todoList = [
    {id: 1, title: 'Read Lesson Materials'},
    {id: 2, title: "Attend Mentor's Group Session"},
    {id:3 , title: 'Complete Assignment'}
  ]
  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todoList.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
