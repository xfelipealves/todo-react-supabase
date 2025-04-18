import React, { useState, useEffect } from "react";
import supabase from "./helper/supabaseClient";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err.message);
    }
  }

  async function addTodo() {
    if (!title.trim()) {
      alert("Title cannot be empty or just spaces.");
      return;
    }
    try {
      const { error } = await supabase
        .from("todos")
        .insert([{ title: sanitizeInput(title) }]);
      if (error) throw error;

      setTitle("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err.message);
    }
  }

  async function deleteTodo(id) {
    if (!id) return;
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;

      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err.message);
    }
  }

  async function updateTodo(id, newTitle) {
    if (!newTitle || !newTitle.trim()) {
      alert("New title cannot be empty or just spaces.");
      return;
    }
    try {
      const { error } = await supabase
        .from("todos")
        .update({ title: sanitizeInput(newTitle) })
        .eq("id", id);
      if (error) throw error;

      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err.message);
    }
  }

  async function completeTodo(id) {
    if (!id) return;
    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: true })
        .eq("id", id);
      if (error) throw error;

      fetchTodos();
    } catch (err) {
      console.error("Error completing todo:", err.message);
    }
  }

  function sanitizeInput(input) {
    // Remove any potentially harmful characters
    return input.replace(/<[^>]*>?/gm, "").trim();
  }

  return (
    <div>
      <h1>Todo List</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add</button>

      <h2>Incomplete Todos</h2>
      <div>
        {todos
          .filter((t) => !t.completed)
          .map((todo) => (
            <div key={todo.id}>
              <span>{todo.title}</span>
              <button onClick={() => completeTodo(todo.id)}>Complete</button>
              <button
                onClick={() =>
                  updateTodo(todo.id, prompt("New title:", todo.title))
                }
              >
                Update
              </button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          ))}
      </div>

      <h2>Completed Todos</h2>
      <div>
        {todos
          .filter((t) => t.completed)
          .map((todo) => (
            <div key={todo.id}>
              <span>{todo.title}</span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;