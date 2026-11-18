import { useState, useRef } from 'react'

function TodoForm({ onAddTodo }) {

    const [workingTodoTitle, setWorkingTodoTitle] = useState('')

    const inputRef = useRef()

    const handleAddTodo = (event) => {
        event.preventDefault()

        onAddTodo(workingTodoTitle)
        setWorkingTodoTitle('')
        inputRef.current.focus()
    }
    
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">New Todo</label>
            <input 
            ref={inputRef}
            id="todoTitle"
            name="todoTitle"
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            required
            />
            <button 
            type="submit"
            disabled={!workingTodoTitle.trim()}
            >
            Add Todo
            </button>
        </form>
    )
}

export default TodoForm