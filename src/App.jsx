import React, { useState, useEffect } from "react";
import supabase from "./helper/supabaseClient";

function App() {

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (error) console.error(error);
    else setTodos(data);
  }

  async function addTodo() {
    if (!title.trim()) return;
    const {error} = await supabase
      .from("todos")
      .insert([{ title }]);
    if (error) console.error(error);
    else {
      setTitle("");
      fetchTodos();
    }
  }

  async function deleteTodo(id) {
    await supabase.from("todos").delete().eq("id", id);
    fetchTodos();
  }

  async function updateTodo(id, newTitle) {
    await supabase.from("todos").update({ title: newTitle }).eq("id", id);
    fetchTodos();
  }

  async function completeTodo(id) {
    await supabase.from("todos").update({ completed: true }).eq("id", id);
    fetchTodos();
  }

  return (
    <div>
      <h1>Todo List</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} 
      placeholder="Add a new todo" 
      />
      <button onClick={addTodo}>Add</button>

    <h2>Incomplete Todos</h2>
    <div>
      {
        todos
        .filter(t => !t.completed)
        .map(todo => (
          <div key={todo.id}>
            <span>{todo.title}</span>
            <button onClick={() => completeTodo(todo.id)}>Complete</button>
            <button onClick={() => updateTodo(todo.id, prompt("New title:", todo.title))}>Update</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))
      }
    </div>

    <h2>Completed Todos</h2>
    <div>
      {
        todos
        .filter(t => t.completed)
        .map(todo => (
          <div key={todo.id}>
            <span>{todo.title}</span>
            <button onClick={ ()=> deleteTodo(todo.id)}>Delete</button>
          </div>
        ))
      }
    </div>

    </div>
  );
}

export default App;